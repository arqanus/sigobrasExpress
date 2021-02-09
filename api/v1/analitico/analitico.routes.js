const express = require("express");

const Controller = require("./analitico.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();

obrasRouter.get(
  "/resumen",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerResumen(req.query);
    res.json(response);
  })
);
obrasRouter.put(
  "/resumen",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarResumen(req.body);
    res.json(response);
  })
);
obrasRouter.delete(
  "/resumen/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarResumen(req.params);
    res.json(response);
  })
);
obrasRouter.put(
  "/resumen/anual",
  procesarErrores(async (req, res) => {
    if (Array.isArray(req.body)) {
      for (let i = 0; i < req.body.length; i++) {
        const element = req.body[i];
        await Controller.actualizarResumenAnual([element]);
      }
    } else {
      res.status(400).json("estructura incorrecta");
      return;
    }
    res.json("registro exitoso");
  })
);
obrasRouter.put(
  "/resumen/mensual",
  procesarErrores(async (req, res) => {
    if (Array.isArray(req.body)) {
      for (let i = 0; i < req.body.length; i++) {
        const element = req.body[i];
        await Controller.actualizarResumenMensual([element]);
      }
    } else {
      res.status(400).json("estructura incorrecta");
      return;
    }
    res.json("registro exitoso");
  })
);
module.exports = obrasRouter;
