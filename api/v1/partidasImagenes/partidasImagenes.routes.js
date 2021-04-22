const express = require("express");
var fs = require("fs");
var formidable = require("formidable");

const Controller = require("./partidasImagenes.controller");
const ControllerAvances = require("../avance/avance.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();

obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    if (req.query.anyo && req.query.mes) {
      var response2 = await Controller.obtenerTodos(req.query);
    } else {
      var response1 = await Controller.obtenerTodosTotalFechas(req.query);
      var response2 = await Controller.obtenerTodosTotal({
        ...req.query,
        fechas: response1,
      });
    }
    res.json(response2);
  })
);
obrasRouter.get(
  "/anyos",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosAnyoMeses(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/meses",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosAnyoMeses(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/componentes",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerComponentes(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.dataById({ ...req.params, ...req.query });
    res.json(response);
  })
);
obrasRouter.delete(
  "/",
  procesarErrores(async (req, res) => {
    if (req.query.tipo == "partidaImagen") {
      var response = await Controller.eliminarImagen(req.query);
    } else {
      var response = await ControllerAvances.eliminarImagen(req.query);
    }
    res.json(response);
  })
);

module.exports = obrasRouter;
