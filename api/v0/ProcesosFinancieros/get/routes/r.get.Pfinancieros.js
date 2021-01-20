const User = require('../models/m.get.pFinancieros');

module.exports = function(app){
	app.get('/getGananciasyCostos',(req,res)=>{
		
		//res.json("GananciasyCostos") //vist del resultado
		User.getGananciasyCostos(req.body,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
    })
}
