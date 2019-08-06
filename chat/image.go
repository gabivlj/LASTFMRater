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
	broadcast  chan *ChanMessage
	register   chan *Client
	unregister chan *Client
}

// Client :: Client struct.
type Client struct {
	socket *websocket.Conn
	send   chan []byte
	id     string
	UserID string
}

// Message ..
type Message struct {
	Sender    string `json:"sender,omitempty"`
	Recipient string `json:"recipient,omitempty"`
	Content   string `json:"content,omitempty"`
}

type MessageChat struct {
	UserID  string `json:"userId"`
	From    string `json:"from"`
	To      string `json:"to"`
	Message string `json:"message"`
	Type    string `json:"type"`
}

var manager = ClientManager{
	broadcast:  make(chan *ChanMessage),
	register:   make(chan *Client),
	unregister: make(chan *Client),
	clients:    make(map[*Client]bool),
}

func (manager *ClientManager) start() {
	for {
		select {
		case connection := <-manager.register:
			manager.clients[connection] = true
			message := &Message{Content: "/A new socket!"}
			jsonMessage, _ := json.Marshal(message)
			manager.send(jsonMessage, connection)
			fmt.Println("new connection")

		case connection := <-manager.unregister:
			// Check if element exists
			if _, ok := manager.clients[connection]; ok {
				close(connection.send)
				delete(manager.clients, connection)
				message := &Message{Content: "/Bye bye!"}
				jsonMessage, _ := json.Marshal(message)
				manager.send(jsonMessage, connection)
				fmt.Println("closed connection")
			}
		case message := <-manager.broadcast:
			for connection := range manager.clients {
				if connection.UserID != message.message.To {
					continue
				}
				select {
				case connection.send <- message.bytes:
				default:
					close(connection.send)
					delete(manager.clients, connection)
				}
			}
		}
	}
}

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
			return
		}
		switch msg.Type {
		case "Open":
			c.UserID = msg.UserID
			continue
		case "Send":
		default:
			break
		}
		fmt.Println(msg)
		finalMsg := &ChanMessage{message: msg, bytes: message}
		manager.broadcast <- finalMsg
	}
}
