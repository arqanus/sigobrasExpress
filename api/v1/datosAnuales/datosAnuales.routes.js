const express = require("express");

const Controller = require("./datosAnuales.controller");
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
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarPresupuesto({
      ...req.params,
      ...req.body,
    });
    res.json(response);
  })
);

module.exports = obrasRouter;
