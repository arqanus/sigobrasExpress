const User = require('../models/m.get.dificultades');
const Tools = require('../../../../tools/format');
var fs = require('fs');
var formidable = require('formidable');
module.exports = (app) => {
	app.post('/getDificultades', async (req, res) => {
		try {
			var data = await User.getDificultades(req.body.id_ficha,req.body.tipo)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/postDificultades', async (req, res) => {
		try {
			var data = await User.postDificultades(req.body)
			console.log(data);
			if (data.affectedRows > 0) {
				res.json({ message: "registro exitoso" })
			} else {
				throw ({ message: "problema al registrar" })
			}
		} catch (error) {
			console.log(error);
			res.status(204).json({ message: "problema al registrar" })
		}
	});


	// app.post('/postDificultadesResidente', async (req, res) => {
	// 	try {
	// 		var dir = __dirname + '/../../../../public/'
	// 		//crear ruta si no existe
	// 		if (!fs.existsSync(dir)) {
	// 			fs.mkdirSync(dir);
	// 		}
	// 		var form = new formidable.IncomingForm();
	// 		//se configura la ruta de guardar
	// 		form.uploadDir = dir;
	// 		var formFiles = await new Promise((resolve, reject) => {
	// 			form.parse(req, (err, fields, files) => {
	// 				if (err) {
	// 					return reject(err);
	// 				}
	// 				return resolve({ fields, files: files.residente_archivo });
	// 			});
	// 		});
	// 		//se genera el nombre del archivo
	// 		if (formFiles.files) {
	// 			var extensionArchivo = "." + formFiles.files.name.split('.').pop()
	// 			var archivo_name = Tools.datetime() + extensionArchivo
	// 			//se verifica y crea las carpetas de obra 
	// 			var obraFolder = formFiles.fields.obra_codigo + "/DIFICULTADES/"
	// 			if (!fs.existsSync(dir + obraFolder)) {
	// 				fs.mkdirSync(dir + obraFolder, { recursive: true });
	// 			}
	// 			obraFolder += archivo_name
	// 			// renombre y mueve de lugar el archivo
	// 			fs.rename(formFiles.files.path, dir + obraFolder, (err) => { })
	// 			formFiles.fields.residente_documentoLink = "/static/" + obraFolder
	// 		}


	// 		formFiles.fields.id = formFiles.fields.id == "null" ? null : formFiles.fields.id
	// 		var request = await User.getDificultadesHabilitado(formFiles.fields.id)
	// 		console.log("formFiles.fields ", formFiles.fields);
	// 		console.log("request habilitado", request);
	// 		if (request == undefined || request.habilitado) {
	// 			var data = await User.postDificultadesResidente(formFiles.fields)
	// 			res.json({ message: "registro exitoso" })
	// 		} else {
	// 			res.json({ message: "el registro esta bloqueado" });
	// 		}

	// 	} catch (error) {
	// 		console.log(error);
	// 		res.status(204).json(error)
	// 	}
	// });
	
	app.post('/getDificultadesComentarios', async (req, res) => {
		try {
			var data = await User.getDificultadesComentarios(req.body.dificultades_id)
			res.json(data)
		} catch (error) {
			console.log({ error });
			res.status(204).json(error)
		}
	});
	app.post('/postDificultadesComentarios', async (req, res) => {
		try {
			var data = await User.postDificultadesComentarios(req.body.comentario, req.body.dificultades_id, req.body.accesos_id_acceso)
			res.json(data)
		} catch (error) {
			console.log({ error });
			res.status(204).json(error)
		}
	});
	app.post('/postDificultadesComentariosVistos', async (req, res) => {
		try {
			var req_comentariosNoVistos = await User.getDificultadesComentariosNoVistos(req.body.id_acceso, req.body.id_dificultad)
			var idComentariosNoVistos = [];
			console.log("datos",req.body.id_acceso, req.body.id_dificultad,req_comentariosNoVistos);

			req_comentariosNoVistos.forEach(element => {
				idComentariosNoVistos.push([req.body.id_acceso, element.id])
			});
			console.log(idComentariosNoVistos);
			if (idComentariosNoVistos.length > 0) {
				var req_comentariosVistos = await User.postDificultadesComentariosVistos(idComentariosNoVistos)
			}
			res.json({ message: "mensajes visteados exitosamente" })
		} catch (error) {
			console.log(error)
			res.status(204).json(error)
		}
	})
	app.post('/getDificultadesComentariosNoVistosFicha', async (req, res) => {
		try {
			var data = await User.getDificultadesComentariosNoVistosFicha(req.body.id_acceso, req.body.id_ficha, req.body.tipo)
			res.json(data)
		} catch (error) {
			console.log(error)
			res.status(204).json(error)
		}
	})

}