const User = require('../models/procesosFisicos');
var moment = require('moment');

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
		if(req.body.valor <0){
			res.json("valor no permitido");
		}else{
			
			User.getIdHistorial(req.body.id_ficha,(err,data)=>{
				if(err){ res.json(err);}
				else{
					delete req.body.id_ficha
					req.body.historialEstados_id_historialEstado = data[0].id_historialEstado
					req.body.fecha =moment().format()
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
