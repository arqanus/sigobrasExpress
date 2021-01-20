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
	app.post('/getImagenesPrimeraImagenPartida', async (req, res) => {
		try {
			var data = await User.getPrimeraUltimaImagen(req.body.id_partida)
			res.json(data)
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getImagenesUltimaImagenPartida', async (req, res) => {
		try {
			var data = await User.getPrimeraUltimaImagen(req.body.id_partida,"desc")
			res.json(data)
		} catch (error) {
			res.status(400).json(error);
		}
	})
}