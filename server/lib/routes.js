module.exports = {
  /**
   * @param {Object} app, express
   * @param {Array} route, [routeString, router]
   */
  addRoutes: (app, ...args) => args.forEach(arg => app.use(arg[0], arg[1]))
};
