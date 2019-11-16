package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	uuid "github.com/satori/go.uuid"
)

var SecretKey string = ""

func wsPage(res http.ResponseWriter, req *http.Request) {

	conn, error := (&websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}).Upgrade(res, req, nil)
	if error != nil {
		http.NotFound(res, req)
		return
	}
	uid := uuid.NewV4()

	client := &Client{
		id:                     uid.String(),
		socket:                 conn,
		send:                   make(chan []byte),
		connected:              make(chan map[string]bool),
		newFriendConnection:    make(chan *Client),
		newFriendDisconnection: make(chan *Client),
		friends:                make([]string, 0),
	}
	manager.register <- client
	go client.read()
	go client.write()
}

func startServer() {
	fmt.Println("Starting app...")
	go manager.start()
	http.HandleFunc("/ws", wsPage)
	http.ListenAndServeTLS(":1443", "server.crt", "server.key", nil)
	http.ListenAndServe(":1234", nil)
}

func main() {
	ok := false
	if err := godotenv.Load(); err != nil {
		fmt.Println(".env file not found.")
		return
	}
	SecretKey, ok = os.LookupEnv("SECRET_KEY")

	InitElasticSearch()

	PingElastic()

	// Uncomment when testing.
	RestartChat()

	StartIndex("chat")

	if !ok {
		fmt.Println("Error.")
		return
	}

	startServer()
}
