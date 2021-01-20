const User = require("../models/m.put.interfaz");
const User2 = require("../../get/models/m.get.interfaz");
var formidable = require("formidable");
var fs = require("fs");

module.exports = (app) => {
  app.put("/putUserImagen", async (req, res) => {
    try {
      var folder = "Usuarios/";
      var dir = publicFolder + folder;
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
      //se renombre el archivo
      var archivo_name = formFiles.fields.id_acceso + ".jpg";
      fs.rename(
        formFiles.files.User_imagen.path,
        dir + archivo_name,
        (err) => {}
      );
      var id_usuario = await User2.getIdUsuarioIdAcceso(
        formFiles.fields.id_acceso
      );

      var affectedrows = await User.putUserImagen(
        id_usuario,
        "/static/" + folder + archivo_name
      );
      res.json("exito");
    } catch (error) {
      res.status(400).json(error);
    }
  });
};
