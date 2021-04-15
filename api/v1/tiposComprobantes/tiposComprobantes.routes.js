const express = require("express");
var fs = require("fs");
var formidable = require("formidable");

const Controller = require("./tiposComprobantes.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();

obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodos();
    res.json(response);
  })
);

module.exports = obrasRouter;
