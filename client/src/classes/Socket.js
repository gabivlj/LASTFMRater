import linksHttp from '../utils/links.http';

class Socket {
  constructor(userId, receiveMessage, username, friends = []) {
    this.socket = new WebSocket(`${linksHttp.GO_CHAT}/ws`);
    this.userId = userId;
    this.username = username;
    this.socket.onopen = () => {
      this.socket.send(
        JSON.stringify({
          username,
          userId,
          message: 'Connected!',
          type: 'Open',
          friends
        })
      );
    };
    this.socket.onclose = () => {};
    this.receiveMessage = receiveMessage;
    this.socket.onmessage = this.receiveMessage;
  }

  updateListOfFriends(listOfFriends) {
    const json = JSON.stringify({
      friends: listOfFriends,
      type: 'UpdateFriendList'
    });
    this.socket.send(json);
  }

  close() {
    this.socket.close();
  }

  sendMessage(msg, to, username) {
    const data = {
      userId: this.userId,
      message: msg,
      to,
      type: 'Message',
      from: username
    };
    const json = JSON.stringify(data);
    this.socket.send(json);
  }
}

export default Socket;
