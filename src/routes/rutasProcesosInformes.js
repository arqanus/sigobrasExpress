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
			User.getCostosIndirectos(req.body.id_ficha,(err,costosIndirectos)=>{							
					if(err){ res.status(204).json(err);}
					else{
						User.resumenValorizacionPrincipal(req.body.id_ficha,costosIndirectos,(err,data)=>{							
							if(err){ res.status(204).json(err);}
							else{
								res.json(data);	
							}
				
						})	
					}
		
				})
			
		}
		
	})
	app.post('/resumenAvanceFisicoPartidasObraMes',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getMonthsByFicha(req.body.id_ficha,(err,meses)=>{							
				if(err){ res.status(204).json(err);}
				else{

					User.resumenAvanceFisicoPartidasObraMes(meses,req.body.id_ficha,(err,data)=>{							
						if(err){ res.status(204).json(err);}
						else{
		
							res.json(data);	
						}
			
					})
				}
	
			})
		}
		
	})
	app.post('/getcronograma',(req,res)=>{
		if(req.body.id_ficha == null){
			res.json("null");		
		}else{
			User.getcronograma(req.body.id_ficha,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data)
				}
	
			})
		}
		
	})
}