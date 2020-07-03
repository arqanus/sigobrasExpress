const User = require('../models/m.get.InterfazGerencial');
module.exports = (app) => {
	app.get('/getProvincias', async (req, res) => {
		try {
			var data = await User.getProvincias()
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.get('/getSectores', async (req, res) => {
		try {
			var data = await User.getSectores()
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.get('/getModalidadesEjecutoras', async (req, res) => {
		try {
			var data = await User.getModalidadesEjecutoras()
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.get('/getEstados', async (req, res) => {
		try {
			var data = await User.getEstados()
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getInterfazGerencialData', async (req, res) => {
		try {
			var data = await User.getInterfazGerencialData(req.body.id_unidadEjecutora, req.body.idsectores, req.body.idmodalidad_ejecutora, req.body.id_Estado)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
}
