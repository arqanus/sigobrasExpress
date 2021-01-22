const express = require("express");

const validarEstructura = require("./sectores.validate").validarEstructura;
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const obrasController = require("./sectores.controller");

const obrasRouter = express.Router();

obrasRouter.get(
  "/public",
  [validarEstructura],
  procesarErrores(async (req, res) => {
    var response = await obrasController.obtenerTodosPublico(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/",
  [validarEstructura],
  procesarErrores(async (req, res) => {
    var response = await obrasController.obtenerTodos(req.query);
    res.json(response);
  })
);

module.exports = obrasRouter;
