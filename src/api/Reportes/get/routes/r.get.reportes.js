const User = require('../models/m.get.reportes');
var path = require('path');
module.exports = function(app){
	
	
	//cabecera
	app.post('/getAnyoReportes',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getAnyoReportes(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}

			})
		}
		
	})
	app.post('/getPeriodsByAnyo',(req,res)=>{
		if(req.body.anyo == null){
			res.json("null");		
		}else{
			User.getPeriodsByAnyo(req.body.id_ficha,req.body.anyo,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
		
	})
	app.post('/getInformeDataGeneral',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{

			User.getInformeDataGeneral(req.body.id_ficha,req.body.historialestados_id_historialestado,req.body.fecha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}

			})
		}
		
	})
	//6.1 cuadro demetradosEJECUTADOS
	app.post('/CuadroMetradosEjecutados',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.CuadroMetradosEjecutados(req.body.id_ficha,req.body.historialestados_id_historialestado,req.body.fecha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}

			})
		}
		
	})
	//6.2 VAORIZACION PRINCIPALDELAOBRA-PRESUPUESTO-BASE
	app.post('/valorizacionPrincipal',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.valorizacionPrincipal(req.body.id_ficha,req.body.historialestados_id_historialestado,req.body.fecha_inicial,req.body.fecha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}

			})
		}
		
	})
	//6.3 resumen delavalorizacion principaldelaobrapresupuestobase
	app.post('/resumenValorizacionPrincipal',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getCostosIndirectos(req.body.id_ficha,(err,costosIndirectos)=>{							
					if(err){ res.status(204).json(err);}
					else{
						User.resumenValorizacionPrincipal(req.body.id_ficha,costosIndirectos,(err,data)=>{							
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
			User.getValGeneralExtras(req.body.id_ficha,'Mayor Metrado',(err,data)=>{							
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
			User.getValGeneralExtras(req.body.id_ficha,'Partida Nueva',(err,data)=>{							
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
			User.avanceMensualComparativoPresupuesto(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{

					res.json(data)
				}

			})
		}
		
	})
	//6.9 avance comparativ diagraa degantt
	//6.10 histograma del avance de obras curva s
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
	app.post('/getImagen', (req, res)=>{

		var ruta  = __dirname+'/../../../../../../imagenesActividades/'+"E001/12_31869_18-3-2019_0-40-38.jpg"
		res.sendFile(path.resolve(ruta));
		
	});


}
