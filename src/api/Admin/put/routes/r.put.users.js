const User = require('../models/m.put.users');

module.exports = function(app){
	app.put('/putMenusUsuarios',(req,res)=>{
		req.body = JSON.stringify(req.body)
		User.putMenusUsuarios(req.body,(err,data)=>{
			if(err) {
				res.status(204).json(err)
			}else{
				res.json(data);	
			}		
		})
	})	
}
