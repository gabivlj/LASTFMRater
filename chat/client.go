package main

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

type ChanMessage struct {
	bytes   []byte
	message *MessageChat
}

// ClientManager :: The client manager, handles goroutines.
type ClientManager struct {
	clients    map[*Client]bool
	clientsStr map[string]uint16
	broadcast  chan *ChanMessage
	register   chan *Client
	unregister chan *Client
	friends    chan *Client
	gramps     chan []string
	users      map[string]*User
}

var manager = ClientManager{
	broadcast:  make(chan *ChanMessage),
	register:   make(chan *Client),
	unregister: make(chan *Client),
	clients:    make(map[*Client]bool),
	clientsStr: make(map[string]uint16),
	friends:    make(chan *Client),
	gramps:     make(chan []string),
	users:      make(map[string]*User),
}

type ListOfFriends struct {
	Friends map[string]bool `json:"friends"`
	Type    string          `json:"type"`
}

// FUTURE...
type User struct {
	username  string
	userID    string
	friends   []string
	followers []string
	following []string
	clients   []*Client
}

// Client :: Client struct.
type Client struct {
	username               string
	socket                 *websocket.Conn
	send                   chan []byte
	id                     string
	UserID                 string
	MainUser               *User
	friends                []string
	followers              []string
	following              []string
	bearerToken            string
	lastSent               string
	connected              chan map[string]bool
	newFriendConnection    chan *Client
	newFriendDisconnection chan *Client
}

// Message ..
type Message struct {
	Sender    string `json:"sender,omitempty"`
	Recipient string `json:"recipient,omitempty"`
	Content   string `json:"content,omitempty"`
}

type MessageChat struct {
	Username     string   `json:"username,omitempty"`
	UserID       string   `json:"userId,omitempty"`
	From         string   `json:"from,omitempty"`
	To           string   `json:"to,omitempty"`
	Message      string   `json:"message,omitempty"`
	Type         string   `json:"type,omitempty"`
	Friends      []string `json:"friends,omitempty"`
	Following    []string `json:"following,omitempty"`
	Followers    []string `json:"followers,omitempty"`
	Jwt          string   `json:"jwt,omitempty"`
	IndexMessage int64    `json:"indexMessage,omitempty"`
}

func (manager *ClientManager) start() {
	for {
		select {
		case connection := <-manager.register:
			manager.clients[connection] = true
			fmt.Println("new connection ", connection.id)

		case connection := <-manager.unregister:
			if _, ok := manager.clients[connection]; ok {
				// Check if element exists
				if manager.clientsStr[connection.MainUser.userID] > 0 {
					manager.clientsStr[connection.MainUser.userID]--
					InformFriendsOfConnection(connection, false, manager.clientsStr[connection.MainUser.userID] <= 0)
					if manager.clientsStr[connection.MainUser.userID] <= 0 {
						manager.users[connection.MainUser.userID] = nil
					}
				}
				message := &MessageChat{Message: "/Bye bye!", Type: "DISCONNECT"}
				jsonMessage, _ := json.Marshal(message)
				manager.send(jsonMessage, connection)
				// Inform friends of disconnection... If they have other sessions open dont inform...
				close(connection.send)
				close(connection.connected)
				close(connection.newFriendConnection)
				close(connection.newFriendDisconnection)
				delete(manager.clients, connection)

				fmt.Println("closed connection")
			}

		case message := <-manager.broadcast:
			for connection := range manager.clients {
				if connection.MainUser.userID != message.message.To && connection.MainUser.userID != message.message.UserID {
					continue
				}
				select {
				case connection.send <- message.bytes:
				}
			}
		case friends := <-manager.friends:
			// We check if the user just connected or is just updating friend list.
			isFriendListUpdate := friends.lastSent == "UpdateFriendList"
			_, ok := manager.clientsStr[friends.MainUser.userID]
			if !ok {
				manager.clientsStr[friends.MainUser.userID] = 1
			} else {
				manager.clientsStr[friends.MainUser.userID]++
			}
			if isFriendListUpdate {
				manager.clientsStr[friends.UserID]--
			}
			if _, ok := manager.clients[friends]; ok {
				mapFriends := InformFriendsOfConnection(friends, true, manager.clientsStr[friends.MainUser.userID] >= 1 && !isFriendListUpdate)
				fmt.Print(mapFriends)
				select {
				// Send to socket all of his connected/disconnected friends.
				case friends.connected <- mapFriends:
				}
			}

		case followers := <-manager.gramps:
			message := MessageChat{Type: "NewGramp"}
			for _, id := range followers {
				for client, ok := range manager.clients {
					if !ok {
						continue
					}
					if client.MainUser.userID == id {
						bytesMessage, err := json.Marshal(message)
						if err != nil {
							continue
						}
						client.send <- bytesMessage
						break
					}
				}
			}

		}
	}
}

