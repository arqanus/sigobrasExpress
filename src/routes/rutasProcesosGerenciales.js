const User = require('../models/procesosGerenciales');


module.exports = function(app){
	
	app.post('/PGlistaObras',(req,res)=>{
		
		User.getObras(req.body.id_acceso,(err,data)=>{
			if(err) {res.json(err);}
			else{
				res.status(200).json(data);
			}
			
		})	
		
	});	
	
	
}
