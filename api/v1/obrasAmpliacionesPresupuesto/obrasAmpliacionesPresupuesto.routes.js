const express = require("express");

const Controller = require("./obrasAmpliacionesPresupuesto.controller");

const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const obrasRouter = express.Router();

obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodos(req.query);
    res.json(response);
  })
);

module.exports = obrasRouter;
