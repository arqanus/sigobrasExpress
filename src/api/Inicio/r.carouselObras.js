const User = require('./m.carouselObras');
const { v4: uuidv4 } = require('uuid')
var fs = require('fs');
var formidable = require('formidable');

module.exports = function (app) {
    app.post('/obrasImagenes', async (req, res) => {
        try {
            var dir = __dirname + '/../../public/'
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
            console.log(formFiles.fields);
            console.log(formFiles.files);
            //se genera el nombre del archivo
            var link = ""
            if (formFiles.files.imagen) {
                var extensionArchivo = "." + formFiles.files.imagen.name.split('.').pop()
                if (extensionArchivo != ".jpg" && extensionArchivo != ".png" && extensionArchivo != ".jpeg") {
                    res.status(400).json({ message: "Formato de archivo equivocado" })
                    return
                }

                var archivo_name = uuidv4() + extensionArchivo
                //se verifica y crea las carpetas de obra 
                var obraFolder = `${formFiles.fields.codigoObra}/IMAGENES/`
                if (!fs.existsSync(dir + obraFolder)) {
                    fs.mkdirSync(dir + obraFolder, { recursive: true });
                }
                obraFolder += archivo_name
                // renombre y mueve de lugar el archivo
                fs.rename(formFiles.files.imagen.path, dir + obraFolder, (err) => { })
                link = "/static/" + obraFolder
            }
            // res.json("exito")
            var request = {
                url: link,
                descripcion: formFiles.fields.descripcion,
                id_acceso: formFiles.fields.id_acceso,
                id_ficha: formFiles.fields.id_ficha
            }
            console.log("request", request);
            var response = await User.postImagenesObra(request)
            res.json("exito")
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }
    })
    app.get('/obrasImagenes', async (req, res) => {
        try {
            var data = await User.getImagenesObra(req.query)
            console.log(req.query);
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: err.code })
        }
    })
}