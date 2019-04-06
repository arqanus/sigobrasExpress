const User = require('../models/m.get.Inicio');
function fechaLargaCorta(MyDate){

	var MyDateString;

	MyDate.setDate(MyDate.getDate() + 20);

	MyDateString = (MyDate.getFullYear()+'-'+('0' + (MyDate.getMonth()+1)).slice(-2)+'-'+('0' + MyDate.getDate()).slice(-2))
	
	return MyDateString
}
function fechaActual(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
					dd = '0'+dd
	} 

	if(mm<10) {
					mm = '0'+mm
	} 

	return yyyy+"-"+mm;
	
}


module.exports = function(app){
 app.post('/PGlistaObras',(req,res)=>{
		
		User.getObras(req.body.id_acceso,(err,data)=>{
			if(err) {res.status(204).json(err);}
			else{
				res.status(200).json(data);
			}
			
		})	
		
	});	
	app.post('/getCargosById',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");	
		}else{
			User.getCargosById(req.body.id_ficha,(err,data)=>{
				if(err) {res.status(204).json(err);}
				else{
					res.status(200).json(data);
				}
				
			})	
		}	
	});	
	app.post('/getComponentesPgerenciales',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");	
		}else{
			User.getComponentesPgerenciales(req.body.id_ficha,(err,data)=>{
				if(err) {res.status(204).json(err);}
				else{
					res.status(200).json(data);
				}
				
			})	
		}	
	});
	app.post('/getImagenesPorObra',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");	
		}else{
			User.getImagenesPorObra(req.body.id_ficha,(err,data)=>{
				if(err) {res.status(204).json(err);}
				else{
					res.status(200).json(data);
				}
				
			})	
		}	
	});
	app.post('/getcronogramadinero',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getFechaInicioCronograma(req.body.id_ficha,(err,fecha_inicio)=>{			
				if(err =="vacio")				{
					res.json(err)
				}
				else if(err){ res.status(204).json(err);}
				else{
					User.getAcumuladoFisicoAnterior(req.body.id_ficha,fecha_inicio.fecha_inicial,(err,avance)=>{							
						if(err){ res.status(204).json(err);}
						else{
							User.getcronogramadinero(req.body.id_ficha,fecha_inicio.fecha_inicial,(err,cronogramadinero)=>{							
								if(err){ res.status(204).json(err);}
								else{
									var fecha_final = null
									if(!cronogramadinero ||cronogramadinero.length==0){
										fecha_final = fecha_inicio.fecha_inicial
										
									}else{
										fecha_final = cronogramadinero[cronogramadinero.length-1].fecha
									}
									res.json(
										{
											"fecha_inicial":fecha_inicio.fecha_inicial,
											"fecha_final":fecha_final,
											"avance_Acumulado":avance.avance,
											"cronogramadinero":cronogramadinero
										}
									)
								}
				
							})
						}
		
					})
				}

			})
		}
		
	})
	app.post('/getcronogramaInicio',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getCortesInicio(req.body.id_ficha,(err,cortes)=>{			
				cortes = cortes[cortes.length-1]				
				User.getcronogramaInicio(req.body.id_ficha,cortes.fecha_inicial,cortes.fecha_final,(err,data)=>{	
					if(data=="vacio")		{
						data = {}
						data.programado_monto_total
						data.programado_porcentaje_total
						data.fisico_monto_total
						data.fisico_porcentaje_total
						data.financiero_monto_total
						data.financiero_porcentaje_total
						data.grafico_programado=[]
						data.grafico_fisico=[]
						data.grafico_financiero=[]
						data.grafico_periodos=[]
						data.data=[]
					}
					var fecha_final = null
					if(!data.data ||data.data.length==0){
						fecha_final = fechaLargaCorta(cortes.fecha_inicial)
					}else{
						fecha_final = fechaLargaCorta(data.data[data.data.length-1].fecha)
					}
					data.fecha_inicial = fechaLargaCorta(cortes.fecha_inicial)
					data.fecha_final = fecha_final
					data.avance_Acumulado = 0
					data.fechaActual = fechaActual()
					res.json(data)
				})
			})
		}
		
	})
}
