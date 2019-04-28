const User = require('../models/m.put.GT');
const User2 = require('../../get/models/m.get.GT')

module.exports = function(app){
	app.put('/putSubtareaAvance',async(req,res)=>{
		try {
			var affectedRows = await User.putSubtareaAvance(req.body.terminado,req.body.id_subtarea)	
			console.log("affectedRows",affectedRows);
			if(affectedRows==0){
				throw "no_existe"
			}else{
				var porcentaje = await User2.getTareaPorcentajeAvance(req.body.id_tarea)
				porcentaje = porcentaje.porcentajeAvance
				var tareas = await User2.getTareaIdTarea(req.body.id_tarea)
				var numero_tareas = tareas.numero
				res.json(
					{
						porcentaje,
						numero_tareas
						
					}
				)
			}
		} catch (error) {
			if(error=="no_existe"){
				res.json(error)
			}else{
				res.status(204).json(error)
			}
		}		

	})	
	
}
