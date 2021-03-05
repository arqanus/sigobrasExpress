const express = require("express");
var fs = require("fs");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("body", req.body);
    const { codigo } = req.body;
    const dir = `${publicFolder}${codigo}/infobras/`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return cb(null, dir);
  },
  filename: (req, file, cb) => {
    var extensionArchivo = file.originalname.split(".").pop();
    const { anyo, mes } = req.body;
    var fileName = `Informe_infobras-${anyo + "_" + mes}.${extensionArchivo}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

const Controller = require("./infobras.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();
//resumen
obrasRouter.get(
  "/informes",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerDatos(req.query);
    if (req.query.fecha_inicio) {
      var anyoInicial = "";
      var mesInicial = "";
      var anyoActual = "";
      var mesActual = "";
      var { fecha_inicio } = req.query;
      anyoInicial = Number(fecha_inicio.split("-")[0]);
      mesInicial = Number(fecha_inicio.split("-")[1]);
      anyoActual = new Date().getFullYear();
      mesActual = new Date().getMonth() + 1;
      var temp = [];
      for (let anyo = anyoInicial; anyo <= anyoActual; anyo++) {
        for (let mes = 1; mes <= 12; mes++) {
          if (anyo == anyoInicial) {
            if (mes >= mesInicial) {
              temp.push({
                anyo,
                mes,
              });
            }
          } else if (anyo == anyoActual) {
            if (mes <= mesActual) {
              temp.push({
                anyo,
                mes,
              });
            }
          } else {
            temp.push({
              anyo,
              mes,
            });
          }
        }
      }
      for (let index = 0; index < response.length; index++) {
        const element = response[index];
        var indexFound = temp.findIndex(
          (item, i) => item.anyo == element.anyo && item.mes == element.mes
        );
        if (indexFound > -1) {
          temp.splice(indexFound, 1);
        }
      }
      response = temp;
    }
    res.json(response);
  })
);
obrasRouter.get(
  "/informes/descripcion",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerDescripcion(req.query);
    res.json(response);
  })
);
obrasRouter.post(
  "/informes/descripcion",
  procesarErrores(async (req, res) => {
    var response = await Controller.guardarDescripcion(req.body);
    res.json(response);
  })
);
obrasRouter.put(
  "/informes/descripcion",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarDescripcion(req.body);
    res.json(response);
  })
);
obrasRouter.delete(
  "/informes/:id/descripcion",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminarDescripcion(req.params);
    res.json(response);
  })
);
obrasRouter.put(
  "/informes",
  upload.single("archivo"),
  procesarErrores(async (req, res) => {
    var codigo = req.body.codigo;
    delete req.body.codigo;
    if (req.body.estado_presentado) {
      req.body.estado_presentado = req.body.estado_presentado == "true" ? 1 : 0;
    }
    if (req.file) {
      req.body.archivo = `/static/${codigo}/infobras/${req.file.filename}`;
    }
    var response = await Controller.actualizarDatos([req.body]);
  })
);
module.exports = obrasRouter;
