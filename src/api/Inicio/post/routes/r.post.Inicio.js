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
	app.post('/postcronogramamensual',async(req,res)=>{
		User.postcronogramamensual(req.body,async(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				var temp = req.body[0][0]
				req.body  = {
					id_ficha:temp
				}
				var corte = await User2.getUltimoCorte(req.body.id_ficha)
				
				var fecha_inicial = fechaLargaCorta(new Date(corte.fecha_inicial))
				var fecha_final = fechaLargaCorta(new Date(corte.fecha_final))								
				var avance = await User2.getAvanceGestionAnterior(req.body.id_ficha,corte.fecha_final)
					
				corte.programado_monto = avance.valor_total||0
				corte.programado_porcentaje = avance.porcentaje||0
				corte.fisico_monto = avance.valor_total||0
				corte.fisico_porcentaje = avance.porcentaje||0
				corte.financiero_porcentaje = (corte.financiero_monto/avance.costo_directo*100)
				var avance_Acumulado = 0
				if(corte.codigo == "C"){
					avance_Acumulado = corte.fisico_monto
				}
				var data = await User2.getcronogramaInicio(corte,req.body.id_ficha,corte.fecha_final)
					
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
							console.log(req.body.id_ficha,corte.fecha_final);
							var fecha_inicial = fechaLargaCorta(new Date(corte.fecha_inicial))
							var fecha_final = fechaLargaCorta(new Date(corte.fecha_final))								
							User2.getAvanceGestionAnterior(req.body.id_ficha,corte.fecha_final,(err,avance)=>{
								if(err){
									res.json(err);
								}else{
									corte.programado_monto = avance.valor_total||0
									corte.programado_porcentaje = avance.porcentaje||0
									corte.fisico_monto = avance.valor_total||0
									corte.fisico_porcentaje = avance.porcentaje||0
									corte.financiero_porcentaje = (corte.financiero_monto/avance.costo_directo*100)
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