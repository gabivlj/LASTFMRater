package main

// InformFriendsOfConnection :: Takes a Client type and finds in their friendlist the correspondent client socket and sends them if they just connected or disconnected
func InformFriendsOfConnection(friends *Client, connected bool, inform bool) map[string]bool {
	mapFriends := make(map[string]bool)
	for _, friend := range friends.friends {
		mapFriends[friend] = manager.clientsStr[friend] > 0
		if mapFriends[friend] && inform {
			for client, ok := range manager.clients {
				if ok && client.UserID == friend {
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
