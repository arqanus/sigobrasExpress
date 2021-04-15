const express = require("express");

const Controller = require("./comprobantesAsignados.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

var fs = require("fs");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("body", req.body);
    const { codigo, tipo_comprobante } = req.body;
    var link = `${codigo}/procesos_financieros/${tipo_comprobante}/`;
    req.body.link = link;
    const dir = `${publicFolder}${link}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return cb(null, dir);
  },
  filename: (req, file, cb) => {
    var extensionArchivo = file.originalname.split(".").pop();
    var fileName = `${file.originalname.split(".")[0]}.${extensionArchivo}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

const obrasRouter = express.Router();
obrasRouter.post(
  "/archivo",
  upload.single("archivo"),
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizar({
      id: req.body.id,
      archivo: `/static/${req.body.link}${req.file.filename}`,
    });
    res.json({ message: "Registro exitoso" });
  })
);
obrasRouter.delete(
  "/archivo/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizar({
      ...req.params,
      archivo: " ",
    });
    res.json({ message: "Registro exitoso" });
  })
);
obrasRouter.get(
  "/avanceMensual",
  procesarErrores(async (req, res) => {
    var response = await Controller.avanceMensual(req.query);
    res.json(response);
  })
);

obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodos(req.query);
    res.json(response);
  })
);
obrasRouter.post(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.guardar(req.body);
    res.json(response);
  })
);
obrasRouter.delete(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.eliminar(req.params);
    res.json(response);
  })
);
obrasRouter.put(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizar({ ...req.params, ...req.body });
    res.json(response);
  })
);

module.exports = obrasRouter;
