const User = require('../models/m.get.InterfazGerencial');
module.exports = (app) => {
	app.post('/getProvincias', async (req, res) => {
		try {
			var data = await User.getProvincias(req.body.id_acceso)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getSectores', async (req, res) => {
		try {
			var data = await User.getSectores(req.body.id_acceso,req.body.id_unidadEjecutora)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getModalidadesEjecutoras', async (req, res) => {
		try {
			var data = await User.getModalidadesEjecutoras(req.body.id_acceso,req.body.id_unidadEjecutora)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getEstados', async (req, res) => {
		try {
			var data = await User.getEstados(req.body.id_acceso,req.body.id_unidadEjecutora)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getInterfazGerencialData', async (req, res) => {
		try {
			var data = await User.getInterfazGerencialData(req.body.id_acceso,req.body.id_unidadEjecutora, req.body.idsectores, req.body.idmodalidad_ejecutora, req.body.id_Estado)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/IG_AvanceFisico_anyos', async (req, res) => {
		try {
			var data = await User.IG_AvanceFisico_anyos(req.body.id_acceso,req.body.id_unidadEjecutora, req.body.idsectores, req.body.idmodalidad_ejecutora, req.body.id_Estado)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/IG_AvanceFisico', async (req, res) => {
		try {
			var data = await User.IG_AvanceFisico(req.body.id_acceso,req.body.id_unidadEjecutora, req.body.idsectores, req.body.idmodalidad_ejecutora, req.body.id_Estado,req.body.anyo)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/IG_AvanceFisicoProgramado_anyos', async (req, res) => {
		try {
			var data = await User.IG_AvanceFisicoProgramado_anyos(req.body.id_acceso,req.body.id_unidadEjecutora, req.body.idsectores, req.body.idmodalidad_ejecutora, req.body.id_Estado)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/IG_AvanceFisicoProgramado', async (req, res) => {
		try {
			var data = await User.IG_AvanceFisicoProgramado(req.body.id_acceso,req.body.id_unidadEjecutora, req.body.idsectores, req.body.idmodalidad_ejecutora, req.body.id_Estado,req.body.anyo)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
}
