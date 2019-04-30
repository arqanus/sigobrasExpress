const User = require('../models/m.get.Inicio');
function fechaLargaCorta(MyDate){

	var MyDateString;

	

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
	app.post('/getcronogramaInicio',async(req,res)=>{
		try {
			var corte = await User.getUltimoCorte(req.body.id_ficha)
			var fecha_inicial = fechaLargaCorta(new Date(corte.fecha_inicial))
			var fecha_final = fechaLargaCorta(new Date(corte.fecha_final))								
			var avance = await User.getAvanceGestionAnterior(req.body.id_ficha,corte.fecha_final)
			console.log("avance",avance);
			corte.programado_monto = avance.valor_total||0
			corte.programado_porcentaje = avance.porcentaje||0
			corte.fisico_monto = avance.valor_total||0
			corte.fisico_porcentaje = avance.porcentaje||0
			corte.financiero_porcentaje = (corte.financiero_monto/avance.g_total_presu*100)
			var avance_Acumulado = 0
			if(corte.codigo == "C"){
				avance_Acumulado = corte.fisico_monto
			}
			var cronograma = await User.getcronogramaInicio(corte,req.body.id_ficha,corte.fecha_final)
			if(cronograma=="vacio"){
				cronograma = {}
				cronograma.programado_monto_total
				cronograma.programado_porcentaje_total
				cronograma.fisico_monto_total
				cronograma.fisico_porcentaje_total
				cronograma.financiero_monto_total
				cronograma.financiero_porcentaje_total
				cronograma.grafico_programado=[]
				cronograma.grafico_fisico=[]
				cronograma.grafico_financiero=[]
				cronograma.grafico_periodos=[]
				cronograma.data=[]								
			}
			cronograma.fecha_inicial = fecha_inicial
			cronograma.fecha_final = fecha_final
			cronograma.avance_Acumulado = avance_Acumulado
			cronograma.fechaActual = fechaActual()
			res.json(cronograma)
		} catch (error) {
			res.status(204).json(error)
		}
	})
}
