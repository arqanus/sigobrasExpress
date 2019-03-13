const User = require('../models/procesosFisicos');


module.exports = function(app){
	
	app.post('/listaPartidas',(req,res)=>{
		if (req.body.id_ficha == null ||req.body.id_ficha == "null"||req.body.id_ficha == "") {
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
		var d = new Date();
		var mes_actual = d.getMonth();
		var dia_actual = d.getDate();
		var anyo_actual = d.getFullYear();
		

		var a = new Date(req.body.fecha);
		var mes_ingreso = a.getMonth();
		var dia_ingreso = a.getDate()+1;
		var anyo_ingreso = a.getFullYear();
		console.log("dia",dia_actual,dia_ingreso);

		if(req.body.valor <=0 ||req.body.valor == ""){
			res.status(204).json("valor no permitido");
		}else if(req.body.fecha&&(anyo_actual!=anyo_ingreso||mes_actual!=mes_ingreso||dia_ingreso > dia_actual)){
			
			
			
			res.status(204).json("fecha invalida")
					
			
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
			User.getValGeneralExtras(req.body.id_ficha,"Partida Nueva",(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}			
		
	})
	app.post('/getValGeneralMayorMetrado',(req,res)=>{
		if (req.body.id_ficha == null) {
			res.json("null")
		} else {
			User.getValGeneralExtras(req.body.id_ficha,"Mayor Metrado",(err,data)=>{
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
	app.post('/getMaterialesPorObra',(req,res)=>{
		if (req.body.id_ficha == null) {
			res.json("null")
		} else {
			User.getMaterialesPorObra(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}			
		
	})

	
}
