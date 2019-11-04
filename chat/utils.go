package main

import (
	"strings"

	"github.com/dgrijalva/jwt-go"
)

type Token struct {
	Email  string `json:"email"`
	Lastfm string `json:"lastfm"`
	User   string `json:"user"`
	ID     string `json:"id"`
	jwt.StandardClaims
}

// InformFriendsOfConnection :: Takes a Client type and finds in their friendlist the correspondent client socket and sends them if they just connected or disconnected
func InformFriendsOfConnection(friends *Client, connected bool, inform bool) map[string]bool {
	mapFriends := make(map[string]bool)
	for _, friend := range friends.MainUser.friends {
		mapFriends[friend] = manager.clientsStr[friend] > 0
		if mapFriends[friend] && inform {
			for client, ok := range manager.clients {
				if ok && client.MainUser.userID == friend {
					if connected {
						client.newFriendConnection <- friends
					} else {
						client.newFriendDisconnection <- friends
					}
				}
			}
		}
	}
	return mapFriends
}

func checkCreds(client *Client, message *MessageChat) bool {
	if client.bearerToken != message.Jwt {
		return false
	}
	if client.UserID != message.UserID {
		return false
	}
	if client.username != message.Username {
		return false
	}
	return true
}

func checkJWT(msg *MessageChat) bool {
	if msg.Jwt == "" {
		return false
	}
	splitted := strings.Split(msg.Jwt, " ")
	if len(splitted) != 2 {
		return false
	}
	tokenPart := splitted[1]
	tk := &Token{}
	token, err := jwt.ParseWithClaims(tokenPart, tk, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	if err != nil || !token.Valid {
		return false
	}
	if tk.User != msg.Username {
		return false
	}
	if tk.ID != msg.UserID {
		return false
	}
	return true

}

func (newInformation *Client) updateAllSameUserClientsInfo(mapFriends map[string]bool) {
	for client, ok := range manager.clients {
		if !ok && client.UserID != newInformation.UserID {
			continue
		}
		client.friends = newInformation.friends
		select {
		case client.connected <- mapFriends:
		}
	}
}

func remove(arr []string, element string) []string {
	indexFound := -1
	for index, el := range arr {
		if element == el {
			indexFound = index
			break
		}
	}
	if indexFound < 0 {
		return arr
	}
	arr[len(arr)-1], arr[indexFound] = arr[indexFound], arr[len(arr)-1]
	return arr[:len(arr)-1]
}
