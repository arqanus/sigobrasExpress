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
	app.get('/getUsuariosConAcceso',async(req,res)=>{
		try {
			var getUsuariosConAcceso = await User.getUsuariosConAcceso()
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
}