// write:: Gets a message and writes to the client.
func (c *Client) write() {
	defer func() {
		manager.unregister <- c
		c.socket.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				c.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			// Send to client.
			c.socket.WriteMessage(websocket.TextMessage, message)

			// Return all the connected list of friends. (Comes from Open -> manager -> this)
		case message, ok := <-c.connected:
			if !ok {
				c.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			j := map[string]interface{}{"friends": message, "type": "ListOfFriends"}
			data, err := json.Marshal(j)
			if err != nil {
				fmt.Println(err.Error())
				continue
			}
			err = c.socket.WriteMessage(websocket.TextMessage, data)
			if err != nil {
				fmt.Println(err)
			}
			// Inform a friend has conencted. (Comes from Open -> manager -> this)
		case message, ok := <-c.newFriendConnection:
			if !ok {
				c.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			j := map[string]interface{}{"type": "NewFriendConnected", "userId": message.UserID, "username": message.username}
			data, err := json.Marshal(j)
			if err != nil {
				fmt.Println(err)
				continue
			}
			err = c.socket.WriteMessage(websocket.TextMessage, data)
			if err != nil {
				fmt.Println(err)
			}
		case message, ok := <-c.newFriendDisconnection:
			if !ok {
				c.socket.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			j := map[string]interface{}{"type": "NewFriendDisconnected", "userId": message.UserID}
			data, err := json.Marshal(j)
			if err != nil {
				fmt.Println(err)
				continue
			}
			err = c.socket.WriteMessage(websocket.TextMessage, data)
			if err != nil {
				fmt.Println(err)
			}
		}
	}
}

func (manager *ClientManager) send(message []byte, client *Client) {
	for conn := range manager.clients {
		if conn != client {
			conn.send <- message
		}
	}
}

// read :: Reads the message sent from user.
func (c *Client) read() {

	// if for some reason we exit the forloop we execute this.
	defer func() {
		manager.unregister <- c
		c.socket.Close()
	}()

	testID := 0
	for {
		_, message, err := c.socket.ReadMessage()
		if err != nil {
			manager.unregister <- c
			c.socket.Close()
			break
		}
		msg := &MessageChat{IndexMessage: -1}
		er := json.Unmarshal(message, msg)
		if er != nil {
			c.socket.WriteMessage(websocket.CloseMessage, []byte{})
			fmt.Println(er.Error())
			continue
		}
		ok := false
		errorMsg := ""
		fmt.Println(msg)
		if c.bearerToken == "" {
			ok = checkJWT(msg)
			errorMsg = "Error checking for a bearer token."
		} else {
			ok = checkCreds(c, msg)
			errorMsg = "INVALID TOKEN"
		}
		fmt.Println(ok)

		if !ok {
			c.socket.WriteMessage(websocket.TextMessage, []byte(errorMsg))
			break
		}

		c.lastSent = msg.Type

		switch msg.Type {
		// When someone connects
		case "Open":
			if manager.users[msg.UserID] == nil {
				manager.users[msg.UserID] = &User{following: msg.Following, followers: msg.Followers, userID: msg.UserID, username: msg.Username, friends: msg.Friends}
			}
			fmt.Println(manager.users[msg.UserID])
			c.bearerToken = msg.Jwt
			c.UserID = msg.UserID
			c.username = msg.Username
			c.MainUser = manager.users[msg.UserID]
			msg.Jwt = ""
			manager.friends <- c

			continue
			// When user gets followed.
		case "NewGramp":
			// new activity for followers
			msg.Jwt = ""
			manager.gramps <- c.MainUser.followers
			continue
			// GONNA BE DEPRECATED
		case "UpdateFriendList":
		case "Followed":
			// needs: to (userId). -> So we can inform their front end and they can do whatever they need to.
			msg.Jwt = ""
			msg.Message = c.username + " followed you!"
			c.MainUser.following = append(c.MainUser.following, msg.To)
			u, ok := manager.users[msg.To]
			if ok && u != nil {
				manager.users[msg.To].followers = append(manager.users[msg.To].followers, msg.UserID)
				for _, user := range manager.users[msg.To].following {
					if user == msg.UserID {
						c.lastSent = "UpdateFriendList"
						msg.Message = c.username + " and you now are friends!"
						c.MainUser.friends = append(c.MainUser.friends, msg.To)
						manager.users[msg.To].friends = append(manager.users[msg.To].friends, msg.UserID)
						manager.friends <- c
					}
				}
			}
		case "Unfollowed":
			msg.Jwt = ""
			msg.Message = c.username + " unfollowed you!"
			c.MainUser.following = remove(c.MainUser.following, msg.To)
			u, ok := manager.users[msg.To]
			if ok && u != nil {
				manager.users[msg.To].followers = remove(manager.users[msg.To].followers, msg.UserID)
				for _, user := range manager.users[msg.To].friends {
					if user == msg.UserID {
						c.lastSent = "UpdateFriendList"
						c.MainUser.friends = remove(c.MainUser.friends, msg.To)
						msg.Message = c.username + " and you are no longer friends :("
						manager.users[msg.To].friends = remove(manager.users[msg.To].friends, msg.UserID)
						manager.friends <- c
					}
				}
			}
		case "Send":
		case "Find":

		case "Message":
			if msg.IndexMessage == -1 {
				// b, err := json.Marshal(map[string]string{"error": "Index for the message is missing !"})
				// if err != nil {
				// 	fmt.Print("Error formatting the json:\n")
				// 	fmt.Print(err)
				// }
				// c.socket.WriteMessage(websocket.TextMessage, b)

				// continue
				testID++
				msg.IndexMessage = int64(testID)
			}
			SaveMessage(msg)
		default:
		}
		msg.Jwt = ""
		bytesMessage, err := json.Marshal(msg)
		if err != nil {
			c.socket.WriteMessage(websocket.TextMessage, []byte("Error parsing message!"))
		}
		finalMsg := &ChanMessage{message: msg, bytes: bytesMessage}
		manager.broadcast <- finalMsg
	}
}
