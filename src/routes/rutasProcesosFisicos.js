const User = require('../models/procesosFisicos');


module.exports = function(app){
	
	app.post('/listaPartidas',(req,res)=>{
		User.getPartidas(req.body.id_ficha,(err,data)=>{
			if(err){ res.json(err);}
			else{
				res.json(data);	
			}
		})

	})

	app.post('/avanceActividad',(req,res)=>{
		if(req.body.valor <=0 ||req.body.valor == ""){
			res.json("valor no permitido");
		}else{
			
			User.getIdHistorial(req.body.id_ficha,(err,data)=>{
				if(err||data.length==0){ res.json(err);}
				else{
					delete req.body.id_ficha
					req.body.historialEstados_id_historialEstado = data[0].id_historialEstado
					
					var id_actividad = req.body.Actividades_id_actividad
					User.postAvanceActividad(req.body,(err,data)=>{
						if(err){ res.json(err);}
						else{
							User.getAvanceById(req.body.Actividades_id_actividad,(err,data)=>{
								if(err){ res.json(err);}
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

		User.getHistorial(req.body.id_ficha,(err,data)=>{
			if(err){ res.json(err);}
			else{
				res.json(data);	
			}
		})
	
		

	})

	app.post('/getValGeneral',(req,res)=>{
			
		User.getValGeneral(req.body.id_ficha,(err,data)=>{
			if(err){ res.json(err);}
			else{
				res.json(data);	
			}
		})
	})	
}
