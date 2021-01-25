const express = require("express");

const Controller = require("./obrasLabels.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();

obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodos(req.query);
    res.json(response);
  })
);
obrasRouter.post(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.crearLabel(req.body);
    res.json(response);
  })
);
obrasRouter.get(
  "/obras",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosByObra(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/obras/cantidad",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerCantidadByObra(req.query);
    res.json(response);
  })
);
obrasRouter.post(
  "/obras",
  procesarErrores(async (req, res) => {
    var response = await Controller.agregarLabelObra(req.body);
    res.json(response);
  })
);
obrasRouter.delete(
  "/obras",
  procesarErrores(async (req, res) => {
    var response = await Controller.quitarLabelObra(req.body);
    res.json(response);
  })
);
module.exports = obrasRouter;
