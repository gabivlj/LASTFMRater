package server

import "github.com/dgrijalva/jwt-go"

type LogInBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Album struct {
	ImageHeader string `json:"imageHeader"`
	// Artist string `json:"artist"`
	ID string `json:"_id"`
}

type JwtSigning struct {
	Email string `json:"email"`
	jwt.StandardClaims
}
