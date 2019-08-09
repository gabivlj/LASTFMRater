class Socket {
  constructor(userId, receiveMessage, username, friends = []) {
    this.socket = new WebSocket('ws://localhost:12345/ws');
    this.userId = userId;
    this.username = username;
    this.socket.onopen = () => {
      this.socket.send(
        JSON.stringify({
          username,
          userId,
          message: 'Connected!',
          type: 'Open',
          friends: ['5cb88d162cd2833752b67fba']
        })
      );
    };
    this.socket.onclose = () => {};
    this.receiveMessage = receiveMessage;
    this.socket.onmessage = this.receiveMessage;
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
