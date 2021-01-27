const express = require("express");

const Controller = require("./usuarios.controller");
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
    var response = await Controller.actualizarTodo({
      ...req.params,
      ...req.body,
    });
    res.json(response);
  })
);
obrasRouter.put(
  "/:id/habilitado",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarHabilitadoObra({
      ...req.params,
      ...req.body,
    });
    res.json(response);
  })
);

module.exports = obrasRouter;
