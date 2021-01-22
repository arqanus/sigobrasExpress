const express = require("express");
const passport = require("passport");

const validarEstructura = require("./avanceActividades.validate")
  .validarEstructura;
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const Controller = require("./avanceActividades.controller");

const obrasRouter = express.Router();

obrasRouter.get(
  "/componente",
  [
    // jwtAuthenticate
    validarEstructura,
  ],
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerAvanceByComponente(req.query);
    res.json(response);
  })
);

module.exports = obrasRouter;
