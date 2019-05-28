const User = require('../models/delete.obras');

module.exports = (app)=>{

	app.delete('/deleteEliminarHistorial',(req,res)=>{
		
		User.deleteEliminarHistorial(req.body.id_historialEstado,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
	})
	app.delete('/deleteEliminarUsuario',async(req,res)=>{
		try {
			var data  = await User.deleteEliminarUsuario(req.body.id_usuario)
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}

	})
}