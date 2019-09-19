const cache = {};

function setNoAuth() {
  return (req, res, next) => {
    console.log('lol', req.json);
    const url = req.baseUrl + req.path;
    cache[url] = req.json;
    return res.json(req.json);
  };
}

function getNoAuth() {
  return (req, res, next) => {
    const url = req.baseUrl + req.path;
    const element = cache[url];
    console.log(url);
    if (element) {
      return res.status(200).json(element);
    }
    return next();
  };
}

function deleteCacheNoAuth(url) {
  cache[url] = null;
}

module.exports = { setNoAuth, getNoAuth, deleteCacheNoAuth };
