const User = require('../models/m.get.Inicio');
const tools = require('../../../../tools/format')
const User2 = require('../../../ProcesosFisicos/get/models/m.get.valGeneral');

module.exports = (app) => {
	app.post('/PGlistaObras', async (req, res) => {
		try {
			var obras = await User.getObras(req.body.id_acceso)
			for (let i = 0; i < obras.length; i++) {
				const obra = obras[i];
				var avance_financiero = await User.getAvanceFinancieroCortes(obra.id_ficha)
				avance_financiero = avance_financiero.avance_financiero
				obra.avance_financiero += avance_financiero
				obra.porcentaje_financiero = obra.avance_financiero / obra.g_total_presu * 100
				//format
				obra.g_total_presu = tools.formatoSoles(obra.g_total_presu)
				obra.avance_financiero = tools.formatoSoles(obra.avance_financiero)
				obra.porcentaje_financiero = tools.formatoPorcentaje(obra.porcentaje_financiero)
			}
			res.json(obras)
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
				var financiero_monto = await User.getFinancieroMonto(req.body.id_ficha)
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
			var cronograma = await User.getcronogramaInicio(corte, req.body.id_ficha, periodoCorte.fecha_final)
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
			console.log(error);
			res.status(204).json(error)
		}
	})
}
