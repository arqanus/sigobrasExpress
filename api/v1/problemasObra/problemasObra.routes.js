const express = require("express");
var fs = require("fs");

const Controller = require("./problemasObra.controller");
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
obrasRouter.put(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarDatos(req.body);
    res.json({ id: response.insertId, message: "registro exitoso" });
  })
);
obrasRouter.delete(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarData(req.params);
    res.json({ message: "elimando exitosamente" });
  })
);
module.exports = obrasRouter;
