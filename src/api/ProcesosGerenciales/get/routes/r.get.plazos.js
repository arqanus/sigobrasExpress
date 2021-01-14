const User = require("../models/m.get.plazos");
var fs = require("fs");
var formidable = require("formidable");
module.exports = (app) => {
  app.post("/getPlazos", async (req, res) => {
    try {
      var plazosPadre = await User.getPlazos(req.body.id_ficha, 1);
      var plazos = [];
      for (let i = 0; i < plazosPadre.length; i++) {
        const padre = plazosPadre[i];
        var hijo = await User.getPlazos(
          req.body.id_ficha,
          2,
          padre.idplazos_historial
        );
        plazos.push(padre);
        plazos = plazos.concat(hijo);
      }
      // console.log("plazos",plazos);

      res.json(plazos);
    } catch (err) {
      console.log(err);
      res.status(204).json(err);
    }
  });
  app.post("/putPlazos", async (req, res) => {
    try {
      var padre_id = 0;
      for (let i = 0; i < req.body.length; i++) {
        const padre = req.body[i];

        if (padre[2] == 1) {
          padre_id = padre[0];
          // console.log("padre_id",padre_id);
          // console.log("padre",padre);
          var padre_res = await User.putPlazos([padre]);
          if (padre_id == null) {
            padre_id = padre_res.insertId;
          }
          // console.log("padre_id",padre_id);
        } else {
          padre[padre.length - 1] = padre_id;
          // console.log("hijo",padre);
          var padre_res = await User.putPlazos([padre]);
        }
        // console.log(padre_res);
      }
      res.json("exito");
    } catch (err) {
      console.log(err);
      res.status(204).json(err);
    }
  });
  app.post("/deletePlazos", async (req, res) => {
    try {
      var data = await User.deletePlazos(req.body.idplazos_historial);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(204).json(err);
    }
  });
  app.post("/getPlazosTipo", async (req, res) => {
    try {
      var data = await User.getPlazosTipo(req.body.nivel);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(204).json(err);
    }
  });
  app.put("/plazos/:id/archivo", async (req, res) => {
    try {
      var dir = __dirname + "/../../../../public/";
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
          return resolve({ fields, files });
        });
      });
      //se genera el nombre del archivo
      var link = "";
      if (formFiles.files.archivo) {
        // var extensionArchivo = "." + formFiles.files.archivo.name.split('.').pop()
        var archivo_name = formFiles.files.archivo.name;
        //se verifica y crea las carpetas de obra
        var obraFolder = `${formFiles.fields.codigo_obra}/PLAZOS/`;
        if (!fs.existsSync(dir + obraFolder)) {
          fs.mkdirSync(dir + obraFolder, { recursive: true });
        }
        obraFolder += archivo_name;
        // renombre y mueve de lugar el archivo
        fs.rename(formFiles.files.archivo.path, dir + obraFolder, (err) => {});
        link = "/static/" + obraFolder;
      }
      // res.json("exito")
      var request = {
        archivo: link,
        id: req.params.id,
        id_acceso: formFiles.fields.id_acceso,
      };
      // res.json(request);
      var response = await User.postPlazosImagenes(request);
      res.json("exito");
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.code });
    }
  });
};
