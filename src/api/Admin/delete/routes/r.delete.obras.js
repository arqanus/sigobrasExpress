const User = require('../models/delete.obras');

module.exports = (app)=>{

	app.delete('/deleteEliminarHistorial',async(req,res)=>{
		try {
			var data = User.deleteEliminarHistorial(req.body.id_historialEstado)
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.delete('/deleteEliminarUsuario',async(req,res)=>{
		try {
			var data  = await User.deleteEliminarUsuario(req.body.id_usuario)
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}
	})
	app.delete('/deleteResolucion',async(req,res)=>{
		try {
			var data  = await User.deleteResolucion(req.body.id_resolucion)
			res.json(data)
		} catch (error) {
			console.log(error);			
			res.status(400).json(error)
		}
	})
}