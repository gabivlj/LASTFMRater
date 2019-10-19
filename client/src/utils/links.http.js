export default {
  GO_IMAGE: process.env.GO_IMAGE_ROUTE || 'http://localhost:2222',
  GO_CHAT: process.env.GO_CHAT_ROUTE || 'ws://localhost:1234',
  isLocalhost: Boolean(
    window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
      ),
  ),
};
