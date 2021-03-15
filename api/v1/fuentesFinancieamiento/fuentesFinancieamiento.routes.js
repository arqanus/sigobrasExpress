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
//costos
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
obrasRouter.post(
  "/costos",
  procesarErrores(async (req, res) => {
    var response = await Controller.asignarCosto(req.body);
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
//especificias
obrasRouter.get(
  "/especificas",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosEspecificasVariacionesPim(
      req.query
    );
    var response2 = await Controller.obtenerTodosEspecificasVariacionesPimMonto(
      { ...req.query, listVariacionesPim: response }
    );

    var response3 = await Controller.obtenerTodosEspecificas(req.query);
    // res.json({ response2, response3 });
    for (let i = 0; i < response2.length; i++) {
      if (response2.length > 0) {
        response3[i] = { ...response3[i], ...response2[i] };
      }
    }
    res.json(response3);
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
//avancemensual
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

//variaciones pim
obrasRouter.get(
  "/variacionesPim",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosEspecificasVariacionesPim(
      req.query
    );
    res.json(response);
  })
);
obrasRouter.post(
  "/variacionesPim",
  procesarErrores(async (req, res) => {
    var response = await Controller.guardarVariacionesPim(req.body);
    res.json(response);
  })
);
obrasRouter.put(
  "/variacionesPim/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarVariacionesPim({
      ...req.body,
      ...req.params,
    });
    res.json(response);
  })
);
obrasRouter.delete(
  "/variacionesPim/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarVariacionesPim(req.params);
    res.json(response);
  })
);
obrasRouter.put(
  "/variacionesPimMonto",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarVariacionesPimMonto(req.body);
    res.json(response);
  })
);
module.exports = obrasRouter;
