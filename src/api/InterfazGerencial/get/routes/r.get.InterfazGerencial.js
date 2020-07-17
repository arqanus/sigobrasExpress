const User = require('../models/m.get.InterfazGerencial');
const { IG_AvanceFisico_porcentaje, IG_AvanceFinanciero_porcentaje } = require('../models/m.get.InterfazGerencial');
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
			var obras = await User.getInterfazGerencialData(req.body.id_acceso,req.body.id_unidadEjecutora, req.body.idsectores, req.body.idmodalidad_ejecutora, req.body.id_Estado)
			for (let index = 0; index < obras.length; index++) {
				const obra = obras[index];
				var avanceFisico_porcentaje =  await IG_AvanceFisico_porcentaje(obra.id_ficha)
				obra.avanceFisico_porcentaje = avanceFisico_porcentaje[0].porcentaje_avance||0
				var avanceFinanciero_porcentaje =  await IG_AvanceFinanciero_porcentaje(obra.id_ficha)			
				obra.avanceFinanciero_porcentaje = avanceFinanciero_porcentaje[0].porcentaje_avance||0
			}
			res.json(obras)

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
