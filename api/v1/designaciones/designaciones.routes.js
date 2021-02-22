const express = require("express");
var fs = require("fs");
var formidable = require("formidable");

const Controller = require("./designaciones.controller");
const ControllerAccesos = require("../accesos/accesos.controller");
const procesarErrores = require("../../libs/errorHandler").procesarErrores;

const obrasRouter = express.Router();

obrasRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.obtenerTodosByCargo(req.query);
    res.json(response);
  })
);
obrasRouter.post(
  "/",
  procesarErrores(async (req, res) => {
    var response = await Controller.guardarDesignacion(req.body);
    res.json(response);
  })
);
obrasRouter.put(
  "/:id",
  procesarErrores(async (req, res) => {
    var response = await Controller.actualizarById({
      ...req.params,
      ...req.body,
    });
    res.json(response);
  })
);
obrasRouter.put(
  "/:id/memorandum",
  procesarErrores(async (req, res) => {
    var dir = publicFolder;
    //crear ruta si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    var form = new formidable.IncomingForm();
    //se configura la ruta de guardar
    form.uploadDir = dir;

    var formFiles = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        return resolve({ fields, files: files.memorandum });
      });
    });
    console.log(formFiles.fields);
    //se genera el nombre del archivo
    var link = "";
    if (formFiles.files) {
      var extensionArchivo = "." + formFiles.files.name.split(".").pop();
      var archivo_name = "memorandum" + extensionArchivo;
      //se verifica y crea las carpetas de obra
      var obraFolder =
        formFiles.fields.obra_codigo +
        "/PERSONAL/TECNICOS/" +
        formFiles.fields.id +
        "/";
      if (!fs.existsSync(dir + obraFolder)) {
        fs.mkdirSync(dir + obraFolder, { recursive: true });
      }
      obraFolder += archivo_name;
      // renombre y mueve de lugar el archivo
      fs.rename(formFiles.files.path, dir + obraFolder, (err) => {});
      link = "/static/" + obraFolder;
    }
    // var request = await User.putUsuarioMemo(
    //   link,
    //   formFiles.fields.id,
    //   formFiles.fields.id_ficha
    // );

    var response = await Controller.actualizarById({
      ...req.params,
      ...req.body,
      memorandum: link,
    });
    res.json({
      message: "registro exitoso",
    });
  })
);

module.exports = obrasRouter;
