package server

import (
	"encoding/json"
	"net/http"
	"strings"
)

// Key that needs to be included on POST requests.
var Key string

// Cors ::: enable cors, (DEPRECATED FOR THIS PROJECT ATM)
var Cors = func(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		next.ServeHTTP(w, r)
	})
}

func isSocketRequest(s string) bool {
	str := strings.Split(s, "/")[0]
	if str != "socket" {
		return false
	}
	return true
}

// TokenAuth ...
// Authentifies that any post request is authentified by the provided keys.
var TokenAuth = func(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" || isSocketRequest(r.URL.Path) {
			headerKey := r.Header.Get("CLIENT_KEY")
			if headerKey == "" || headerKey != Key {
				w.Header().Add("Content-Type", "application/json")
				msg := map[string]interface{}{"err": "Unauthorized"}
				_ = json.NewEncoder(w).Encode(msg)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
