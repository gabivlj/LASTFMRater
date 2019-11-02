package server

type LogInBody struct {
	email    string `json:"email"`
	password string `json:"password"`
}

type JwtSigning struct {
	email string `json:"email"`
}
