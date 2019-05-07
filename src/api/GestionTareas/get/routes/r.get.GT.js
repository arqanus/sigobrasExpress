const User = require('../models/m.get.GT');
function daysdifference(date1, date2) {
	// The number of milliseconds in one day
	var ONEDAY = 1000 * 60 * 60 * 24;
	// Convert both dates to milliseconds
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();
	// Calculate the difference in milliseconds
	var difference_ms = (date1_ms - date2_ms);

	// Convert back to days and return
	return Math.round(difference_ms/ONEDAY);
}

module.exports = function(app){
  	app.get('/getTareaProyectos',async (req,res)=>{
		var proyectos = await User.getTareaProyectos()
		res.json(proyectos)
	})
	app.post('/getTareaCargos',async (req,res)=>{
		try {
			var nivel = await User.getTareaAccesoCargo(req.body.id_acceso)
			nivel = nivel.nivel
			var cargos = await User.getTareaCargos(req.body.id_acceso,nivel)
			res.json(cargos)
		} catch (error) {
			res.status(204).json(error)
		}
	})
	app.post('/getTareaUsuariosPorCargo',async (req,res)=>{		
		var cargos = await User.getTareaUsuariosPorCargo(req.body.id_acceso,req.body.id_Cargo)
		res.json(cargos)
	})
	app.post('/getTareaSubordinados',async (req,res)=>{
		try {
			var nivel = await User.getTareaAccesoCargo(req.body.id_acceso)
			nivel = nivel.nivel
			var subordinados = await User.getTareaSubordinados(req.body.id_acceso,nivel)
			for (let i = 0; i < subordinados.length; i++) {
				const id_acceso = subordinados[i].id_acceso;
				var subordinadosTareas = await User.getTareaSubordinadosTareas(id_acceso)
				subordinados[i].subordinadosTareas = subordinadosTareas
			}
			res.json(subordinados)
		} catch (error) {
			res.status(204).json(error)
		}
	})
	app.post('/getTareasReceptorProyectos',async (req,res)=>{		
		var tareas = await User.getTareasProyectos('receptor',req.body.id_acceso,req.body.inicio,req.body.fin)
		res.json(tareas)
	})
	app.post('/getTareasReceptor',async (req,res)=>{		
		var tareas = await User.getTareas('receptor',req.body.id_acceso,req.body.inicio,req.body.fin,req.body.id_proyecto)
		res.json(tareas)
	})
	app.post('/getTareasEmisor',async (req,res)=>{		
		var tareas = await User.getTareaEmisor('emisor',req.body.id_acceso,req.body.inicio,req.body.fin)
		res.json(tareas)
	})
	app.post('/getTareasReceptorProyectosVencidas',async (req,res)=>{		
		var tareas = await User.getTareasProyectosVencidas('receptor',req.body.id_acceso,req.body.inicio,req.body.fin)
		res.json(tareas)
	})
	app.post('/getTareasReceptorVencidas',async (req,res)=>{		
		var tareas = await User.getTareasVencidas('receptor',req.body.id_acceso,req.body.inicio,req.body.fin,req.body.id_proyecto)
		res.json(tareas)
	})
	app.post('/getTareaEmisorVencidas',async (req,res)=>{		
		var tareas = await User.getTareaEmisorVencidas('emisor',req.body.id_acceso,0,100)
		res.json(tareas)
	})
	app.post('/getTareaIdTarea',async (req,res)=>{				
		var tarea = await User.getTareaIdTarea(req.body.id_tarea)
		var diasTotal  = daysdifference(tarea.fecha_final,tarea.fecha_inicial)
		var diasTranscurridos  = daysdifference(new Date(),tarea.fecha_inicial)
		tarea.diasTotal = diasTotal
		tarea.diasTranscurridos = diasTranscurridos
		res.json(
			tarea
		)
	})
	

}
