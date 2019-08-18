module.exports = () => {
  const startTime = new Date();
  return () => {
    console.info(`Execution time %dms`, new Date() - startTime);
  };
};
