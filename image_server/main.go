package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	server "github.com/gabivlj/grumpy_image_server/server"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println(".env file not found.")
		return
	}

	ok := false
	server.Key, ok = os.LookupEnv("CLIENT_KEY")

	if !ok {
		fmt.Println("not ok")
		return
	}

	port := "2222"
	router := mux.NewRouter()
	router.Use(server.TokenAuth)
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Origin", "Content-Type", "X-Auth-Token", "Authorization", "CLIENT_KEY"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	// When in the future we use .env variables...
	if port == "" {
		port = "2222" //localhost
	}
	fmt.Println("Port connected! Golang server up and runnin... 🐳 🐳 🐳  Port: " + port)

	router.HandleFunc("/api/image/{id}", server.ServeImage).Methods("GET")
	router.HandleFunc("/api/image", server.GetImage).Methods("POST")
	log.Fatal(http.ListenAndServe(":"+port, handlers.CORS(originsOk, headersOk, methodsOk)(router)))

}
