const User = require('../models/m.get.users');

module.exports = function(app){
  	app.get('/listaUsuarios',async(req,res)=>{
		try {
			var getUsuarios = await User.getUsuarios()
        	res.json(getUsuarios);
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.post('/getUsuariosConAcceso',async(req,res)=>{
		try {
			var getUsuariosConAcceso = await User.getUsuariosConAcceso(req.body.id_ficha)
        	res.json(getUsuariosConAcceso);
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.get('/listaCargos',async(req,res)=>{
		try {
			var getCargos = await User.getCargos()
        	res.json(getCargos);
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.get('/getUsuariosAcceso',async(req,res)=>{
		try {
			var getUsuariosAcceso = await User.getUsuariosAcceso()
        	res.json(getUsuariosAcceso);
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.post('/getUsuarioData',async(req,res)=>{
		try {
			var getUsuarioData = await User.getUsuarioData(req.body.id_usuario)
        	res.json(getUsuarioData);
		} catch (error) {
			console.log(error);
			
			res.status(400).json(error)
		}
	})
	app.get('/getactualizarUsuario ',async(req,res)=>{
		try {
			var getactualizarUsuario  = await User.getactualizarUsuario ()
        	res.json(getactualizarUsuario );
		} catch (error) {
			res.status(400).json(error)
		}
	})
}
