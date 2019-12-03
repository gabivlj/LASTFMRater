package mongodb

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var client *mongo.Client

// SetClient Sets the client
func SetClient(c *mongo.Client) {
	client = c
}

// GetCollection ...
func GetCollection(s string) *mongo.Collection {
	return client.Database("main").Collection(s)
}

// Get Gets the client
func Get() *mongo.Client {
	return client
}

// PassObjectIDToString ...
func PassObjectIDToString(ins interface{}) (string, error) {
	if oid, ok := ins.(primitive.ObjectID); ok {
		return oid.String(), nil
	} else {
		// Not objectid.ObjectID, do what you want
		return "", fmt.Errorf("Error parsing the objectID")
	}
}
