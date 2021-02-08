const express = require("express");

const Controller = require("./fuentesFinancieamiento.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();

obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodos(req.query);
    res.json(response);
  })
);
obrasRouter.put(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarDatosLista(req.body);
    res.json(response);
  })
);
obrasRouter.delete(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarById(req.params);
    res.json(response);
  })
);
module.exports = obrasRouter;
