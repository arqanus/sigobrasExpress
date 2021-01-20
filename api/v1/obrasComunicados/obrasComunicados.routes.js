const express = require("express");
const passport = require("passport");

const validarEstructura = require("./obrasComunicados.validate")
  .validarEstructura;
const obrasController = require("./obrasComunicados.controller");
const jwtAuthenticate = passport.authenticate("jwt", { session: false });

const obrasRouter = express.Router();

obrasRouter.get("/", [jwtAuthenticate], async (req, res) => {
  var response = await obrasController.obtenerTodos(req.query);
  res.json(response);
});

module.exports = obrasRouter;
