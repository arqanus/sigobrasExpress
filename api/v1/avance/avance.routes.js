const express = require("express");
const passport = require("passport");

const validarEstructura = require("./avance.validate").validarEstructura;
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const Controller = require("./avance.controller");
const ControllerPartidas = require("../partidas/partidas.controller");

const obrasRouter = express.Router();

obrasRouter.get(
  "/componente",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerAvanceByComponente(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/cuadroMetrados",
  procesarErrores(async (req, res) => {
    var response1 = Controller.avanceMetrados(req.query);
    var response2 = Controller.obtenerCuadroMetrados(req.query);
    var [response1, response2] = await Promise.all([response1, response2]);
    for (let index = 0; index < response1.length; index++) {
      response1[index] = { ...response1[index], ...response2[index] };
    }
    res.json(response1);
  })
);
obrasRouter.get(
  "/cuadroMetradosResumen",
  procesarErrores(async (req, res) => {
    var response1 = await Controller.obtenerCuadroMetradosResumen(req.query);
    var id_partidas = response1.map((item) => item.id_partida).join(",");
    var tempData = { id_partidas, ...req.query };
    var response2 = await Controller.avanceMetrados(tempData);
    for (let index = 0; index < response1.length; index++) {
      response1[index] = { ...response1[index], ...response2[index] };
    }
    res.json(response1);
  })
);
obrasRouter.get(
  "/resumenAnual",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerAvanceResumenAnual(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/acumuladoAnual",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerAvanceAcumuladoAnual(req.query);
    res.json(response);
  })
);
obrasRouter.get(
  "/valorizacionPartidas",
  procesarErrores(async (req, res) => {
    var response = await ControllerPartidas.obtenerByComponente(req.query);
    res.json(response);
  })
);
module.exports = obrasRouter;
