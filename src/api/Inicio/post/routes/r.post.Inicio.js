const User = require('../models/m.post.Inicio');
const User2 = require('../../get/models/m.get.Inicio');


module.exports = function(app){
	app.post('/postcronogramamensual',(req,res)=>{
		
		//res.json("postcronogramamensual") //vista del resultado
		User.postcronogramamensual(req.body,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
     
				User2.getCortesInicio(req.body[0][0],(err,cortes)=>{								
					cortes = cortes[cortes.length-1]									
					User2.getcronogramaInicio(req.body[0][0],cortes.fecha_inicial,cortes.fecha_final,(err,data)=>{			
						res.json(data)
					})
				})
			}

		})
	})
	app.put('/postAvanceFinanciero',(req,res)=>{
		console.log("body",req.body);
			
		User.postAvanceFinanciero(req.body,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				User2.getCortesInicio(req.body[0][0],(err,cortes)=>{								
					cortes = cortes[cortes.length-1]									
					User2.getcronogramaInicio(req.body[0][0],cortes.fecha_inicial,cortes.fecha_final,(err,data)=>{			
						res.json(data)
					})
				})
			}
		})
})
}