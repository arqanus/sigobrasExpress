const express = require("express");
var fs = require("fs");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { codigo } = req.body;
    const dir = `${publicFolder}${codigo}/modificacion_presupuesto/`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return cb(null, dir);
  },
  filename: (req, file, cb) => {
    var extensionArchivo = file.originalname.split(".").pop();
    const { resolucion } = req.body;
    var fileName = `${resolucion}.${extensionArchivo}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

const Controller = require("./presupuestosAprobados.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();
//resumen
obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerPresupuestosAprobados(req.query);
    res.json(response);
  })
);
obrasRouter.post(
  "/",
  upload.single("archivo"),
  procesarErrores(async (req, res) => {
    var codigo = req.body.codigo;
    delete req.body.codigo;
    await Controller.guardarPresupuestoAprobado({
      ...req.body,
      archivo: req.file
        ? `/static/${codigo}/modificacion_presupuesto/${req.file.filename}`
        : "",
    });
    res.json({ message: "Registro exitoso" });
  })
);
obrasRouter.put(
  "/:id",
  upload.single("archivo"),
  procesarErrores(async (req, res) => {
    var codigo = req.body.codigo;
    delete req.body.codigo;
    await Controller.actualizarPresupuestoAprobado({
      ...req.params,
      ...req.body,
      archivo: req.file
        ? `/static/${codigo}/modificacion_presupuesto/${req.file.filename}`
        : "",
    });
    res.json({ message: "Registro exitoso" });
  })
);
module.exports = obrasRouter;
