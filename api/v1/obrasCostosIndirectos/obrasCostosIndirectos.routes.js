const express = require("express");

const Controller = require("./obrasCostosIndirectos.controller");
const ControlerAmpliaciones = require("../obrasAmpliacionesPresupuesto/obrasAmpliacionesPresupuesto.controller");

const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const obrasRouter = express.Router();

obrasRouter.get(
  "/adicionales",
  procesarErrores(async (req, res) => {
    var response = await ControlerAmpliaciones.obtenerTodos(req.query);
    var response2 = await Controller.obtenerTodosFromAmpliaciones(
      req.query,
      response
    );
    res.json({ cantidad: response.length, data: response2 });
  })
);

module.exports = obrasRouter;
