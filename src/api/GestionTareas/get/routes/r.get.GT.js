const User = require('../models/m.get.GT');
function daysdifference(date1, date2) {
	// The number of milliseconds in one day
	var ONEDAY = 1000 * 60 * 60 * 24;
	// Convert both dates to milliseconds
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();
	// Calculate the difference in milliseconds
	var difference_ms = Math.abs(date1_ms - date2_ms);

	// Convert back to days and return
	return Math.round(difference_ms/ONEDAY);
}

module.exports = function(app){
  	app.get('/getTareaProyectos',async (req,res)=>{
		var proyectos = await User.getTareaProyectos()
		res.json(proyectos)
	})
	app.get('/getTareaCargos',async (req,res)=>{
		var nivel = await User.getTareaAccesoCargo(req.body.id_acceso)
		nivel = nivel.nivel
		console.log("nivel",nivel);		
		var cargos = await User.getTareaCargos(req.body.id_acceso,nivel)
		res.json(cargos)

	})
	app.get('/getTareaUsuariosPorCargo',async (req,res)=>{		
		var cargos = await User.getTareaUsuariosPorCargo(req.body.id_acceso,req.body.id_Cargo)
		res.json(cargos)
	})
	app.get('/getTareaReceptorPendientes',async (req,res)=>{		
		var tareas = await User.getTareaReceptor(req.body.id_acceso,0,0)
		res.json(tareas)
	})
	app.get('/getTareaReceptorProgreso',async (req,res)=>{		
		var tareas = await User.getTareaReceptor(req.body.id_acceso,1,99)
		res.json(tareas)
	})
	app.get('/getTareaReceptorTerminadas',async (req,res)=>{		
		var tareas = await User.getTareaReceptor(req.body.id_acceso,100,100)
		res.json(tareas)
	})
	app.get('/getTareaIdTarea',async (req,res)=>{				
		var tareas = await User.getTareaIdTarea(req.body.id_tarea,100,100)
		var diasTotal  = daysdifference(tareas.fecha_inicial,tareas.fecha_final)
		var diasTranscurridos  = daysdifference(tareas.fecha_inicial,new Date())
		var descripcion = tareas.descripcion
	
		res.json(
			{
				descripcion,
				diasTotal,
				diasTranscurridos
			}
		)
	})
}
