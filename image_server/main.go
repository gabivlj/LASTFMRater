package main

import (
	"fmt"
	"net/http"

	server "github.com/gabivlj/grumpy_image_server/server"
	"github.com/gorilla/mux"
)

func main() {
	port := "2222"
	router := mux.NewRouter()
	router.Use(server.Cors)
	if port == "" {
		port = "2222" //localhost
	}
	fmt.Print(port)
	router.HandleFunc("/api/image/{id}", server.ServeImage).Methods("GET")
	router.HandleFunc("/api/image", server.GetImage).Methods("POST")
	err := http.ListenAndServe(":"+port, router)
	if err != nil {
		fmt.Print(err)
	}

}
