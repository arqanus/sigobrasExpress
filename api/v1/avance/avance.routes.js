const express = require("express");
const passport = require("passport");

const validarEstructura = require("./avance.validate").validarEstructura;
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const Controller = require("./avance.controller");

const obrasRouter = express.Router();

obrasRouter.get(
  "/fisico/componente",
  [
    // jwtAuthenticate
    validarEstructura,
  ],
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerAvanceByComponente(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/resumenAnual",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerAvanceResumenAnual(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/acumuladoAnual",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerAvanceAcumuladoAnual(req.query);
    res.json(response);
  })
);
module.exports = obrasRouter;
