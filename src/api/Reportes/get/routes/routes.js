const User = require('../models/models');

module.exports = function(app){
    app.get('/listaUsuarios',(req,res)=>{
		User.getUsuarios((err,data)=>{
			if(err) {res.status(204).json(err);}
			else {res.json(data);	}
		})

	})
}
