const User = require('../models/procesosInformes');




module.exports = function(app){
    app.post('/informeControlEjecucionObras',(req,res)=>{
		// console.log(req.body);
    if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getinformeControlEjecucionObras(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
		
	})

	app.post('/getInformeDataGeneral',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getInformeDataGeneral(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
		
	})

	app.post('/resumenValorizacionPrincipal',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.resumenValorizacionPrincipal(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
		
	})
}