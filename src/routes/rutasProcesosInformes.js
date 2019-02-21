const User = require('../models/procesosInformes');




module.exports = function(app){
    app.post('/informeControlEjecucionObras',(req,res)=>{
		// console.log(req.body);
        
		User.getinformeControlEjecucionObras(req.body.id_ficha,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
	})
}