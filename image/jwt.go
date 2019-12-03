package main

import (
	"context"
	"encoding/json"
	"fmt"

	"net/http"
	"strings"

	"github.com/gabivlj/image_server_grampy/server"


	"github.com/dgrijalva/jwt-go"
)

type Token struct {
	Email  string `json:"email"`
	Lastfm string `json:"lastfm"`
	User   string `json:"user"`
	ID     string `json:"id"`
	jwt.StandardClaims
}

var JwtAuthentication = func(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			next.ServeHTTP(w, r)
			return
		}
		response := make(map[string]interface{})
		tokenHeader := r.Header.Get("Authorization")
		if tokenHeader == "" {
			response := map[string]interface{}{"status": 404, "message": "Bad token."}
			w.WriteHeader(http.StatusForbidden)
			w.Header().Add("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}

		splitted := strings.Split(tokenHeader, " ")
		if len(splitted) != 2 {
			response := map[string]interface{}{"status": 404, "message": "Bad token."}
			w.WriteHeader(http.StatusBadRequest)
			w.Header().Add("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}
		tokenPart := splitted[1]
		tk := &Token{}
		token, err := jwt.ParseWithClaims(tokenPart, tk, func(token *jwt.Token) (interface{}, error) {
			return []byte(server.SecretKey), nil
		})
		if err != nil || !token.Valid {
			response = map[string]interface{}{"status": 404, "message": "Bad token."}
			w.WriteHeader(http.StatusForbidden)
			w.Header().Add("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			return
		}
		fmt.Printf("User %s", tk.User)
		type contextKey string
		ctx := context.WithValue(r.Context(), contextKey("user"), tk.ID)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})

}
