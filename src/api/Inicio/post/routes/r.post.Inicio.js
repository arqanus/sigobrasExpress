const User = require('../models/m.post.Inicio');
const User2 = require('../../get/models/m.get.Inicio');

function fechaLargaCorta(MyDate){

	var MyDateString;

	MyDate.setDate(MyDate.getDate() + 20);

	MyDateString = (MyDate.getFullYear()+'-'+('0' + (MyDate.getMonth()+1)).slice(-2)+'-'+('0' + MyDate.getDate()).slice(-2))
	
	return MyDateString
}
module.exports = function(app){
	app.post('/postcronogramamensual',(req,res)=>{
		
		//res.json("postcronogramamensual") //vista del resultado
		User.postcronogramamensual(req.body,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
     
				User2.getCortesInicio(req.body[0][0],(err,cortes)=>{
					if(req.body[0][0] == null){
						res.json("null");	
					}else{
						// res.json(cortes)					
						cortes = cortes[cortes.length-1]				
						var fecha_inicial = 0
						if(cortes.fecha_final == ""){
							fecha_inicial = cortes.fecha_inicial
						}else{
							fecha_inicial = cortes.fecha_final
						}
						
						User2.getAcumuladoCorte(req.body[0][0],fecha_inicial,(err,AcumuladoCorte)=>{
							if(err) {res.status(204).json(err);}
							else{
								
								
								var avance_Acumulado = AcumuladoCorte.fisico_monto
								console.log("aculadocorte",AcumuladoCorte);
								if(AcumuladoCorte == "vacio"){
									avance_Acumulado = 0
								}
								
								if(cortes.fecha_final == ""){
									AcumuladoCorte = "vacio"
								}
								// res.json(AcumuladoCorte)
								User2.getcronogramaInicio(AcumuladoCorte,req.body[0][0],fecha_inicial,cortes.fecha_final_gestion,(err,data)=>{	
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
										data.avance_Acumulado = 0
									}
									var fecha_final = null
									if(!data.data ||data.data.length==0){
										fecha_final = fechaLargaCorta(new Date(cortes.fecha_inicial))
										console.log("caso1");
									}else{
										fecha_final = data.data[data.data.length-1].fecha
										console.log("caso2");
										
									}
									data.fecha_inicial = fechaLargaCorta(new Date(cortes.fecha_inicial))
									data.fecha_final = fecha_final
									data.avance_Acumulado = avance_Acumulado
									data.fechaActual = fechaActual()
									res.json(data)
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
}