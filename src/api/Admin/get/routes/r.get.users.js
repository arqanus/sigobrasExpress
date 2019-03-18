const User = require('../models/m.get.users');

module.exports = function(app){
  	app.get('/listaUsuarios',(req,res)=>{
		User.getUsuarios((err,data)=>{
			if(err) {res.status(204).json(err);}
			else {res.json(data);	}
		})

	})
	app.get('/listaCargos',(req,res)=>{
		User.getCargos((err,data)=>{
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}
		})
	})
	app.get('/getUsuariosAcceso',(req,res)=>{
		User.getUsuariosAcceso((err,data)=>{
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}
		})
	})
	app.post('/convertirJson',(req,res)=>{
		req.body =JSON.stringify(req.body)
		
		console.log("iniciand",req.body);
		res.json(req.body)	
		
			
	})

}
