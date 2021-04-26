const express = require("express");
var fs = require("fs");
var formidable = require("formidable");

const Controller = require("./imagenesComentarios.controller");
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
    var response = await Controller.guardar(req.body);
    res.json(response);
  })
);
obrasRouter.put(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizar({
      updateData: req.body,
      ...req.params,
    });
    res.json(response);
  })
);
obrasRouter.delete(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminar(req.params);
    res.json(response);
  })
);

module.exports = obrasRouter;
