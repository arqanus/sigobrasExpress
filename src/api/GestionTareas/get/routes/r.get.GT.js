const User = require('../models/m.get.GT');

module.exports = function(app){
  	app.get('/getProyectos',(req,res)=>{
		User.getProyectos((err,data)=>{
			if(err) {res.status(204).json(err);}
			else {res.json(data);	}
		})

	})


}
