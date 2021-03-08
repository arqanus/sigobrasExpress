const express = require("express");
const Controller = require("./interfazPermisos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();
obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerDatos(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/activo",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerPermisoInterfaz(req.query);
    res.json(response);
  })
);
obrasRouter.put(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarDatos(req.body);
    res.json(response);
  })
);

module.exports = obrasRouter;
