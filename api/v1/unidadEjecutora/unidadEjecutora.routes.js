const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const log = require("../../../utils/logger");
const validarUsuario = require("./unidadEjecutora.validate").validarUsuario;
const validarPedidoDeLogin = require("./unidadEjecutora.validate")
  .validarPedidoDeLogin;
const config = require("../../../config");
const obrasController = require("./unidadEjecutora.controller");

const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const obrasRouter = express.Router();

obrasRouter.get(
  "/public",
  procesarErrores(async (req, res) => {
    var response = await obrasController.obtenerTodosPublico();
    res.json(response);
  })
);
obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await obrasController.obtenerTodos(req.query);
    res.json(response);
  })
);

module.exports = obrasRouter;
