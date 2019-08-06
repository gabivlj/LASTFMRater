class Socket {
  constructor(userId, receiveMessage) {
    this.socket = new WebSocket('ws://localhost:12345/ws');
    this.userId = userId;
    this.socket.onopen = () => {
      this.socket.send(
        JSON.stringify({ userId, message: 'Connected!', type: 'Open' })
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
    console.log(data);
    this.socket.send(json);
  }
}

export default Socket;
