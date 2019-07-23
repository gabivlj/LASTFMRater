package server

import (
	"encoding/json"
	"fmt"
	"image/jpeg"
	"image/png"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
)

// ServeImage ...
func ServeImage(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	img, err := os.Open("./temp/" + id + ".jpeg")
	if err != nil {
		w.Header().Add("Content-Type", "application/json")
		response := map[string]interface{}{"status": false, "message": err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}
	defer img.Close()
	w.Header().Set("Content-Type", "image/jpeg")
	io.Copy(w, img)
}

// GetImage ...
func GetImage(w http.ResponseWriter, r *http.Request) {
	file, handler, err := r.FormFile("grumpy-file")
	w.Header().Add("Content-Type", "application/json")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := map[string]interface{}{"status": false, "message": err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}
	name := strings.Split(handler.Filename, ".")[0] + ".jpeg"

	fmt.Println(name)
	f, err := os.Create("./temp/" + name)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := map[string]interface{}{"line": 46, "status": false, "message": err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}
	defer f.Close()
	image, err := png.Decode(file)
	if err != nil {
		response := map[string]interface{}{"line": 53, "status": false, "message": err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}
	err = jpeg.Encode(f, image, nil)

	if err != nil {
		response := map[string]interface{}{"line": 60, "status": false, "message": err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}
	defer file.Close()
	response := map[string]interface{}{"status": true, "message": "Image uploaded succesfuly"}
	json.NewEncoder(w).Encode(response)
	return
}
