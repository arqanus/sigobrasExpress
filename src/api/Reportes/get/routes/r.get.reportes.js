const User = require('../models/m.get.reportes');
const User2 = require('../../../ProcesosFisicos/get/models/m.get.valGeneral');
const User3 = require('../../../Interfaz/get/models/m.get.interfaz');
const User4 = require('../../../ProcesosFisicos/get/models/m.get.historial');
const User5 = require('../../../Inicio/get/models/m.get.Inicio');
const tools = require('../../../../tools/format')
var fs = require('fs');
var request = require('request').defaults({ encoding: null });
module.exports = function (app) {
	//cabecera
	app.post('/getAnyoReportes', async (req, res) => {
		try {
			var anyos = await User2.getValGeneralAnyos(req.body.id_ficha)
			res.json(anyos);
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.post('/getPeriodsByAnyo', async (req, res) => {
		try {
			var periodos = await User2.getValGeneralPeriodos(req.body.id_ficha, req.body.anyo, "FALSE")
			res.json(periodos)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.post('/getInformeDataGeneral', async (req, res) => {
		try {
			var InformeDataGeneral = await User.getInformeDataGeneral(req.body.id_ficha, req.body.fecha_inicial)

			// var avance_actual = await User3.getAvanceActual(req.body.id_ficha, req.body.fecha_inicial, req.body.fecha_final)
			// var avance_acumulado = await User3.getAvanceActual(req.body.id_ficha, "2000-01-01 00:00:00", req.body.fecha_final)
			var residente = await User3.getCargoPersonal(req.body.id_ficha, "residente")
			var supervisor = await User3.getCargoPersonal(req.body.id_ficha, "supervisor")
			var avances = await User.getAvancesCabezera(req.body.id_ficha, req.body.fecha_inicial, req.body.fecha_final, true)

			InformeDataGeneral.costo_directo = avances.presupuesto
			// InformeDataGeneral.avance_actual = avance_actual.metrado
			// InformeDataGeneral.avance_actual_valor = avance_actual.valor
			InformeDataGeneral.porcentaje_avance_fisico = avances.porcentaje_actual
			// InformeDataGeneral.avance_acumulado = avance_acumulado.metrado
			// InformeDataGeneral.avance_acumulado_valor = avance_acumulado.valor
			InformeDataGeneral.porcentaje_avance_acumulado = avances.porcentaje_total
			InformeDataGeneral.residente = residente
			InformeDataGeneral.supervisor = supervisor
			res.json(InformeDataGeneral)
			//res.json(avances)
		} catch (error) {
			res.json(error)
		}
	})
	//6.1 cuadro demetradosEJECUTADOS
	app.post('/CuadroMetradosEjecutados', async (req, res) => {
		try {
			var componentes = await User4.getHistorialComponentes(req.body.id_ficha, req.body.fecha_inicial)
			for (let i = 0; i < componentes.length; i++) {
				const comp = componentes[i];
				var fechas = await User4.getHistorialFechas(comp.id_componente, req.body.fecha_inicial)
				comp.fechas = fechas
				for (let j = 0; j < comp.fechas.length; j++) {
					const fecha = comp.fechas[j];
					var historial = await User4.getHistorialDias(comp.id_componente, fecha.fecha)
					fecha.historial = historial
				}
			}
			res.json(componentes)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	//6.2 VAORIZACION PRINCIPALDELAOBRA-PRESUPUESTO-BASE
	app.post('/valorizacionPrincipal', async (req, res) => {
		if (req.body.id_ficha == null) {
			res.json("null");
		} else {
			var componentes = await User2.getValGeneralComponentes(req.body.id_ficha)
			for (let i = 0; i < componentes.length; i++) {
				const componente = componentes[i];
				var partidas = await User2.getValGeneralPartidas(componente.id_componente, req.body.fecha_inicial, req.body.fecha_final)
				componente.valor_anterior = partidas.valor_anterior
				componente.valor_actual = partidas.valor_actual
				componente.valor_total = partidas.valor_total
				componente.valor_saldo = partidas.valor_saldo
				componente.presupuesto = partidas.precio_parcial
				componente.porcentaje_anterior = partidas.porcentaje_anterior
				componente.porcentaje_actual = partidas.porcentaje_actual
				componente.porcentaje_total = partidas.porcentaje_total
				componente.porcentaje_saldo = partidas.porcentaje_saldo
				componente.partidas = partidas.partidas
			}
			res.json(componentes)
		}
	})
	//6.3 resumen delavalorizacion principaldelaobrapresupuestobase
	app.post('/resumenValorizacionPrincipal', async (req, res) => {
		try {
			var costosIndirectos = await User.getCostosIndirectos(req.body.id_ficha, req.body.fecha_inicial, req.body.fecha_final)
			var resumen = await User.resumenValorizacionPrincipal(req.body.id_ficha, req.body.fecha_inicial, req.body.fecha_final, costosIndirectos)
			res.json(resumen)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	//6.4 vaorizacion por mayores metrados
	app.post('/getAnyoReportesValGeneraMMyPN', async (req, res) => {
		try {
			var anyos = await User2.getValGeneraMayoresMetradoslAnyos(req.body.id_ficha, req.body.tipo)
			res.json(anyos);
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.post('/getPeriodsByAnyoValGeneraMMyPN', async (req, res) => {
		try {
			var periodos = await User2.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha, req.body.anyo, req.body.tipo)
			res.json(periodos)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.post('/valorizacionMayoresMetrados', async (req, res) => {
		try {
			var data = await User.getValGeneralExtras(req.body.id_ficha, req.body.fecha_inicial, req.body.fecha_final, 'Mayor Metrado')
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	//6.5 valorizacion de partidas nuevas
	app.post('/valorizacionPartidasNuevas', (req, res) => {
		try {
			var data = User.getValGeneralExtras(req.body.id_ficha, req.body.fecha_inicial, req.body.fecha_final, 'Partida Nueva')
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	//6.6 consolidado general de las valorizacines
	//6.7 resumen de avan ce fisico de las partidas de obra por mes 
	app.post('/resumenAvanceFisicoPartidasObraMes', async (req, res) => {
		try {
			var data = await User.getMonthsByFicha(req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	//6.8 avance mensual comparativos de acuerdo al presupuesto delaobra y mesavance comparativos
	app.post('/avanceMensualComparativoPresupuesto', async (req, res) => {
		try {
			var data = await User.avanceMensualComparativoPresupuesto(req.body.id_ficha, req.body.fecha_inicial, req.body.fecha_final)
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	//6.9 avance comparativ diagraa degantt
	// app.post('/getCortes', async (req, res) => {
	// 	try {
	// 		var data = await User.getCortes(req.body.id_ficha)
	// 		res.json(data)
	// 	} catch (error) {
	// 		res.status(400).json(error)
	// 	}
	// })
	app.post('/avanceComparativoDiagramaGantt', async (req, res) => {
		try {
			var corte = await User5.getUltimoCorte(req.body.id_ficha)
			var fecha_inicial = tools.fechaLargaCorta(new Date(corte.fecha_inicial))
			var fecha_final = tools.fechaLargaCorta(new Date(corte.fecha_final))
			var avance = await User5.getAvanceGestionAnterior(req.body.id_ficha, corte.fecha_final)
			corte.programado_monto = avance.valor_total || 0
			corte.programado_porcentaje = avance.porcentaje || 0
			corte.fisico_monto = avance.valor_total || 0
			corte.fisico_porcentaje = avance.porcentaje || 0
			corte.financiero_porcentaje = (corte.financiero_monto / avance.g_total_presu * 100)
			var avance_Acumulado = 0
			if (corte.codigo == "C") {
				avance_Acumulado = corte.fisico_monto
			}
			var cronograma = await User5.getcronogramaInicio(corte, req.body.id_ficha, corte.fecha_final)
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
			} else {
				fecha_final = cronograma.data[cronograma.data.length - 1].fecha
			}
			cronograma.fecha_inicial = fecha_inicial
			cronograma.fecha_final = fecha_final
			cronograma.avance_Acumulado = avance_Acumulado
			cronograma.fechaActual = tools.fechaActual()
			res.json(cronograma)
		} catch (error) {
			console.log(error);
			res.status(400).json(error)
		}
	})
	//6.10 histograma del avance de obras curva s
	app.post('/histogramaAvanceObra', async (req, res) => {
		try {
			var corte = await User5.getUltimoCorte(req.body.id_ficha)
			var fecha_inicial = tools.fechaLargaCorta(new Date(corte.fecha_inicial))
			var fecha_final = tools.fechaLargaCorta(new Date(corte.fecha_final))
			var avance = await User5.getAvanceGestionAnterior(req.body.id_ficha, corte.fecha_final)
			corte.programado_monto = avance.valor_total || 0
			corte.programado_porcentaje = avance.porcentaje || 0
			corte.fisico_monto = avance.valor_total || 0
			corte.fisico_porcentaje = avance.porcentaje || 0
			corte.financiero_porcentaje = (corte.financiero_monto / avance.g_total_presu * 100)
			var avance_Acumulado = 0
			if (corte.codigo == "C") {
				avance_Acumulado = corte.fisico_monto
			}
			var cronograma = await User5.getcronogramaInicio(corte, req.body.id_ficha, corte.fecha_final)
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
			} else {
				fecha_final = cronograma.data[cronograma.data.length - 1].fecha
			}
			cronograma.fecha_inicial = fecha_inicial
			cronograma.fecha_final = fecha_final
			cronograma.avance_Acumulado = avance_Acumulado
			cronograma.fechaActual = tools.fechaActual()
			res.json(cronograma)
		} catch (error) {
			console.log(error);
			res.status(400).json(error)
		}
	})
	//6.11 proyeccion de trabajos prosxioms mes cronograma
	//6.12 informe mensual
	app.post('/informeControlEjecucionObras', async (req, res) => {
		try {
			var data = await User.getinformeControlEjecucionObras(req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.post('/getcronograma', async (req, res) => {
		try {
			var data = await User.getcronograma(req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}

	})
	app.post('/getInformeImagen', async (req, res) => {
		try {
			var data = await User.getInformeImagen(req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}
	});
	app.post('/getImagenesCurvaS', async (req, res) => {
		try {
			var data = await User.getImagenesCurvaS(req.body.id_ficha)
			var img = await new Promise((resolve, reject) => {
				request.get('http://api.sigobras.com'+data[0].imagen,  (error, response, body)=> {
					if (!error && response.statusCode == 200) {
						var res = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
						resolve(res);
					}
					reject("")
				});
			})
			var img2 = await new Promise((resolve, reject) => {
				request.get('http://api.sigobras.com'+data[1].imagen,  (error, response, body)=> {
					if (!error && response.statusCode == 200) {
						var res = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
						resolve(res);
					}
					reject("")
				});
			})
			res.json([
				{
					imgb64:img,
					descripcion:data[0].descripcionObservacion
				},
				{
					imgb64:img2,
					descripcion:data[1].descripcionObservacion
				}
			])
		} catch (error) {
			console.log(error);
			res.status(204).json(error.code)
		}
	});
}
