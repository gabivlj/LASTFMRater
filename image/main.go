package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	// server "github.com/gabivlj/grumpy_image_server/server"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"image_grampy/mongodb"
	"image_grampy/server"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println(".env file not found.")
		return
	}
	ok, ok2, ok3 := false, false, false
	server.Key, ok = os.LookupEnv("CLIENT_KEY")
	server.SecretKey, ok2 = os.LookupEnv("SECRET_OR_KEY")
	server.GoogleKey, ok3 = os.LookupEnv("GOOGLE_KEY")

	if !ok || !ok2 || !ok3 {
		fmt.Println("not ok")
		fmt.Printf("%s, %s, %s, %s", ok, ok2, server.Key, server.SecretKey)
		return
	}

	mongoURI, okMongo := os.LookupEnv("MONGO_KEY")

	if !okMongo {
		fmt.Println("No ok mongo")
		return
	}

	clientOptions := options.Client().ApplyURI(mongoURI)

	if client, errMongo := mongo.Connect(context.TODO(), clientOptions); errMongo != nil {
		fmt.Println("Mongo error!")
		fmt.Print(errMongo)
	} else {
		mongodb.SetClient(client)
		fmt.Println("Connected mongo!")
	}

	port := "2222"
	router := mux.NewRouter()
	router.Use(server.TokenAuth)
	// CORS ...
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Origin", "Content-Type", "X-Auth-Token", "Authorization", "CLIENT_KEY"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	// When in the future we use .env variables...
	if port == "" {
		port = "2222" //localhost
	}
	fmt.Println("Port connected! Golang server up and runnin... 🐳 🐳 🐳  Port: " + port)
	// router.HandleFunc("/api/login", server.LogIn).Methods("POST")
	router.HandleFunc("/api/image/{id}", server.ServeImage).Methods("GET")
	// router.HandleFunc("/api/image_header/", server.SaveAlbumHeader).Methods("POST")
	// TODO Uncomment this on production
	// router.Use(JwtAuthentication)
	router.HandleFunc("/api/image", server.GetImage).Methods("POST")
	log.Fatal(http.ListenAndServe(":"+port, handlers.CORS(originsOk, headersOk, methodsOk)(router)))

}
