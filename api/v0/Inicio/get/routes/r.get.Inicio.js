const User = require("../models/m.get.Inicio");
const tools = require("../../../../../utils/format");
const User2 = require("../../../ProcesosFisicos/get/models/m.get.valGeneral");
var fs = require("fs");
var formidable = require("formidable");
module.exports = (app) => {
  app.post("/PGlistaObras", async (req, res) => {
    try {
      var obras = await User.getObras(req.body.id_acceso);
      res.json(obras);
    } catch (error) {
      res.status(200).json(error);
    }
  });
  app.post("/listaObrasByIdAcceso", async (req, res) => {
    try {
      var response = await User.listaObrasByIdAcceso(req.body);
      res.json(response);
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: error.code });
    }
  });
  app.post("/listaObrasSeguimientoByIdAcceso", async (req, res) => {
    try {
      var response = await User.listaObrasSeguimientoByIdAcceso(req.body);
      res.json(response);
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: error.code });
    }
  });
  app.post("/getComponentesPgerenciales", async (req, res) => {
    try {
      var data = await User.getComponentesPgerenciales(req.body.id_ficha);
      res.json(data);
    } catch (error) {
      res.status(200).json(error);
    }
  });
  //desfasado
  app.post("/getCargosById", async (req, res) => {
    try {
      var cargos = await User.getCargosById_ficha(req.body.id_ficha);
      for (let i = 0; i < cargos.length; i++) {
        const cargo = cargos[i];
        var data = await User.getUsuariosByCargo(
          req.body.id_ficha,
          cargo.id_cargo
        );
        cargo.data = data;
      }
      res.json(cargos);
    } catch (error) {
      res.status(200).json(error);
    }
  });
  app.post("/getCargosById2", async (req, res) => {
    try {
      var cargos = await User.getCargosById_ficha(req.body.id_ficha);
      res.json(cargos);
    } catch (error) {
      res.status(200).json(error);
    }
  });
  app.post("/getUsuariosByCargo", async (req, res) => {
    try {
      var cargos = await User.getUsuariosByCargo(
        req.body.id_ficha,
        req.body.id_cargo,
        req.body.estado
      );
      res.json(cargos);
    } catch (error) {
      res.status(200).json(error);
    }
  });
  app.post("/getUsuariosByCargoAdmin", async (req, res) => {
    try {
      var cargos = await User.getUsuariosByCargoAdmin(req.body);
      res.json(cargos);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  });
  app.post("/getUsuariosByFichas", async (req, res) => {
    try {
      var cargos = await User.getUsuariosByFichas(req.body);
      res.json(cargos);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/postUsuarioObra", async (req, res) => {
    try {
      if (req.body.usuario != "") {
        var resUsuario = await User.getExisteUsuario(req.body);
        if (resUsuario.acceso) {
          res.json({
            message: "Usuario ya registrado",
          });
          return;
        }
      }
      var responseUsuario = await User.postUsuario(req.body);
      var usuario = req.body.usuario || "randUser" + responseUsuario.insertId;
      var password = req.body.password || "randUser" + responseUsuario.insertId;
      var responseAcceso = await User.postAcceso(
        req.body.id_cargo,
        responseUsuario.insertId,
        usuario,
        password
      );
      if (req.body.id_ficha != 0) {
        var responseAccesoFicha = await User.postAccesoFicha(
          req.body.id_ficha,
          responseAcceso.insertId
        );
      }
      res.json({
        message: "registro exitoso",
      });
    } catch (error) {
      console.log(error);
      res.status(204).json(error.code);
    }
  });
  app.post("/putUsuarioMemo", async (req, res) => {
    try {
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
          formFiles.fields.id_acceso +
          "/";
        if (!fs.existsSync(dir + obraFolder)) {
          fs.mkdirSync(dir + obraFolder, { recursive: true });
        }
        obraFolder += archivo_name;
        // renombre y mueve de lugar el archivo
        fs.rename(formFiles.files.path, dir + obraFolder, (err) => {});
        link = "/static/" + obraFolder;
      }
      var request = await User.putUsuarioMemo(
        link,
        formFiles.fields.id_acceso,
        formFiles.fields.id_ficha
      );
      console.log(request);
      res.json({
        message: "registro exitoso",
      });
    } catch (error) {
      console.log(error);
      res.status(204).json(error.code);
    }
  });
  app.get("/ultimoFinancieroData", async (req, res) => {
    try {
      var data = await User.ultimoFinancieroData(req.query);
      res.json(data);
    } catch (error) {}
  });
};
