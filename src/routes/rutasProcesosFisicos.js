const User = require('../models/procesosFisicos');


module.exports = function(app){
	
	app.post('/listaPartidas',(req,res)=>{
		if (req.body.id_ficha == null) {
			res.json("null");
		} else {
			User.getPartidas(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
		

	})

	app.post('/listaPartidasNuevas',(req,res)=>{
		if (req.body.id_ficha == null ||req.body.id_ficha == "null"||req.body.id_ficha == "") {
			res.json("null");
		} else {
			User.getPartidasNuevas(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
		

	})

	app.post('/avanceActividad',(req,res)=>{
		if(req.body.valor <=0 ||req.body.valor == ""){
			res.json("valor no permitido");
		}else{			
			User.getIdHistorial(req.body.id_ficha,(err,data)=>{
				if(err||data.length==0){ res.status(204).json(err);}
				else{
					delete req.body.id_ficha
					req.body.historialEstados_id_historialEstado = data[0].id_historialEstado
					
					
					User.postAvanceActividad(req.body,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
							User.getAvanceById(req.body.Actividades_id_actividad,(err,data)=>{
								if(err){ res.status(204).json(err);}
								else{
									res.json(data);	
								}
							})
							
						}
					})
				}
			})
		}
		

	})
	app.post('/avanceActividadCorte',(req,res)=>{
		if (req.body.id_ficha == null) {
			res.json("null");
		} else {
			User.getIdHistorial(req.body.id_ficha,(err,data)=>{
				if(err||data.length==0){ res.status(204).json(err);}
				else{
					delete req.body.id_ficha
					req.body.historialEstados_id_historialEstado = data[0].id_historialEstado
					
					var id_actividad = req.body.Actividades_id_actividad
					User.postAvanceActividad(req.body,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
							User.getAvanceById(req.body.Actividades_id_actividad,(err,data)=>{
								if(err){ res.status(204).json(err);}
								else{
									res.json(data);	
								}
							})
							
						}
					})
				}
			})
		}
		
		
		

	})
	app.post('/getHistorial',(req,res)=>{
		if (req.body.id_ficha == null) {
			res.json("null")
		} else {			
			User.getHistorial(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
	

	})

	app.post('/getValGeneral',(req,res)=>{
		if (req.body.id_ficha == null) {
			res.json("null")
		} else {
			User.getValGeneral(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
			
		
	})
	app.post('/getValGeneralPartidasNuevas',(req,res)=>{
		if (req.body.id_ficha == null) {
			res.json("null")
		} else {
			User.getValGeneralPartidasNuevas(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}			
		
	})

	app.post('/getActividadesDuracion',(req,res)=>{
		if (req.body.id_ficha == null) {
			res.json("null")
		} else {
			User.getActividadesDuracion(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}			
		
	})

	app.post('/postActividadMayorMetrado',(req,res)=>{
		var actividad = req.body.actividad
		if (actividad.partidas_id_partida == null) {
			res.json("null")
		}else{
			User.postActividadMayorMetrado(actividad,(err,id_actividad)=>{
				if(err){ res.status(204).json(err);}
				else{
					var historialActividad = {						
						"estado":"Mayor Metrado",
						"actividades_id_actividad":id_actividad
					}
					User.posthistorialActividades(historialActividad,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
							var avanceActividad = req.body.avanceActividad
							avanceActividad.Actividades_id_actividad = id_actividad
							var id_ficha = avanceActividad.id_ficha
							
							User.getIdHistorial(id_ficha,(err,data)=>{
								console.log("idhistorial");
								if(err||data.length==0){ res.status(204).json(err);}
								else{
									delete avanceActividad.id_ficha
									avanceActividad.historialEstados_id_historialEstado = data[0].id_historialEstado
									
									
									User.postAvanceActividad(avanceActividad,(err,data)=>{
										console.log("avance");
										
										if(err){ res.status(204).json(err);}
										else{
											User.getAvanceById(id_actividad,(err,data)=>{
												if(err){ res.status(204).json(err);}
												else{
													res.json(data);	
												}
											})
											
										}
									})
								}
							})
						}
					})
				}
			})
		}			
		
	})

	app.post('/postNuevaActividadMayorMetrado',(req,res)=>{
		if (req.body.partidas_id_partida == null) {
			res.json("null")
		} else {
			User.postActividadMayorMetrado(req.body,(err,id_actividad)=>{
				if(err){ res.status(204).json(err);}
				else{
					User.getAvanceById(id_actividad,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
							res.json(data);	
						}
					})
				}
			})
		}			
		
	})
}
