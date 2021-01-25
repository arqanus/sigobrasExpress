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
obrasRouter.get(
  "/obra",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosByObra(req.query);
    res.json(response);
  })
);
module.exports = obrasRouter;
