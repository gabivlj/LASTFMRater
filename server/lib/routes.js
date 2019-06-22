module.exports = {
	/**
	 * @param {Object} app, express
	 * @param {Array} route, [routeString, router]
	 */
	addRoutes: (app, ...args) => {
		for (let arg of args) {
			app.use(arg[0], arg[1]);
		}
	}
};
