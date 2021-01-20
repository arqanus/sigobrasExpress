const express = require("express");

const validarEstructura = require("./sectores.validate").validarEstructura;
const obrasController = require("./sectores.controller");

const obrasRouter = express.Router();

obrasRouter.get("/public", [validarEstructura], async (req, res) => {
  var response = await obrasController.obtenerTodosPublico(req.query);
  res.json(response);
});

module.exports = obrasRouter;
