const express = require("express");

const Controller = require("./fuentesFinancieamiento.controller");
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
  "/costos",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosCostos(req.query);
    res.json(response);
  })
);
obrasRouter.put(
  "/costos",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarCostos(req.body);
    res.json(response);
  })
);
obrasRouter.delete(
  "/costos/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarCostosById(req.params);
    res.json(response);
  })
);
obrasRouter.get(
  "/especificas",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosEspecificas(req.query);
    res.json(response);
  })
);
obrasRouter.post(
  "/especificas",
  procesarErrores(async (req, res) => {
    var response = await Controller.ingresarEspecifica(req.body);
    res.json(response);
  })
);
obrasRouter.put(
  "/especificas/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarEspecificaById({
      ...req.body,
      ...req.params,
    });
    res.json(response);
  })
);
obrasRouter.delete(
  "/especificas/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarEspecificaById(req.params);
    res.json(response);
  })
);
obrasRouter.put(
  "/avanceMensual",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarAvanceMensual(req.body);
    res.json(response);
  })
);
obrasRouter.get(
  "/list",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosFuentesFinanaciamiento();
    res.json(response);
  })
);
obrasRouter.put(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarDatosLista(req.body);
    res.json({ message: "Registro exitoso" });
  })
);
obrasRouter.delete(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarById(req.params);
    res.json(response);
  })
);
module.exports = obrasRouter;
