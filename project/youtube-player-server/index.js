const restify = require("restify");
const errors = require("restify-errors");
const corsMiddleware = require("restify-cors-middleware");

const port = process.env.PORT || 8000;
const controller = require("./urls.controller");

const server = restify.createServer({
  name: "video-playlist-crud",
});

const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["X-App-Version"],
  exposeHeaders: [],
});

server.use(restify.plugins.bodyParser());

server.pre(cors.preflight);
server.use(cors.actual);

server.pre((req, res, next) => {
  console.info(`${req.method} - ${req.url}`);
  return next();
});

server.get("api/youtubeUrls/:token", (req, res, next) => {
  if (!req.params.token) {
    return next(new errors.BadRequestError());
  }
  res.send(200, controller.getAllUrls(req.params.token));
  return next();
});

server.post("api/youtubeUrls", (req, res, next) => {
  if (!req.body || !req.body.urlData) {
    return next(new errors.BadRequestError());
  }
  const url = controller.createUrl(req.body.urlData);
  res.send(201, url);
  return next();
});

server.put("api/youtubeUrls/:id", (req, res, next) => {
  if (!req.params.id || !req.body) {
    return next(new errors.BadRequestError());
  }
  try {
    const url = controller.updateUrlIndex(
      +req.params.id,
      req.body.prevIndex,
      req.body.newIndex
    );
    res.send(200, url);
    return next();
  } catch (error) {
    return next(new errors.NotFoundError(error));
  }
});

server.del("api/youtubeUrls/:id", (req, res, next) => {
  if (!req.params.id) {
    return next(new errors.BadRequestError());
  }
  try {
    controller.delUrl(+req.params.id);
    res.send(204);
    return next();
  } catch (error) {
    return next(new errors.NotFoundError(error));
  }
});

server.listen(port, () => {
  console.info(`api is running on port ${port}`);
});
