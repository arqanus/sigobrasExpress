const express = require("express");

const Controller = require("./usuarios.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
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
  "/acceso/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerUsuarioByIdAcceso(req.params);
    res.json(response);
  })
);
obrasRouter.post(
  "/obra/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.ingresarUsuario(req.body);
    if (response.affectedRows > 0) {
      var id_usuario = response.insertId;
      var accesoObject = {
        usuario: "",
        hash: "",
        id_usuario,
        estado: false,
      };
      var response2 = await ControllerAccesos.crear({
        ...req.body,
        ...accesoObject,
      });
      var response3 = await ControllerAccesos.asignarObra({
        id_acceso: response2.insertId,
        id_ficha: req.params.id,
      });
      res.json(response3);
    } else {
      throw "error";
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
    res.json(response);
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

module.exports = obrasRouter;
