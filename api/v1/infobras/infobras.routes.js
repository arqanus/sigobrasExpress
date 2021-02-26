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
    res.json(response);
  })
);
obrasRouter.put(
  "/informes",
  upload.single("archivo"),
  procesarErrores(async (req, res) => {
    var codigo = req.body.codigo;
    delete req.body.codigo;
    var response = await Controller.actualizarDatos([
      {
        ...req.body,
        archivo: req.file
          ? `/static/${codigo}/infobras/${req.file.filename}`
          : "",
      },
    ]);
    res.json(response);
  })
);
module.exports = obrasRouter;
