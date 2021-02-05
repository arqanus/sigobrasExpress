const express = require("express");

const Controller = require("./analitico.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();

obrasRouter.get(
  "/resumen",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerResumen(req.query);
    res.json(response);
  })
);

module.exports = obrasRouter;
