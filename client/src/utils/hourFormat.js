export default {
  fmtMSS: s => (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s,
  fmtMS: s => {  // Hours, minutes and seconds    
    let seconds = ((s % 60000) / 1000).toFixed(0);
    return Math.floor(s / 60000) + ":" + (seconds < 10 ? '0' : '') + seconds;
  },
};
