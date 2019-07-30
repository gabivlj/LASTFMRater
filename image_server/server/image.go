package server

import (
	"encoding/json"
	"image"
	"image/color"
	"image/jpeg"
	"image/png"
	"io"
	"net/http"
	"os"
	"strings"
	"sync"

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
	splitted := strings.Split(handler.Filename, ".")[0]
	// Name declarations.
	nameOriginal := splitted + "-0.jpeg"
	nameMd := splitted + "-1.jpeg"
	nameSm := splitted + "-2.jpeg"
	nameLz := splitted + "-3.jpeg"

	f, err := os.Create("./temp/" + nameOriginal)
	fmd, err := os.Create("./temp/" + nameMd)
	fsm, err := os.Create("./temp/" + nameSm)
	flz, err := os.Create("./temp/" + nameLz)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := map[string]interface{}{"line": 46, "status": false, "message": err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	defer f.Close()
	// decode the file TODO: Maybe change this to all kind of images...
	image, err := png.Decode(file)
	if err != nil {
		response := map[string]interface{}{"line": 53, "status": false, "message": err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var wg sync.WaitGroup
	wg.Add(4)
	// save image in the file. TODO: Later we will refactoring to concurrency.
	go saveImage(image, f, 650, true, w, &wg)
	go saveImage(image, fmd, 500, true, w, &wg)
	go saveImage(image, fsm, 200, true, w, &wg)
	go saveImage(image, flz, 50, true, w, &wg)
	wg.Wait()

	defer file.Close()
	response := map[string]interface{}{"status": true, "message": "Image uploaded succesfuly"}
	json.NewEncoder(w).Encode(response)
	return
}

func saveImage(img image.Image, f io.Writer, width int, doResize bool, w http.ResponseWriter, wg *sync.WaitGroup) {
	if doResize {
		img = resize(img, width)
	}
	err := jpeg.Encode(f, img, nil)
	if err != nil {
		response := map[string]interface{}{"line": 60, "status": false, "message": err.Error()}
		json.NewEncoder(w).Encode(response)
		wg.Done()
		return
	}
	wg.Done()
}

func resize(in image.Image, newWidth int) *image.NRGBA {
	// implement the image interface
	bounds := in.Bounds()
	// get the radio dividing with by the newWidth
	ratio := bounds.Dx() / newWidth
	// new RGBA with the new resolution
	out := image.NewNRGBA(image.Rect(bounds.Min.X/ratio, bounds.Min.X/ratio, bounds.Max.X/ratio, bounds.Max.Y/ratio))
	// algorithm
	for y, j := bounds.Min.Y, bounds.Min.Y; y < bounds.Max.Y; y, j = y+ratio, j+1 {
		for x, i := bounds.Min.X, bounds.Min.X; x < bounds.Max.X; x, i = x+ratio, i+1 {
			r, g, b, a := in.At(x, y).RGBA()
			out.SetNRGBA(i, j, color.NRGBA{uint8(r >> 8), uint8(g >> 8), uint8(b >> 8), uint8(a >> 8)})
		}
	}
	return out
}
