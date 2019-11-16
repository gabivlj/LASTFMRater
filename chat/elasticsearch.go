package main

import (
	"context"
	"fmt"
	"time"

	"github.com/olivere/elastic/v7"
)

type MessageElastic struct {
	User          string    `json:"user"`
	Text          string    `json:"textContent"`
	Date          time.Time `json:"date"`
	IndexPosition int64     `json:"indexPosition"`
	Users         []string  `json:"users"`
}

var (
	ctx context.Context = context.Background()
	// ClientElastic Connected client elastic
	ClientElastic *elastic.Client
	// ErrorConnectingClientElastic Error connecting client elastic
	ErrorConnectingClientElastic error
)

const mapping = `
{
	"settings":{
		"number_of_shards": 1,
		"number_of_replicas": 0
	},
	"mappings":{
		"properties":{
			"users":{
				"type":"keyword"
			},
			"user":{
				"type":"keyword"
			},
			"textContent":{
				"type":"text",
				"store": true,
				"fielddata": true
			},
			"date":{
				"type":"date"
			},
			"indexPosition": {
				"type":"long"
			}
		}
	}
}`

// InitElasticSearch connects with the elastic client
func InitElasticSearch() {
	url := "http://elasticsearch:9200"
	ClientElastic, ErrorConnectingClientElastic = elastic.NewClient(elastic.SetURL(url))
	fmt.Println("TRYING...")
	if ErrorConnectingClientElastic != nil {
		fmt.Println(ErrorConnectingClientElastic)
		ErrorConnectingClientElastic = nil
		fmt.Print("Error starting, retrying in 2s\n")
		time.Sleep(2 * time.Second)
		InitElasticSearch()
		return
	}
	fmt.Println("SUCCESS!")
}

// SaveMessage saves a message in elasticSearch client.
func SaveMessage(message *MessageChat) {
	messageElastic := MessageElastic{User: message.Username, Text: message.Message, Date: time.Now(), IndexPosition: message.IndexMessage, Users: []string{message.To, message.From}}
	res, err := ClientElastic.Index().Index("chat").BodyJson(messageElastic).Do(ctx)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Index: %s. Id: %s.", res.Index, res.Id)
}

// PingElastic Check if elastic client is up and runnin'
func PingElastic() {
	info, code, err := ClientElastic.Ping("http://elasticsearch:9200").Do(ctx)
	if err != nil {
		// Handle error
		panic(err)
	}
	fmt.Printf("Elasticsearch returned with code %d and version %s\n", code, info.Version.Number)
}

// RestartChat Don't use in production, deletes chat indexes.
func RestartChat() {
	ClientElastic.DeleteIndex("chat").Do(ctx)
}

// StartIndex Checks if a index exists, if it doesn't, create it.
func StartIndex(indexStarter string) {
	exists, err := ClientElastic.IndexExists(indexStarter).Do(ctx)
	if err != nil {
		panic(err)
	}

	if exists == false {
		createIndex, err := ClientElastic.CreateIndex(indexStarter).BodyString(mapping).Do(ctx)
		// createIndex, err := client.CreateIndex("chat").Do(ctx)
		if err != nil {
			// Handle error
			panic(err)
		}
		if !createIndex.Acknowledged {
			// Not acknowledged
		}
	}
}
