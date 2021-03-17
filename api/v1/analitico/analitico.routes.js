const express = require("express");

const Controller = require("./analitico.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();
//resumen
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
//general
obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerPresupuestAnalitico(req.query);
    //calculando avance anual
    var response2 = await Controller.obtenerPresupuestAnaliticoAnyos(req.query);
    if (response2.length > 0) {
      var response3 = await Controller.obtenerPresupuestAnaliticoAvanceAnual({
        ...req.query,
        anyos: response2,
      });
    }
    // calculando avance mensual
    var response4 = await Controller.obtenerPresupuestAnaliticoAvanceMensual(
      req.query
    );
    //calculando pim asignado
    var response5 = await Controller.obtenerPresupuestAnaliticoPimAsignado(
      req.query
    );
    // res.json(response5);
    for (let i = 0; i < response.length; i++) {
      if (response2.length > 0) {
        response[i] = { ...response[i], ...response3[i] };
      }
      response[i] = { ...response[i], ...response4[i] };
      response[i] = { ...response[i], ...response5[i] };
    }
    res.json(response);
  })
);
obrasRouter.get(
  "/id",
  procesarErrores(async (req, res) => {
    var response = await Controller.getAllidsByObra(req.query);
    res.json(response);
  })
);
obrasRouter.put(
  "/",
  procesarErrores(async (req, res) => {
    for (let index = 0; index < req.body.length; index++) {
      const element = req.body[index];
      var response = await Controller.actualizarPresupuestAnalitico([element]);
    }
    res.json("Resgistros exitosos");
  })
);
obrasRouter.put(
  "/presupuesto",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarPresupuestAnaliticoMonto(
      req.body
    );
    res.json(response);
  })
);
obrasRouter.put(
  "/avanceAnual",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarAvanceAnualMonto(req.body);
    res.json(response);
  })
);
obrasRouter.put(
  "/avanceMensual",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarAvanceMensualMonto(req.body);
    res.json(response);
  })
);
obrasRouter.put(
  "/pim",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarPim(req.body);
    res.json(response);
  })
);
obrasRouter.get(
  "/especifica",
  procesarErrores(async (req, res) => {
    var response = await Controller.getDataEspecifica(req.query);
    res.json(response);
  })
);
module.exports = obrasRouter;
