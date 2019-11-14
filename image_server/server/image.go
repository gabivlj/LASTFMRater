package server

import (
	"encoding/json"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"

	// yes
	_ "image/png"
	"io"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/gorilla/mux"
)

var SecretKey string

// // LogIn Logs in with mongodb.
// func LogIn(w http.ResponseWriter, r *http.Request) {
// 	logInCreds := &LogInBody{}
// 	json.NewDecoder(r.Body).Decode(logInCreds)
// 	w.Header().Add("Content-Type", "application/json")
// 	if logInCreds.Email == "" || logInCreds.Password == "" {
// 		response := map[string]interface{}{"status": false, "message": "Bad credentials"}
// 		json.NewEncoder(w).Encode(response)
// 		return
// 	}
// 	user := mongodb.GetCollection("users").FindOne(context.TODO(), map[string]string{"email": logInCreds.Email})
// 	userJSON := &LogInBody{}
// 	err := user.Decode(userJSON)
// 	if err != nil {
// 		fmt.Println(err)
// 		response := map[string]interface{}{"status": false, "message": "Bad credentials"}
// 		json.NewEncoder(w).Encode(response)
// 		return
// 	}
// 	err = bcrypt.CompareHashAndPassword([]byte(userJSON.Password), []byte(logInCreds.Password))
// 	if err != nil {
// 		fmt.Println(err)
// 		response := map[string]interface{}{"status": false, "message": "Bad credentials"}
// 		json.NewEncoder(w).Encode(response)
// 		return
// 	}
// 	tk := JwtSigning{Email: userJSON.Email}
// 	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
// 	tokenStr, _ := token.SignedString([]byte(SecretKey))
// 	response := map[string]interface{}{"status": true, "token": tokenStr}
// 	json.NewEncoder(w).Encode(response)
// }

// ServeImage ...
func ServeImage(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	includedJpeg := strings.Index(".jpeg", id)
	openStr := "./temp/" + id
	if includedJpeg < 0 {
		openStr += ".jpeg"
	}
	img, err := os.Open("./temp/" + id)
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

// GetImage : Gets the image from the client and saves 4 resolutions (high, medium, low, lazyloadingmode) with the goroutine way.
func GetImage(w http.ResponseWriter, r *http.Request) {
	// Header for json
	w.Header().Add("Content-Type", "application/json")
	// Open grumpy-file form
	file, handler, err := r.FormFile("grumpy-file")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := map[string]interface{}{"status": false, "message": err.Error()}
		fmt.Println(response)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Decodes original file image.
	image, _, err := image.Decode(file)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := map[string]interface{}{"line": 53, "status": false, "message": err.Error()}
		fmt.Println(response)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Start saving the decodified image file.
	splitted := strings.Split(handler.Filename, ".")[0]
	// Name declarations.
	nameOriginal := splitted + "-0.jpeg"
	nameMd := splitted + "-1.jpeg"
	nameSm := splitted + "-2.jpeg"
	nameLz := splitted + "-3.jpeg"

	// Create files.
	f, err := os.Create("./temp/" + nameOriginal)
	fmd, err := os.Create("./temp/" + nameMd)
	fsm, err := os.Create("./temp/" + nameSm)
	flz, err := os.Create("./temp/" + nameLz)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := map[string]interface{}{"line": 46, "status": false, "message": err.Error()}
		fmt.Println(response)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Remember to close image files.
	defer f.Close()
	defer fmd.Close()
	defer fsm.Close()
	defer flz.Close()

	// Concurrent save image
	var wg sync.WaitGroup
	wg.Add(4)
	go saveImage(image, f, 650, true, w, &wg)
	go saveImage(image, fmd, 500, true, w, &wg)
	go saveImage(image, fsm, 200, true, w, &wg)
	go saveImage(image, flz, 50, true, w, &wg)
	wg.Wait()
	defer file.Close()

	response := map[string]interface{}{"status": true, "message": "Image uploaded succesfuly", "lz": nameLz, "md": nameMd, "lg": nameOriginal, "sm": nameSm}
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
	if ratio == 0 {
		ratio = 1
	}
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
