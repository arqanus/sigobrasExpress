const User = require('../models/procesosGerenciales');


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
		
		User.getCargosById(req.body.id_ficha,(err,data)=>{
			if(err) {res.status(204).json(err);}
			else{
				res.status(200).json(data);
			}
			
		})	
		
	});	
	
	
}
