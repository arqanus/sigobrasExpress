const User = require('../models/m.post.reportes');


function soloLetras(req,res,next){
	var regla = /^[A-Za-z0-9]+$/
	var usuario =  req.body.usuario
	if(usuario.match(regla)&&req.body.password.match(regla)){
		// console.log("usuario",usuario)
		next()
	}else{
		res.status(400).send("caracteres invalidos")
	}
}


module.exports = function(app){

	app.post('/postMeta',(req,res)=>{
		if(req.body.fichas_id_ficha == null){
			res.json("null");	
		}else{
			// res.json("bien")
			//uso del modelo
			User.postMeta(req.body,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
	
		
	})	
	
	
}
