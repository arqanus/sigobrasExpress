const User = require('../models/m.get.Inicio');
const tools = require('../../../../tools/format')

module.exports = (app) => {
	app.post('/PGlistaObras', async (req, res) => {
		try {
			var data = await User.getObras(req.body.id_acceso)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getComponentesPgerenciales', async (req, res) => {
		try {
			var data = await User.getComponentesPgerenciales(req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getCargosById', async (req, res) => {
		try {
			var cargos = await User.getCargosById_ficha(req.body.id_ficha)
			for (let i = 0; i < cargos.length; i++) {
				const cargo = cargos[i];
				var data = await User.getUsuariosByCargo(req.body.id_ficha, cargo.id_cargo)
				cargo.data = data
			}
			res.json(cargos)
		} catch (error) {
			res.status(200).json(error)
		}
	});
	app.post('/getcronogramaInicio', async (req, res) => {
		try {
			var corte = await User.getUltimoCorte(req.body.id_ficha)
			var fecha_inicial = tools.fechaLargaCorta(new Date(corte.fecha_inicial))
			var fecha_final = tools.fechaLargaCorta(new Date(corte.fecha_final))
			var avance = await User.getAvanceGestionAnterior(req.body.id_ficha, corte.fecha_final)
			corte.programado_monto = avance.valor_total || 0
			corte.programado_porcentaje = avance.porcentaje || 0
			corte.fisico_monto = avance.valor_total || 0
			corte.fisico_porcentaje = avance.porcentaje || 0
			corte.financiero_porcentaje = (corte.financiero_monto / avance.g_total_presu * 100)
			var avance_Acumulado = 0
			if (corte.codigo == "C") {
				avance_Acumulado = corte.fisico_monto
			}
			var cronograma = await User.getcronogramaInicio(corte, req.body.id_ficha, corte.fecha_final)
			if (cronograma == "vacio") {
				cronograma = {}
				cronograma.programado_monto_total
				cronograma.programado_porcentaje_total
				cronograma.fisico_monto_total
				cronograma.fisico_porcentaje_total
				cronograma.financiero_monto_total
				cronograma.financiero_porcentaje_total
				cronograma.grafico_programado = []
				cronograma.grafico_fisico = []
				cronograma.grafico_financiero = []
				cronograma.grafico_periodos = []
				cronograma.data = []
			}else{
				fecha_final = cronograma.data[cronograma.data.length-1].fecha
			}
			cronograma.fecha_inicial = fecha_inicial
			cronograma.fecha_final = fecha_final
			cronograma.avance_Acumulado = avance_Acumulado
			cronograma.fechaActual = tools.fechaActual()
			res.json(cronograma)
		} catch (error) {
			res.status(204).json(error)
		}
	})
}
