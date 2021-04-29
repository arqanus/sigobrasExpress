const express = require("express");

const Controller = require("./partidas.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();

obrasRouter.get(
  "/total",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTotalPartidas(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerByComponente(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerById(req.params);
    res.json(response);
  })
);
obrasRouter.put(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizar({
      ...req.body,
      ...req.params,
    });
    res.json(response);
  })
);
module.exports = obrasRouter;
