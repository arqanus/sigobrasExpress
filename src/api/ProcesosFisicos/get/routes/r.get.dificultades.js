const User = require('../models/m.get.dificultades');
const Tools = require('../../../../tools/format');
var fs = require('fs');
var formidable = require('formidable');
module.exports = (app) => {
	app.post('/getDificultades', async (req, res) => {
		try {
			var data = await User.getDificultades(req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/postDificultadesResidente', async (req, res) => {
		try {
			var dir = __dirname + '/../../../../public/'
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
					return resolve({ fields, files: files.residente_archivo });
				});
			});
			//se genera el nombre del archivo
			var extensionArchivo = "." + formFiles.files.name.split('.').pop()
			var archivo_name = Tools.datetime() + extensionArchivo
			//se verifica y crea las carpetas de obra 
			var obraFolder = formFiles.fields.obra_codigo + "/DIFICULTADES/"
			if (!fs.existsSync(dir + obraFolder)) {
				fs.mkdirSync(dir + obraFolder, { recursive: true });
			}
			obraFolder += archivo_name
			// renombre y mueve de lugar el archivo
			fs.rename(formFiles.files.path, dir + obraFolder, (err) => { })
			formFiles.fields.residente_documentoLink = "/static/" + obraFolder
			formFiles.fields.id = formFiles.fields.id == "null" ? null : formFiles.fields.id
			var request = await User.getDificultadesHabilitado(formFiles.fields.fichas_id_ficha, formFiles.fields.id)
			if (request == undefined || request.habilitado) {
				var data = await User.postDificultadesResidente(formFiles.fields)
				res.json({ message: "registro exitoso" })
			} else {
				res.json({ message: "el registro esta bloqueado" });
			}

		} catch (error) {
			res.status(204).json(error)
		}
	});
	app.post('/postDificultadesSupervisor', async (req, res) => {
		try {
			var request = await User.getDificultadesHabilitado(req.body.fichas_id_ficha, req.body.id)
			console.log("habilitado es ", request.habilitado);
			if (request.habilitado) {
				var data = await User.postDificultadesSupervisor(req.body)
				res.json({ message: "registro exitoso" })
			} else {
				res.json({ message: "el registro esta bloqueado" });
			}
		} catch (error) {
			res.status(200).json(error)
		}
	});
}