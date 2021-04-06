const express = require("express");
const passport = require("passport");

const validarEstructura = require("./componentes.validate").validarEstructura;
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const obrasController = require("./componentes.controller");
const jwtAuthenticate = passport.authenticate("jwt", { session: false });

const obrasRouter = express.Router();

obrasRouter.get(
  "/",
  [
    // jwtAuthenticate
  ],
  procesarErrores(async (req, res) => {
    var response = await obrasController.obtenerTodos(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/costoDirecto",
  procesarErrores(async (req, res) => {
    var response = await obrasController.costoDirecto(req.query);
    res.json(response);
  })
);

module.exports = obrasRouter;
