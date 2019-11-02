export default {
  API:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api'
      : 'http://localhost/api',
  // todo: Create go image server instance and set it here.
  GO_IMAGE:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:2222'
      : // Create image server...
        'http://127.0.0.1:2222',
  // todo: Create go server
  GO_CHAT: process.env.NODE_ENV === 'development' ? 'ws://localhost:1234' : '',
  isLocalhost: Boolean(
    window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
      ),
  ),
};
