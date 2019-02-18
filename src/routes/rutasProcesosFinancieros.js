const User = require('../models/procesosFinancieros');
var moment = require('moment');


module.exports = function(app){
	var idAcceso = 1;
	app.post('/login',(req,res)=>{
		const userData = {
			nick_acceso: req.body.user,
			pass_acceso: req.body.pass		
		};

		User.postLogin(userData,(err,data)=>{
			if(err){
				res.json(err);
			}else{
				res.json(data);	
			}	
			
		})
		
		
	});	
	app.get('/inicioPeriodo/:id',(req,res)=>{
		User.iniPeriodo(req.params.id,(err,data)=>{
			if(err){
				res.json(err);
			}else{
				res.json(data);	
			}	
		})
		
	});	

	
	app.get('/metrados/:id',(req,res)=>{
		User.getMetrados(req.params.id,(err,data)=>{		 
			if(err){
				res.json(err);
			}else{
				res.json(data);	
			}	
				
		})
		
	});
	app.post('/metrados/:id',(req,res)=>{
		// console.log("este es id "+req.params.id);
		
		var fecha = moment().format();
		
		
		const userData = {
			avance_metrado: req.body.valor,
			descrip_metrado: req.body.descripcion,
			fecha_metrado:fecha,
			tb_metrado_original_id_temporal: req.params.id
		};

		// console.log(userData);
		
		User.postAvanceMetrados(userData,(err,data)=>{
			if(err){
				res.json(err);
			}else{
				res.json(data);	
			}			})
		
	});
	app.get('/historial/:id',(req,res)=>{
		User.getHistorialMetrados(req.params.id,(err,data)=>{		 
			if(err){
				res.json(err);
			}else{
				res.json(data);	
			}		
				
		})
		
	});
	app.get('/valEjecutadas/:id',(req,res)=>{
		User.valEjecutadas(req.params.id,(err,data)=>{		 
			if(err){
				res.json(err);
			}else{
				res.json(data);	
			}		
				
		})
		
	});

	app.get('/ValGeneral/:id',(req,res)=>{
		User.valGenerales(req.params.id,(err,data)=>{		 
			if(err){
				res.json(err);
			}else{
				res.json(data);	
			}		
				
		})
		
	});

	
}
