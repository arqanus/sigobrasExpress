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
    var id_partidas = response2.map((item) => item.id_partida).join(",");
    var response3 = await Controller.obtenerRecursosNombres({ id_partidas });
    var response4 = await Controller.recursosParcial({
      id_partidas,
      recursos_nombres: response3,
    });
    for (let index = 0; index < response1.length; index++) {
      response1[index] = { ...response1[index], ...response2[index] };
      response1[index] = { ...response1[index], ...response4[index] };
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
    var response3 = await Controller.obtenerRecursosNombres({ id_partidas });
    if (response3.length) {
      var response4 = await Controller.recursosParcial({
        id_partidas,
        recursos_nombres: response3,
      });
    }
    for (let index = 0; index < response1.length; index++) {
      response1[index] = { ...response1[index], ...response2[index] };
      if (response3.length) {
        response1[index] = { ...response1[index], ...response4[index] };
      }
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
obrasRouter.delete(
  "/imagen/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarImagen(req.params);
    res.json(response);
  })
);
obrasRouter.get(
  "/partida",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerData(req.query);
    res.json(response);
  })
);
obrasRouter.put(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizar({
      ...req.params,
      ...req.body,
    });
    res.json(response);
  })
);
module.exports = obrasRouter;
