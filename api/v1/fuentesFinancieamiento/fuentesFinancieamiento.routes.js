const express = require("express");

const Controller = require("./fuentesFinancieamiento.controller");
const ControllerAnalitico = require("../analitico/analitico.controller");
const ControllerPresupuestosAprobados = require("../presupuestosAprobados/presupuestosAprobados.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();
async function actualizarPresupuestAnalitico(id_ficha, anyo) {
  // se obtiene los id analiticos
  var analitico = ControllerAnalitico.obtenerPresupuestAnalitico({
    presupuestosAprobados: [],
    id_ficha: id_ficha,
  });
  //se obtiene los avances de las fuentes de financiamiento
  var avanceMensual = Controller.obtenerAvancesMensuales({
    id_ficha: id_ficha,
    anyo: anyo,
  });
  var [analitico, avanceMensual] = await Promise.all([
    analitico,
    avanceMensual,
  ]);
  //se genera la data para ingreso ade avance mensual de presupeusto analitico
  var dataProcesada_avanceMensual = [];
  var dataProcesada_avanceAnual = [];
  var actualId = 0;
  var avanceAnual = 0;
  var analiticoEspecifica = 0;
  for (let index = 0; index < avanceMensual.length; index++) {
    const avance = avanceMensual[index];
    analiticoEspecifica = analitico.find(
      (item) =>
        item.id_costo_real == avance.id_costo &&
        item.id_clasificador == avance.id_clasificador
    );
    if (analiticoEspecifica) {
      dataProcesada_avanceMensual.push({
        anyo,
        mes: avance.mes,
        monto: avance.monto,
        presupuesto_analitico_id: analiticoEspecifica.id,
      });

      //avance anual
      if (actualId != analiticoEspecifica.id) {
        if (actualId != 0) {
          //guarda
          dataProcesada_avanceAnual.push({
            anyo,
            monto: avanceAnual,
            presupuesto_analitico_id: actualId,
          });
          avanceAnual = 0;
        }
        actualId = analiticoEspecifica.id;
      }
      avanceAnual += avance.monto;
    }
  }
  if (analiticoEspecifica) {
    dataProcesada_avanceAnual.push({
      anyo,
      monto: avanceAnual,
      presupuesto_analitico_id: actualId,
    });
  }
  console.log(
    "========================================================guardando"
  );
  ControllerAnalitico.actualizarAvanceMensualMonto(dataProcesada_avanceMensual);
  ControllerAnalitico.actualizarAvanceAnualMonto(dataProcesada_avanceAnual);
}
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
    var response1 = await Controller.obtenerDataById({
      id_fuente: req.params.id,
    });
    var response2 = await Controller.eliminarById(req.params);
    //actualizando prespuepsuesto analitico
    actualizarPresupuestAnalitico(response1.fichas_id_ficha, response1.anyo);
    res.json(response2);
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
    var id_costo = req.body.id;
    var response1 = await Controller.obtenerDataById({
      id_costo,
    });
    var response = await Controller.actualizarCostos(req.body);
    actualizarPresupuestAnalitico(response1.fichas_id_ficha, response1.anyo);
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
    //se obtiene id_ficha y anyo eliminado
    var response1 = await Controller.obtenerDataById({
      id_costo: req.params.id,
    });
    var response2 = await Controller.eliminarCostosById(req.params);
    //actualizando prespuepsuesto analitico
    actualizarPresupuestAnalitico(response1.fichas_id_ficha, response1.anyo);
    res.json(response2);
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
    var id_especifica = req.params.id;
    var response1 = await Controller.obtenerDataById({
      id_especifica,
    });
    var response = await Controller.actualizarEspecificaById({
      ...req.body,
      ...req.params,
    });
    actualizarPresupuestAnalitico(response1.fichas_id_ficha, response1.anyo);
    res.json(response);
  })
);
obrasRouter.delete(
  "/especificas/:id",
  procesarErrores(async (req, res) => {
    var response1 = await Controller.obtenerDataById({
      id_especifica: req.params.id,
    });
    var response2 = await Controller.eliminarEspecificaById(req.params);
    //actualizando prespuepsuesto analitico
    actualizarPresupuestAnalitico(response1.fichas_id_ficha, response1.anyo);
    res.json(response2);
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
