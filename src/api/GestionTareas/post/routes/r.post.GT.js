const User = require('../models/m.post.GT');

module.exports = (app)=>{
	app.post('/postProyecto',(req,res)=>{
		User.postProyecto(req.body,(err,data)=>{
			if(err) {
				res.status(204).json(err)
			}else{
				res.json(data);
			}		
		})

	})

	
}
