const User = require('../models/m.gestionDocumentaria');
var fs = require('fs');
var formidable = require('formidable');
const { log } = require('console');
module.exports = (app) => {
    app.post('/gestiondocumentaria_mensajes', async (req, res) => {
        try {
            var message = ""
            var response = await User.postgestiondocumentaria_mensajes(req.body.mensaje)
            if (response.affectedRows > 0) {
                req.body.receptores.forEach((item, i) => {
                    req.body.receptores[i].unshift(response.insertId)
                });
                console.log("receptrores", req.body.receptores);
                var response2 = await User.postgestiondocumentaria_receptores(req.body.receptores)
                message = "registro exitoso"
                res.status(200).json(
                    {
                        message,
                        insertId: response.insertId
                    }
                )
            } else {
                message = "problema con el registro"
                res.status(204).json(
                    {
                        message
                    }
                )
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }

    })
    app.post('/gestiondocumentaria_mensajes_archivoAdjunto', async (req, res) => {
        try {
            var dir = __dirname + '/../../../public/'
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
            //se genera el nombre del archivo
            var link = ""
            if (formFiles.files.archivoAdjunto) {
                // var extensionArchivo = "." + formFiles.files.archivoAdjunto.name.split('.').pop()
                var archivo_name = "gdmi_" + formFiles.fields.gestiondocumentaria_mensajes_id + "-" + formFiles.files.archivoAdjunto.name
                //se verifica y crea las carpetas de obra 
                var obraFolder = `USUARIOS/${formFiles.fields.id_acceso}/DOCUMENTOS/${formFiles.fields.tipoDocumento}/`
                if (!fs.existsSync(dir + obraFolder)) {
                    fs.mkdirSync(dir + obraFolder, { recursive: true });
                }
                obraFolder += archivo_name
                // renombre y mueve de lugar el archivo
                fs.rename(formFiles.files.archivoAdjunto.path, dir + obraFolder, (err) => { })
                link = "/static/" + obraFolder
            }
            // res.json("exito")
            var request = {
                documento_link: link,
                gestiondocumentaria_mensajes_id: formFiles.fields.gestiondocumentaria_mensajes_id,
                gestiondocumentaria_archivosadjuntos_tipos_id: formFiles.fields.tipoDocumento_id
            }
            console.log("request", request);
            var response = await User.postgestiondocumentaria_mensajes_archivoAdjunto(request)
            res.json("exito")
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }
    })
    app.post('/gestiondocumentaria_mensajes_archivoAdjunto_respuesta', async (req, res) => {
        try {
            var dir = __dirname + '/../../../public/'
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
            //se genera el nombre del archivo
            var link = ""
            if (formFiles.files.archivoAdjunto) {
                // var extensionArchivo = "." + formFiles.files.archivoAdjunto.name.split('.').pop()
                var archivo_name = "gdmi_" + formFiles.fields.gestiondocumentaria_respuestas_id + "-" + formFiles.files.archivoAdjunto.name
                //se verifica y crea las carpetas de obra 
                var obraFolder = formFiles.fields.obra_codigo + `/DOCUMENTOS/${formFiles.fields.tipoDocumento}/`
                if (!fs.existsSync(dir + obraFolder)) {
                    fs.mkdirSync(dir + obraFolder, { recursive: true });
                }
                obraFolder += archivo_name
                // renombre y mueve de lugar el archivo
                fs.rename(formFiles.files.archivoAdjunto.path, dir + obraFolder, (err) => { })
                link = "/static/" + obraFolder
            }
            // res.json("exito")
            var request = {
                documento_link: link,
                gestiondocumentaria_respuestas_id: formFiles.fields.gestiondocumentaria_respuestas_id,
                gestiondocumentaria_archivosadjuntos_tipos_id: formFiles.fields.tipoDocumento_id
            }
            console.log("request", request);
            var response = await User.postgestiondocumentaria_mensajes_archivoAdjunto(request)
            res.json("exito")
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }
    })

    app.get('/gestiondocumentaria_enviados', async (req, res) => {
        try {

            var response = await User.getgestiondocumentaria_enviados(req.query)
            res.json(response)
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }

    })
    app.get('/gestiondocumentaria_enviados_usuarios', async (req, res) => {
        try {

            var response = await User.getgestiondocumentaria_enviados_usuarios(req.query)
            res.json(response)
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }

    })
    app.put('/gestiondocumentaria_receptores', async (req, res) => {
        try {
            var response = await User.putgestiondocumentaria_receptores(req.body)
            var response2 = await User.getgestiondocumentaria_receptores_mensaje_visto(req.body)
            res.json({ mensaje_visto: response2.mensaje_visto })
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }

    })
    app.get('/gestiondocumentaria_recibidos', async (req, res) => {
        try {
            var response = await User.getgestiondocumentaria_recibidos(req.query)
            res.json(response)
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }
    })
    app.get('/gestiondocumentaria_recibidos_respuestas', async (req, res) => {
        try {
            var response = await User.getgestiondocumentaria_recibidos_respuestas(req.query)
            res.json(response)
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }
    })
    app.get('/gestiondocumentaria_recibidos_respuestas_cantidad', async (req, res) => {
        try {
            var response = await User.getgestiondocumentaria_recibidos_respuestas_cantidad(req.query)
            res.json(response)
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }
    })
    app.post('/gestiondocumentaria_respuestas', async (req, res) => {
        try {
            var response = await User.postgestiondocumentaria_respuestas(req.body)
            res.json(response)
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }
    })
    app.get('/fichas_has_accesosId', async (req, res) => {
        try {
            var response = await User.getfichas_has_accesosId(req.query)
            res.json(response)
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }
    })
    app.get('/gestiondocumentaria_archivosadjuntos_tipos', async (req, res) => {
        try {
            var response = await User.getgestiondocumentaria_archivosadjuntos_tipos()
            res.json(response)
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.code })
        }
    })
}
