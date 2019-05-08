const User = require('../models/m.get.reportes');
const User2 = require('../../../ProcesosFisicos/get/models/m.get.valGeneral');
const User3 = require('../../../Interfaz/get/models/m.get.interfaz');
var path = require('path');
module.exports = function(app){
	//cabecera
	app.post('/getAnyoReportes',async(req,res)=>{
		try {
            var anyos = await User2.getValGeneralAnyos(req.body.id_ficha)
            res.json(anyos);
        } catch (error) {
            res.status(204).json(error)
        }
	})
	app.post('/getPeriodsByAnyo',async(req,res)=>{
		try {
            var periodos = await User2.getValGeneralPeriodos(req.body.id_ficha,req.body.anyo)
            res.json(periodos)
        } catch (error) {
            res.status(204).json(error)
        }
	})
	app.post('/getInformeDataGeneral',async(req,res)=>{
		try {
			var InformeDataGeneral = await User.getInformeDataGeneral(req.body.id_ficha,req.body.fecha_inicial)
			var costo_directo = await User3.getCostoDirecto(req.body.id_ficha,true)
			var avance_actual = await User3.getAvanceActual(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final)
			var avance_acumulado = await User3.getAvanceActual(req.body.id_ficha,"2000-01-01 00:00:00",req.body.fecha_final)
			var residente = await User3.getCargoPersonal(req.body.id_ficha,"residente")
			var supervisor = await User3.getCargoPersonal(req.body.id_ficha,"supervisor")
			InformeDataGeneral.costo_directo = costo_directo
			InformeDataGeneral.avance_actual = avance_actual.metrado
			InformeDataGeneral.avance_actual_valor = avance_actual.valor
			InformeDataGeneral.porcentaje_avance_fisico = avance_actual.porcentaje
			InformeDataGeneral.avance_acumulado = avance_acumulado.metrado
			InformeDataGeneral.avance_acumulado_valor = avance_acumulado.valor
			InformeDataGeneral.porcentaje_avance_acumulado = avance_acumulado.porcentaje
			InformeDataGeneral.residente = residente
			InformeDataGeneral.supervisor = supervisor
            res.json(InformeDataGeneral)

		} catch (error) {
            res.json(error)
		}

			
	})
	//6.1 cuadro demetradosEJECUTADOS
	app.post('/CuadroMetradosEjecutados',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.CuadroMetradosEjecutados(req.body.id_ficha,req.body.fecha_final,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}

			})
		}
		
	})
	//6.2 VAORIZACION PRINCIPALDELAOBRA-PRESUPUESTO-BASE
	app.post('/valorizacionPrincipal',async (req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			var componentes = await User2.getValGeneralComponentes(req.body.id_ficha)
			for (let i = 0; i < componentes.length; i++) {
				const componente = componentes[i];
				var partidas = await User2.getValGeneralPartidas(componente.id_componente,req.body.fecha_inicial,req.body.fecha_final)			
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
	app.post('/resumenValorizacionPrincipal',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getCostosIndirectos(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,(err,costosIndirectos)=>{							
					if(err){ res.status(204).json(err);}
					else{
						User.resumenValorizacionPrincipal(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,costosIndirectos,(err,data)=>{							
							if(err){ res.status(204).json(err);}
							else{
								res.json(data);	
							}
				
						})	
					}
		
				})
			
		}
		
	})
	//6.4 vaorizacion pormayores metrados
	app.post('/valorizacionMayoresMetrados',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getValGeneralExtras(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,'Mayor Metrado',(err,data)=>{							
					if(err){ res.status(204).json(err);}
					else{
						res.json(data)
					}
		
				})
			
		}
		
	})
	//6.5 valorizacion de partidas nuevas
	app.post('/valorizacionPartidasNuevas',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getValGeneralExtras(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,'Partida Nueva',(err,data)=>{							
					if(err){ res.status(204).json(err);}
					else{
						res.json(data)
					}
		
				})
			
		}
		
	})
	//6.6 consolidado general de las valorizacines
	//6.7 resumen de avan ce fisico de las partidas de obra por mes 
	app.post('/resumenAvanceFisicoPartidasObraMes',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getMonthsByFicha(req.body.id_ficha,(err,meses)=>{							
				if(err){ res.status(204).json(err);}
				else{

					User.resumenAvanceFisicoPartidasObraMes(meses,req.body.id_ficha,(err,data)=>{							
						if(err){ res.status(204).json(err);}
						else{
		
							res.json(data);	
						}
			
					})
				}

			})
		}
		
	})
	//6.8 avance mensual comparativos de acuerdo al presupuesto delaobra y mesavance comparativos
	app.post('/avanceMensualComparativoPresupuesto',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.avanceMensualComparativoPresupuesto(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data)
				}
			})
		}
		
	})
	//6.9 avance comparativ diagraa degantt
	app.post('/getCortes',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getCortes(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data)
				}
			})
		}
		
	})
	app.post('/avanceComparativoDiagramaGantt',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.histogramaAvanceObra(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data)
				}
			})
		}
		
	})
	//6.10 histograma del avance de obras curva s
	app.post('/histogramaAvanceObra',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.histogramaAvanceObra(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data)
				}
			})
		}
		
	})
	//6.11 proyeccion de trabajos prosxioms mes cronograma
	//6.12 informe mensual
	app.post('/informeControlEjecucionObras',(req,res)=>{
		// console.log(req.body);
	if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getinformeControlEjecucionObras(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{					
					res.json(data);	
				}

			})
		}
		
	})
	app.post('/getcronograma',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getcronograma(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data)
				}

			})
		}
		
	})
	app.post('/getInformeImagen', (req, res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getInformeImagen(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data)
				}

			})
		}
	});
	


}
