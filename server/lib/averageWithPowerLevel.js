function averageWithPowerLevel(array) {
  let len = 0;
  const total = array.reduce((prev, now) => {
    len += now.powerLevel;
    return prev + now.puntuation * now.powerLevel;
  }, 0);
  return isNaN(total / len) ? 0 : total / len;
}

module.exports = averageWithPowerLevel;
