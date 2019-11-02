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
}

var manager = ClientManager{
	broadcast:  make(chan *ChanMessage),
	register:   make(chan *Client),
	unregister: make(chan *Client),
	clients:    make(map[*Client]bool),
	clientsStr: make(map[string]uint16),
	friends:    make(chan *Client),
	gramps:     make(chan []string),
}

type ListOfFriends struct {
	Friends map[string]bool `json:"friends"`
	Type    string          `json:"type"`
}

// Client :: Client struct.
type Client struct {
	username               string
	socket                 *websocket.Conn
	send                   chan []byte
	id                     string
	UserID                 string
	friends                []string
	bearerToken            string
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
	Username string   `json:"username,omitempty"`
	UserID   string   `json:"userId,omitempty"`
	From     string   `json:"from,omitempty"`
	To       string   `json:"to,omitempty"`
	Message  string   `json:"message,omitempty"`
	Type     string   `json:"type,omitempty"`
	Friends  []string `json:"friends,omitempty"`
	Jwt      string   `json:"jwt,omitempty"`
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
				if manager.clientsStr[connection.UserID] > 0 {
					manager.clientsStr[connection.UserID]--
					InformFriendsOfConnection(connection, false, manager.clientsStr[connection.UserID] <= 0)
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
				if connection.UserID != message.message.To && connection.UserID != message.message.UserID {
					continue
				}
				select {
				case connection.send <- message.bytes:
				default:
					close(connection.send)
					delete(manager.clients, connection)
				}
			}
		case friends := <-manager.friends:
			_, ok := manager.clientsStr[friends.UserID]
			if !ok {
				manager.clientsStr[friends.UserID] = 1
			} else {
				manager.clientsStr[friends.UserID]++
			}
			fmt.Println(manager.clientsStr[friends.UserID])
			if _, ok := manager.clients[friends]; ok {
				mapFriends := InformFriendsOfConnection(friends, true, manager.clientsStr[friends.UserID] >= 1)
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
					if client.UserID == id {
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

	for {
		_, message, err := c.socket.ReadMessage()
		if err != nil {
			manager.unregister <- c
			c.socket.Close()
			break
		}
		msg := &MessageChat{}
		er := json.Unmarshal(message, msg)
		if er != nil {
			c.socket.WriteMessage(websocket.CloseMessage, []byte{})
			fmt.Println(er.Error())
			continue
		}
		ok := false
		errorMsg := ""

		if c.bearerToken == "" {
			ok = checkJWT(msg)
			errorMsg = "Error checking for a bearer token."
		} else {
			ok = checkCreds(c, msg)
			errorMsg = "INVALID TOKEN"
		}

		if !ok {
			c.socket.WriteMessage(websocket.TextMessage, []byte(errorMsg))
			break
		}

		switch msg.Type {
		// When someone connects
		case "Open":
			c.bearerToken = msg.Jwt
			c.UserID = msg.UserID
			c.username = msg.Username
			c.friends = msg.Friends
			msg.Jwt = ""
			manager.friends <- c
			continue
			// When user gets followed.
		case "NewGramp":
			// new activity for followers
			msg.Jwt = ""
			manager.gramps <- msg.Friends
			continue
		case "UpdateFriendList":
			c.friends = msg.Friends
		case "Followed":
			// needs: to (userId). -> So we can inform their front end and they can do whatever they need to.
			msg.Jwt = ""
			msg.Message = c.username + " followed you!"
			// When someone sends a message
		case "Unfollowed":
			msg.Jwt = ""
			msg.Message = c.username + " unfollowed you!"
		case "Send":
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
