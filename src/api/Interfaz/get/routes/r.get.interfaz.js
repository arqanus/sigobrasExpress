const User = require('../models/m.get.interfaz');
function soloLetras(req, res, next) {
	var regla = /^[A-Za-z0-9]+$/
	var usuario = req.body.usuario
	if (usuario.match(regla) && req.body.password.match(regla)) {
		// console.log("usuario",usuario)
		next()
	} else {
		res.status(400).send("caracteres invalidos")
	}
}

module.exports = function (app) {
	app.post('/login', soloLetras, async (req, res) => {
		try {
			var data = await User.getId_acceso(req.body)
			res.json(data);
		} catch (error) {
			res.status(204).json(error);
		}
	})
	app.post('/login2', soloLetras, async (req, res) => {
		try {
			var request = await User.getIdAcceso(req.body)
			if (request.length > 0) {
				res.json({ id_acceso: request[0].id_acceso, message: "usuario autorizado" });
			} else {
				res.status(401).json({ message: "usuario no autorizado" });
			}
		} catch (error) {
			console.log(error);
			res.status(204).json(error);
		}
	})
	app.post('/getMenu', async (req, res) => {
		try {
			var request = await User.getMenu(req.body)
			res.status(200).json(request);
		} catch (error) {
			console.log(error);
			res.status(204).json(error);
		}
	})
	app.post('/getMenu2', async (req, res) => {
		try {
			var request = await User.getMenu2(req.body)
			res.status(200).json(request);
		} catch (error) {
			console.log(error);
			res.status(204).json(error);
		}
	})
	app.post('/getDatosGenerales', async (req, res) => {
		try {
			var getDatosGenerales = await User.getDatosGenerales(req.body.id_ficha)
			var costo_directo = await User.getCostoDirecto(req.body.id_ficha, true)
			getDatosGenerales.costo_directo = costo_directo
			res.json(getDatosGenerales)
		} catch (error) {
			res.status(204).json(error)
			// res.status(400).json(error)
		}
	})
	app.post('/getTipoObras', async (req, res) => {
		try {
			var getTipoObras = await User.getTipoObras(req.body)
			res.json(getTipoObras)
		} catch (error) {
			res.status(204).json(error)
		}
	})
}