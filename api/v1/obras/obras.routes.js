const express = require("express");

const validarEstructura = require("./obras.validate").validarEstructura;
const obrasController = require("./obras.controller");

const obrasRouter = express.Router();

obrasRouter.get("/public", [validarEstructura], async (req, res) => {
  console.log("params", req.query);
  var response = await obrasController.obtenerTodosPublico(req.query);
  res.json(response);
});

module.exports = obrasRouter;
