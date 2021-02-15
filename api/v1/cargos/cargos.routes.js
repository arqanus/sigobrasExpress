const express = require("express");

const Controller = require("./cargos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();

obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodos(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/obra",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosByObra(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerUltimoCargoById({
      ...req.query,
      ...req.params,
    });
    res.json(response);
  })
);

module.exports = obrasRouter;
