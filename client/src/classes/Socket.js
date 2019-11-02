import linksHttp from '../utils/links.http';
import { axiosAPI, axiosChat } from '../utils/axios';

class Socket {
  constructor(userId, receiveMessage, username, friends = []) {
    this.socket = new WebSocket(
      `${linksHttp.GO_CHAT(axiosAPI.defaults.headers.common.Authorization)}/ws`,
    );
    this.userId = userId;
    this.username = username;
    this.socket.onopen = () => {
      this.socket.send(
        JSON.stringify({
          username,
          userId,
          message: 'Connected!',
          type: 'Open',
          friends,
          jwt: axiosChat.defaults.headers.common.Authorization,
        }),
      );
    };
    this.socket.onclose = e => {
      console.log(e);
    };
    this.receiveMessage = receiveMessage;
    this.socket.onmessage = this.receiveMessage;
  }

  updateListOfFriends(listOfFriends) {
    const json = JSON.stringify({
      friends: listOfFriends,
      type: 'UpdateFriendList',
      userId: this.userId,
      username: this.username,
      jwt: axiosChat.defaults.headers.common.Authorization,
    });
    this.socket.send(json);
  }

  close() {
    this.socket.close();
  }

  sendMessage(msg, to, username) {
    const data = {
      userId: this.userId,
      username: this.username,
      message: msg,
      to,
      type: 'Message',
      from: username,
      jwt: axiosChat.defaults.headers.common.Authorization,
    };
    const json = JSON.stringify(data);
    this.socket.send(json);
  }

  informOfGramps(followers) {
    console.log(followers);
    const data = JSON.stringify({
      type: 'NewGramp',
      friends: followers,
      userId: this.userId,
      username: this.username,
      jwt: axiosChat.defaults.headers.common.Authorization,
    });
    this.socket.send(data);
  }
}

export default Socket;
