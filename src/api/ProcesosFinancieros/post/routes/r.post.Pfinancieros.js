const User = require('../models/m.post.pFinancieros');

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
	app.post('/postCostosIndirectos',(req,res)=>{
		
			//vist del resultado
		User.postCostosIndirectos(req.body,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
		
	
		
	})	
	app.post('/postHistorialCostosIndirectos',(req,res)=>{
		if(req.body.monto == null){
			res.json("null");	
		}else{
			 //vist del resultado
			User.postHistorialCostosIndirectos(req.body,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
	
		
	}) 	
	app.put('/postAvanceFinanciero',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");	
		}else{
			 console.log("body",req.body);
				
			User.postAvanceFinanciero(req.body.financieroEjecutado,req.body.id_ficha,req.body.mes,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
	
		
	})
}
