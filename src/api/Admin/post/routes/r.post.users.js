const User = require('../models/m.post.users');
var formidable = require('formidable');
var fs = require('fs');

module.exports = function (app) {
	app.post('/nuevoUsuario', async (req, res) => {
		try {
			console.log("ingresado");

			var folder = "Usuarios/"
			var dir = __dirname + '/../../../../public/' + folder
			//crear ruta si no existe
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			var form = new formidable.IncomingForm();
			//se configura la ruta de guardar
			form.uploadDir = dir;
			//guarda la imagen
			var formFiles = await new Promise((resolve, reject) => {
				form.parse(req, (err, fields, files) => {
					if (err) {
						return reject(err);
					}
					return resolve({ fields, files });
				});
			});
			// res.json(formFiles)
			if (formFiles.fields.imagen == 'null' || formFiles.fields.imagen == 'undefined') {
				delete formFiles.fields.imagen
			}

			/**ingresar nuevo datos */
			var id_usuario = await User.postnuevoUsuario(formFiles.fields)
			// res.json(id_usuario)
			if (formFiles.files.imagen) {
				console.log("ingresando imagen");

				// //se renombre el archivo
				var archivo_name = id_usuario + ".jpg"
				fs.rename(formFiles.files.imagen.path, dir + archivo_name, (err) => { })

				//Actualizando nombre de imagen
				var id_usuario = await User.putUsuarioImagen("/static/" + folder + archivo_name, id_usuario)

			}
			res.json(id_usuario)


		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.post('/nuevoCargo', async (req, res) => {
		try {
			var postCargo = await User.postCargo(req.body)
			res.json(postCargo);
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.post('/nuevoAcceso', async (req, res) => {
		try {
			req.body.menu = "[{\"ruta\":\"\",\"submenus\":[{\"ruta\":\"/MDHistorial\",\"nombreMenu\":\"Historial de metrados\",\"nombrecomponente\":\"MDHistorial\"},{\"ruta\":\"/General\",\"nombreMenu\":\"Valorizaciones\",\"nombrecomponente\":\"General\"},{\"ruta\":\"/RecursosObra\",\"nombreMenu\":\"Recursos\",\"nombrecomponente\":\"RecursosObra\"},{\"ruta\":\"/HistorialImagenesObra\",\"nombreMenu\":\"Historial de imágenes\",\"nombrecomponente\":\"HistorialImagenesObra\"}],\"nombreMenu\":\"PROCESOS FISICOS\"},{\"ruta\":\"\",\"submenus\":[{\"ruta\":\"/Analitico\",\"nombreMenu\":\"Analitico\",\"nombrecomponente\":\"Analitico\"},{\"ruta\":\"/Otros\",\"nombreMenu\":\"Otos\",\"nombrecomponente\":\"Otros\"}],\"nombreMenu\":\"PROCESOS GERENCIALES\"}]"
			var postAcceso = await User.postAcceso(req.body)
			res.json(postAcceso);
		} catch (error) {
			res.status(400).json(error)
		}
	})

	app.post('/asignarObra', async (req, res) => {
		try {
			var postObraUsuario = await User.postObraUsuario(req.body)
			res.json(postObraUsuario);
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.post('/postUserImageDefault', async (req, res) => {
		try {
			//ruta de la carpeta public de imagenes
			var folder = "Sistema/"
			var archivo_name = "user_image_default.jpg"
			var dir = __dirname + '/../../../../public/' + folder
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
					return resolve(files);
				});
			});
			//se renombre el archivo
			fs.rename(formFiles.User_imagen.path, dir + archivo_name, (err) => { })
			res.json("/static/" + folder + archivo_name)
		} catch (error) {
			res.status(400).json(error)
		}

	})

}

