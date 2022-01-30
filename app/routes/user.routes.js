const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const path = require("path");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/", [authJwt.verifyToken], controller.userBoard);

  app.get("/login", [authJwt.verifyToken], controller.userBoard);

  app.get("/register", controller.registerPage);

  app.get(
    "/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};