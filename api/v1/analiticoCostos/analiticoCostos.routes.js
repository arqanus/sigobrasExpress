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
obrasRouter.delete(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarCosto(req.params);
    res.json({ message: "Registro exitoso" });
  })
);
obrasRouter.post(
  "/obra",
  procesarErrores(async (req, res) => {
    var response = await Controller.asignarCostosObra(req.body);
    res.json({ message: "Registro exitoso", id: response.insertId });
  })
);
obrasRouter.get(
  "/predecir",
  procesarErrores(async (req, res) => {
    var response = await Controller.predecirCostos(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/analitico",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerCostosAnalitico(req.query);
    res.json(response);
  })
);
module.exports = obrasRouter;
