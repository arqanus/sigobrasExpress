const express = require("express");
var fs = require("fs");

const Controller = require("./clasificadorPresupuestario.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();
//resumen
obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerDatos(req.query);
    res.json(response);
  })
);
module.exports = obrasRouter;
