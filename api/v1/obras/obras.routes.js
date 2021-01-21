const express = require("express");

const validarEstructura = require("./obras.validate").validarEstructura;
const obrasController = require("./obras.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

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
    console.log("params", req.query);
    var response = await obrasController.obtenerTodos(req.query);
    res.json(response);
  })
);

module.exports = obrasRouter;
