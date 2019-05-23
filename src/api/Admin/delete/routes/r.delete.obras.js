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
}