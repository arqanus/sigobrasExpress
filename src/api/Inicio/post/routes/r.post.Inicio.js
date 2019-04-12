const User = require('../models/m.post.Inicio');
const User2 = require('../../get/models/m.get.Inicio');

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
	app.post('/postcronogramamensual',(req,res)=>{
		
		//res.json("postcronogramamensual") //vista del resultado
		User.postcronogramamensual(req.body,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
     
				User2.getUltimoCorte(req.body[0][0],(err,corte)=>{
					if(err){
						res.json(err);	
					}else{
						// res.json(corte)
						console.log(req.body[0][0],corte.fecha_final);
						var fecha_inicial = fechaLargaCorta(new Date(corte.fecha_inicial))
						var fecha_final = fechaLargaCorta(new Date(corte.fecha_final))
						
						User2.getAvanceGestionAnterior(req.body[0][0],corte.fecha_final,(err,avance)=>{
							if(err){
								res.json(err);
							}else{
								console.log("avance",avance.avance);
								corte.fisico_monto = avance.avance||0
								var avance_Acumulado = 0
								if(corte.codigo == "C"){
									avance_Acumulado = corte.fisico_monto
	
								}
								
								User2.getcronogramaInicio(corte,req.body[0][0],corte.fecha_final,(err,data)=>{
									if(err){
										res.json(err);
									}else{
										if(data=="vacio"){
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
										data.fecha_inicial = fecha_inicial
										data.fecha_final = fecha_final
										data.avance_Acumulado = avance_Acumulado
										data.fechaActual = fechaActual()
										res.json(data)
									}	
								
								})
							}	
						
						})
					}	
				
				})
			}

		})
	})
	app.put('/postAvanceFinanciero',(req,res)=>{
		console.log("body",req.body);
			
		User.postAvanceFinanciero(req.body,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				User2.getCortesInicio(req.body[0][0],(err,cortes)=>{								
					cortes = cortes[cortes.length-1]									
					User2.getcronogramaInicio(req.body[0][0],cortes.fecha_inicial,cortes.fecha_final,(err,data)=>{			
						res.json(data)
					})
				})
			}
		})
	})
	app.put('/postFinancieroCorte',(req,res)=>{
		console.log("body",req.body);
			
		User.postFinancieroCorte(req.body.monto,req.body.id_historialEstado,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				if(req.body.id_ficha == null){
					res.json("null");		
				}else{
					
					
					User2.getUltimoCorte(req.body.id_ficha,(err,corte)=>{
						if(err){
							res.json(err);	
						}else{
							// res.json(corte)
							console.log(req.body.id_ficha,corte.fecha_final);
							var fecha_inicial = fechaLargaCorta(new Date(corte.fecha_inicial))
							var fecha_final = fechaLargaCorta(new Date(corte.fecha_final))
							
							User2.getAvanceGestionAnterior(req.body.id_ficha,corte.fecha_final,(err,avance)=>{
								if(err){
									res.json(err);
								}else{
									console.log("avance",avance.avance);
									corte.fisico_monto = avance.avance||0
									var avance_Acumulado = 0
									if(corte.codigo == "C"){
										avance_Acumulado = corte.fisico_monto
		
									}
									
									User2.getcronogramaInicio(corte,req.body.id_ficha,corte.fecha_final,(err,data)=>{
										if(err){
											res.json(err);
										}else{
											if(data=="vacio"){
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
											data.fecha_inicial = fecha_inicial
											data.fecha_final = fecha_final
											data.avance_Acumulado = avance_Acumulado
											data.fechaActual = fechaActual()
											res.json(data)
										}	
									
									})
								}	
							
							})
						}	
					
					})
				}
			}
		})
	})
}