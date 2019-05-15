const User = require('../models/m.get.historialImagenes');

module.exports = function (app) {
	app.post('/getImagenesComponentes', (req, res) => {
		if (req.body.id_ficha == null || req.body.id_ficha == "null" || req.body.id_ficha == "") {
			res.json("null");
		} else {
			User.getImagenesComponentes(req.body.id_ficha, (err, componentes) => {
				if (err) { res.status(204).json(err); }
				else if (componentes == "vacio") {
					res.json(componentes)
				}
				else {
					User.getImagenesPartidas(componentes[0].id_componente, (err, partidas) => {
						if (err) { res.status(204).json(err); }
						else {
							componentes[0].partidas = partidas
							res.json(componentes);
						}
					})
				}
			})
		}
	})
	app.post('/getImagenesPartidas', (req, res) => {
		if (req.body.id_componente == null || req.body.id_componente == "null" || req.body.id_componente == "") {
			res.json("null");
		} else {
			User.getImagenesPartidas(req.body.id_componente, (err, data) => {
				if (err) { res.status(204).json(err); }
				else {
					res.json(data);
				}
			})
		}
	})
	app.post('/getImagenesHistorialActividades', (req, res) => {
		if (req.body.id_partida == null) {
			res.json("null");
		} else {
			User.getImagenesHistorialActividades(req.body.id_partida, (err, data) => {
				if (err) { res.status(204).json(err); }
				else {
					res.json(data);
				}
			})
		}
	})
	app.post('/getImagenesHistorialPartidas', (req, res) => {
		if (req.body.id_partida == null) {
			res.json("null");
		} else {
			User.getImagenesHistorialPartidas(req.body.id_partida, (err, data) => {
				if (err) { res.status(204).json(err); }
				else {
					res.json(data);
				}
			})
		}
	})
	app.post('/getImagenesPrimeraImagenPartida', (req, res) => {
		if (req.body.id_partida == null) {
			res.json("null");
		} else {
			// User.getImagenesPrimeraImagenPartida(req.body.id_partida, (err, data) => {
				// if (err) { res.status(204).json(err); }
				// else {
					res.json({
						"imagen":"/static/Sistema/user_image_default.jpg"
					});
				// }
			// })
		}
	})
	app.post('/getImagenesUltimaImagenPartida', (req, res) => {
		if (req.body.id_partida == null) {
			res.json("null");
		} else {
			// User.getImagenesUltimaImagenPartida(req.body.id_partida, (err, data) => {
				// if (err) { res.status(204).json(err); }
				res.json({
					"imagen":"/static/Sistema/user_image_default.jpg"
				});
			// })
		}
	})
}