const User = require('../models/m.post.Inicio');
const User3 = require('../../get/models/m.get.Inicio');
const User2 = require('../../../ProcesosFisicos/get/models/m.get.valGeneral');
const tools = require('../../../../tools/format')
module.exports = function (app) {
	app.post('/postcronogramamensual', async (req, res) => {
		try {
			var data = User.postcronogramamensual(req.body)
			var periodos = await User2.getValGeneralPeriodos(req.body[0][0], 101, "TRUE")
			//buscamos corte
			var periodoCorte = null
			for (let i = periodos.length - 1; i >= 0; i--) {
				const periodo = periodos[i];
				if (periodo.codigo == "C") {
					periodoCorte = periodo
					break;
				}
			}
			var valorizacionCorte = null
			var corte = {}
			var avance_Acumulado = 0
			if (periodoCorte) {
				valorizacionCorte = await User2.getValGeneralResumenPeriodo(req.body[0][0], periodoCorte.fecha_inicial, periodoCorte.fecha_final, false)
				var financiero_monto = await User3.getFinancieroMonto(req.body[0][0])
				corte.id_historialEstado = financiero_monto.id_historialEstado
				corte.codigo = "C"
				corte.fecha = tools.fechaLargaCorta(new Date(periodoCorte.fecha_final))
				corte.mes = periodoCorte.mes + "."
				corte.anyo = periodoCorte.anyo
				corte.programado_monto = valorizacionCorte.valor_total
				corte.programado_porcentaje = valorizacionCorte.porcentaje_total
				corte.fisico_monto = valorizacionCorte.valor_total
				corte.fisico_porcentaje = valorizacionCorte.porcentaje_total
				corte.financiero_monto = financiero_monto.financiero_monto
				corte.financiero_porcentaje = financiero_monto.financiero_porcentaje
				avance_Acumulado = valorizacionCorte.valor_total
			} else {
				corte = "vacio"
				periodoCorte = {}
				periodoCorte.fecha_final = periodos[0].fecha_inicial
			}
			var cronograma = await User3.getcronogramaInicio(corte, req.body[0][0], periodoCorte.fecha_final)
			if (cronograma == "vacio") {
				cronograma = {}
				cronograma.programado_monto_total = 0
				cronograma.programado_porcentaje_total = 0
				cronograma.fisico_monto_total = 0
				cronograma.fisico_porcentaje_total = 0
				cronograma.financiero_monto_total = 0
				cronograma.financiero_porcentaje_total = 0
				cronograma.grafico_programado = []
				cronograma.grafico_fisico = []
				cronograma.grafico_financiero = []
				cronograma.grafico_periodos = []
				cronograma.data = []
				fecha_final = tools.fechaLargaCorta(new Date(periodoCorte.fecha_final))
			} else {
				fecha_final = cronograma.data[cronograma.data.length - 1].fecha
			}
			cronograma.fecha_inicial = tools.fechaLargaCorta(new Date(periodoCorte.fecha_final))
			cronograma.fecha_final = fecha_final
			cronograma.avance_Acumulado = avance_Acumulado
			cronograma.fechaActual = tools.fechaActual()
			res.json(
				cronograma
			)
		} catch (error) {
			console.log(error)
			res.status(400).json(error)
		}
	})
	app.put('/postFinancieroCorte', async (req, res) => {
		try {
			var data = await User.postFinancieroCorte(req.body.monto, req.body.id_historialEstado)
			if(req.body.id_ficha == null){
				throw "null"
			}
			var periodos = await User2.getValGeneralPeriodos(req.body.id_ficha, 101, "TRUE")
			//buscamos corte
			var periodoCorte = null
			for (let i = periodos.length - 1; i >= 0; i--) {
				const periodo = periodos[i];
				if (periodo.codigo == "C") {
					periodoCorte = periodo
					break;
				}
			}
			var valorizacionCorte = null
			var corte = {}
			var avance_Acumulado = 0
			if (periodoCorte) {
				valorizacionCorte = await User2.getValGeneralResumenPeriodo(req.body.id_ficha, periodoCorte.fecha_inicial, periodoCorte.fecha_final, false)
				var financiero_monto = await User3.getFinancieroMonto(req.body.id_ficha)
				corte.id_historialEstado = financiero_monto.id_historialEstado
				corte.codigo = "C"
				corte.fecha = tools.fechaLargaCorta(new Date(periodoCorte.fecha_final))
				corte.mes = periodoCorte.mes + "."
				corte.anyo = periodoCorte.anyo
				corte.programado_monto = valorizacionCorte.valor_total
				corte.programado_porcentaje = valorizacionCorte.porcentaje_total
				corte.fisico_monto = valorizacionCorte.valor_total
				corte.fisico_porcentaje = valorizacionCorte.porcentaje_total
				corte.financiero_monto = financiero_monto.financiero_monto
				corte.financiero_porcentaje = financiero_monto.financiero_porcentaje
				avance_Acumulado = valorizacionCorte.valor_total
			} else {
				corte = "vacio"
				periodoCorte = {}
				periodoCorte.fecha_final = periodos[0].fecha_inicial
			}
			var cronograma = await User3.getcronogramaInicio(corte, req.body.id_ficha, periodoCorte.fecha_final)
			if (cronograma == "vacio") {
				cronograma = {}
				cronograma.programado_monto_total = 0
				cronograma.programado_porcentaje_total = 0
				cronograma.fisico_monto_total = 0
				cronograma.fisico_porcentaje_total = 0
				cronograma.financiero_monto_total = 0
				cronograma.financiero_porcentaje_total = 0
				cronograma.grafico_programado = []
				cronograma.grafico_fisico = []
				cronograma.grafico_financiero = []
				cronograma.grafico_periodos = []
				cronograma.data = []
				fecha_final = tools.fechaLargaCorta(new Date(periodoCorte.fecha_final))
			} else {
				fecha_final = cronograma.data[cronograma.data.length - 1].fecha
			}
			cronograma.fecha_inicial = tools.fechaLargaCorta(new Date(periodoCorte.fecha_final))
			cronograma.fecha_final = fecha_final
			cronograma.avance_Acumulado = avance_Acumulado
			cronograma.fechaActual = tools.fechaActual()
			res.json(
				cronograma
			)
		} catch (error) {
			console.log(error)
			res.status(400).json(error)
		}
	})
}