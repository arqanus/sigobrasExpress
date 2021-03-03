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
  "/list",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosFuentesFinanaciamiento();
    res.json(response);
  })
);
obrasRouter.put(
  "/",
  procesarErrores(async (req, res) => {
    for (let index = 0; index < req.body.length; index++) {
      var element = req.body[index];
      var response = await Controller.actualizarDatosLista([element]);
    }
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
