const express = require("express");

const Controller = require("./usuarios.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const ControllerDesignaciones = require("../designaciones/designaciones.controller");
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
  "/dni/:dni",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerUsuarioPorDNI(req.params);
    if (Object.keys(response).length === 0) {
      res.status(204).json({ message: "usuario no encontrado" });
    } else {
      res.json(response);
    }
  })
);
obrasRouter.get(
  "/obra/:id_ficha/acceso/:id_acceso",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerUsuarioByIdAcceso(req.params);
    res.json(response);
  })
);
obrasRouter.post(
  "/obra/:id/cargo/:id_cargo",
  procesarErrores(async (req, res) => {
    var lastId = (await ControllerAccesos.obtenerLastId()).id;
    var accesoObject = {
      usuario: "randUser" + lastId,
      password: "randUser" + lastId,
    };
    var fecha_inicio = req.body.fecha_inicio;
    delete req.body.fecha_inicio;
    var response2 = await ControllerAccesos.crear({
      ...req.body,
      ...accesoObject,
    });
    if (response2.affectedRows > 0) {
      var response3 = await ControllerAccesos.asignarObra({
        Accesos_id_acceso: response2.insertId,
        Fichas_id_ficha: req.params.id,
        cargos_id_cargo: req.params.id_cargo,
      });
      if (response3.affectedRows > 0) {
        var objectDesignacion = {
          fecha_inicio,
          fichas_has_accesos_id: response3.insertId,
        };
        var response4 = await ControllerDesignaciones.guardarDesignacion(
          objectDesignacion
        );
        console.log("response4", response4);
        res.json({ message: "exito" });
      } else {
        res.status(404).json("error");
      }
    } else {
      res.status(404).json("error");
    }
  })
);
obrasRouter.put(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarTodo({
      ...req.params,
      ...req.body,
    });
    res.json({ message: "Actualizacion exitosa" });
  })
);
obrasRouter.put(
  "/:id/habilitado",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarHabilitadoObra({
      ...req.params,
      ...req.body,
    });
    res.json(response);
  })
);
obrasRouter.get(
  "/id_cargos",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerUsuariosByIdCargo(req.query);
    res.json(response);
  })
);

module.exports = obrasRouter;
