const express = require("express");
var fs = require("fs");

const Controller = require("./analiticoCostos.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();
//resumen
obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerCostos(req.query);
    res.json(response);
  })
);
obrasRouter.post(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.guardarCostos(req.body);
    res.json({ message: "Registro exitoso", id: response.insertId });
  })
);
obrasRouter.post(
  "/obra",
  procesarErrores(async (req, res) => {
    var response = await Controller.asignarCostosObra(req.body);
    res.json({ message: "Registro exitoso", id: response.insertId });
  })
);
module.exports = obrasRouter;
