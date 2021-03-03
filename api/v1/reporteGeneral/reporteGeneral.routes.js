const express = require("express");
var fs = require("fs");

const Controller = require("./reporteGeneral.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();
//resumen
obrasRouter.get(
  "/interfaces",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerDatos(req.query);
    res.json(response);
  })
);
obrasRouter.put(
  "/interfaces",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarDatos(req.body);
    res.json({ message: "Registro exitoso", id: response.insertId });
  })
);
obrasRouter.get(
  "/interfaces/seleccion",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerInterfazSeleccionada(req.query);
    res.json(response);
  })
);
obrasRouter.put(
  "/interfaces/seleccion",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarInterfazSeleccionada(req.body);
    res.json(response);
  })
);
module.exports = obrasRouter;
