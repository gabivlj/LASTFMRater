export default {
  fmtMSS: s => (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s,
};
