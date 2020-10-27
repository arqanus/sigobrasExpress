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
			var request = await User.getDificultadesHabilitado(formFiles.fields.id)
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
			var form = new formidable.IncomingForm();
			var formFiles = await new Promise((resolve, reject) => {
				form.parse(req, (err, fields, files) => {
					if (err) {
						return reject(err);
					}
					return resolve({ fields, files: files.residente_archivo });
				});
			});
			console.log("fields", formFiles.fields);
			var request = await User.getDificultadesHabilitado(formFiles.fields.id)
			console.log("habilitado es ", formFiles.fields.habilitado);
			formFiles.fields.supervisor_visto = formFiles.fields.supervisor_visto == "true" ? true : false
			if (request.habilitado) {

				var data = await User.postDificultadesSupervisor(formFiles.fields, !request.habilitado)
				res.json({ message: "registro exitoso" })
			} else {
				res.json({ message: "el registro esta bloqueado" });
			}
		} catch (error) {
			console.log({ error });
			res.status(204).json(error)
		}
	});
	app.post('/getConsultas', async (req, res) => {
		try {
			var data = await User.getConsultas(req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/postConsultaResidente', async (req, res) => {
		try {
			var request = await User.getConsultasHabilitado(req.body.id)
			if (request == undefined || request.habilitado) {
				var data = await User.postConsultaResidente(req.body)
				console.log("req ",data);
				res.json({ message: "registro exitoso" })
			} else {
				res.json({ message: "el registro esta bloqueado" });
			}

		} catch (error) {
			res.status(204).json(error)
		}
	});
	app.post('/postConsultaSupervisor', async (req, res) => {
		try {
			var request = await User.getConsultasHabilitado(req.body.id)
			if (request == undefined || request.habilitado) {
				var data = await User.postConsultaSupervisor(req.body)
				res.json({ message: "registro exitoso" })
			} else {
				res.json({ message: "el registro esta bloqueado" });
			}
		} catch (error) {
			console.log({ error });
			res.status(204).json(error)
		}
	});

	app.post('/getObservaciones', async (req, res) => {
		try {
			var data = await User.getObservaciones(req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/postObservacionesResidente', async (req, res) => {
		try {
			var request = await User.getObservacionesHabilitado(req.body.id)
			if (request == undefined || request.habilitado) {
				var data = await User.postObservacionesResidente(req.body)
				res.json({ message: "registro exitoso" })
			} else {
				res.json({ message: "el registro esta bloqueado" });
			}

		} catch (error) {
			res.status(204).json(error)
		}
	});
	app.post('/postObservacionesSupervisor', async (req, res) => {
		try {
			var request = await User.getObservacionesHabilitado(req.body.id)
			if (request == undefined || request.habilitado) {
				var data = await User.postObservacionesSupervisor(req.body)
				res.json({ message: "registro exitoso" })
			} else {
				res.json({ message: "el registro esta bloqueado" });
			}
		} catch (error) {
			console.log({ error });
			res.status(204).json(error)
		}
	});


}