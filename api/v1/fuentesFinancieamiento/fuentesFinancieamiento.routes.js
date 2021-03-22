const express = require("express");

const Controller = require("./fuentesFinancieamiento.controller");
const ControllerAnalitico = require("../analitico/analitico.controller");
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
    var response = await Controller.obtenerTodosEspecificas(req.query);
    var response2 = await Controller.obtenerTodosEspecificasVariacionesPim(
      req.query
    );
    var response3 = await Controller.obtenerTodosEspecificasVariacionesPimMonto(
      { ...req.query, listVariacionesPim: response2 }
    );
    for (let i = 0; i < response.length; i++) {
      if (response2.length > 0) {
        response[i] = { ...response[i], ...response3[i] };
      }
    }
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
//avancemensual
obrasRouter.put(
  "/avanceMensual",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarAvanceMensual(req.body);
    //actualizamos avance mensual de presupuesto analitico
    //se obtiene el id_costo e id_clasificador para poder conseguir el avance
    var response2 = await Controller.getDataParaActualizarAvanceMensual(
      req.body
    );
    //se obtiene el id de analitico para poder ingresar el avancemensual
    var response3 = await ControllerAnalitico.getDataEspecifica({
      id_ficha: response2.fichas_id_ficha,
      id_costo: response2.presupuestoanalitico_costos_id,
      id_clasificador: response2.clasificadores_presupuestarios_id,
    });

    if (response3) {
      //se obtiene el monto total
      var response4 = await Controller.getMontoParaActualizarAvanceMensual({
        id_ficha: response2.fichas_id_ficha,
        id_costo: response2.presupuestoanalitico_costos_id,
        id_clasificador: response2.clasificadores_presupuestarios_id,
        anyo: req.body.anyo,
        mes: req.body.mes,
      });
      //se ingresa el avance mensual
      var response5 = await ControllerAnalitico.actualizarAvanceMensualMonto({
        presupuesto_analitico_id: response3.id,
        anyo: req.body.anyo,
        mes: req.body.mes,
        monto: response4.avance,
      });
      //obtiene monto avance anual
      var response6 = await Controller.getMontoParaActualizarAvanceMensual({
        id_ficha: response2.fichas_id_ficha,
        id_costo: response2.presupuestoanalitico_costos_id,
        id_clasificador: response2.clasificadores_presupuestarios_id,
        anyo: req.body.anyo,
      });
      var response7 = await ControllerAnalitico.actualizarAvanceAnualMonto({
        presupuesto_analitico_id: response3.id,
        anyo: req.body.anyo,
        monto: response6.avance,
      });
    }

    res.json({ message: "exito" });
  })
);
obrasRouter.get(
  "/getavance",
  procesarErrores(async (req, res) => {
    var response = await Controller.getMontoParaActualizarAvanceMensual(
      req.query
    );
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
    res.json({ id: response.insertId, message: "registro exitoso" });
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
//otros
obrasRouter.get(
  "/list",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosFuentesFinanaciamiento();
    res.json(response);
  })
);
obrasRouter.get(
  "/predecir",
  procesarErrores(async (req, res) => {
    var response = await Controller.predecirFuenteFinanciamiento(req.query);
    res.json(response);
  })
);
module.exports = obrasRouter;
