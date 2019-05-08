const User = require('../models/m.post.GT');
const User2 = require('../../get/models/m.get.GT')

var formidable = require('formidable');    
var fs = require('fs');

function datetime(){
	var today = new Date();
	var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
	var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
	return date+'_'+time;
}

module.exports = (app)=>{
	app.post('/postProyecto',async(req,res)=>{
		try {
			var id_proyecto = await User.postProyecto(req.body)
			var proyecto = await User2.getTareaProyecto(id_proyecto)
			res.json(proyecto)
		} catch (error) {
			res.status(204).json(proyecto)
		}
		
	})
	app.post('/postTarea', (req, res)=>{
		try {
			//ruta de la carpeta public de imagenes
			var dir = __dirname+'/../../../../public/'
			//crear ruta si no existe
			if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
			}
			
			var form = new formidable.IncomingForm();
			//se configura la ruta de guardar
			form.uploadDir = dir;
			
			form.parse(req, async(err, fields, files) =>{
				try {
					console.log("asunto :",fields.asunto)
					console.log("descripcion :",fields.descripcion)
					console.log("fecha_inicial :",fields.fecha_inicial)
					console.log("fecha_final :",fields.fecha_final)
					console.log("proyectos_id_proyecto :",fields.proyectos_id_proyecto)
					console.log("emisor :",fields.emisor)
					var receptor = []
					if(fields.receptor){
						receptor = fields.receptor.split(",")
					}
					console.log("receptor :",fields.receptor)
					console.log("extension :",fields.extension)
					console.log("codigo_obra :",fields.codigo_obra)
					console.log("tareas_id_tarea :",fields.tareas_id_tarea)
					if (err){
						res.json(err)
					}
					//folder de la obra
					var obraFolder = dir+fields.codigo_obra
					
					if (!fs.existsSync(obraFolder)){
						fs.mkdirSync(obraFolder);
					}  // TODO: make sure my_file and project_id exist  

					obraFolder = dir+fields.codigo_obra+"/tareas"
					
					if (!fs.existsSync(obraFolder)){
						fs.mkdirSync(obraFolder);
					}  // TODO: make sure my_file and project_id exist  
					
					var ruta = "/"+fields.emisor+"_"+datetime()+fields.extension
					//files foto
					if(files.archivo){
						fs.rename(files.archivo.path,obraFolder+ruta,async(err)=>{
							try {
								if (err){
								res.json(err)
								}
								var tarea = {		
									"asunto":fields.asunto,
									"descripcion":fields.descripcion,
									"fecha_inicial":fields.fecha_inicial,
									"fecha_final":fields.fecha_final,
									"proyectos_id_proyecto":fields.proyectos_id_proyecto,
									"emisor":fields.emisor,
									"tareas_id_tarea":fields.tareas_id_tarea||null,
									"archivo":fields.codigo_obra+"/tareas"+ruta
								}
								var id_tarea = await User.postTarea(tarea)
								var receptores = []
								for (let i = 0; i < receptor.length; i++) {
									const element = receptor[i];
									receptores.push(
										[id_tarea,Number(element)]
									)
								}
								if(receptor.length){
									var affectedRows = await User.postTareaReceptores(receptores)
								}
								var tarea = await User2.getTareaIdTarea(id_tarea)
								res.json(
									{
										"id_tarea": tarea.id_tarea,
										"proyecto_nombre": tarea.proyecto_nombre,
										"asunto": tarea.asunto,
										"porcentaje_avance": tarea.porcentaje_avance
									}
								)
							} catch (error) {
								res.status(400).json(error)
							}
						}); 
					}else{
						var tarea = {		
							"asunto":fields.asunto,
							"descripcion":fields.descripcion,
							"fecha_inicial":fields.fecha_inicial,
							"fecha_final":fields.fecha_final,
							"proyectos_id_proyecto":fields.proyectos_id_proyecto,
							"emisor":fields.emisor,
							"tareas_id_tarea":fields.tareas_id_tarea||null
						}
						var id_tarea = await User.postTarea(tarea)
						var receptores = []
						for (let i = 0; i < receptor.length; i++) {
							const element = receptor[i];
							receptores.push(
								[id_tarea,Number(element)]
							)
						}
						if(receptor.length){
							var affectedRows = await User.postTareaReceptores(receptores)
						}
						var tarea = await User2.getTareaIdTarea(id_tarea)
						res.json(
							{
								"id_tarea": tarea.id_tarea,
								"proyecto_nombre": tarea.proyecto_nombre,
								"asunto": tarea.asunto,
								"porcentaje_avance": tarea.porcentaje_avance
							}
						)
					}
				} catch (error) {
					res.status(400).json(error)
				}
				
			});
		} catch (error) {
			res.json(error)
		}
		
	})
	app.post('/postTareaAvance',async (req,res)=>{
		var Ncambios  = await User.postTareaAvance(req.body.avance,req.body.id_tarea)
		if(Ncambios == 0){
			res.json("NO SE REALIZARON CAMBIOS")
		}else{
			var tarea = await User2.getTareaIdTarea(req.body.id_tarea)
			var avance = tarea.avance
			var estadoTarea = ""
			if(avance == 0){
				estadoTarea = "pendiente"
			}else if(0 < avance && avance < 100 ){
				estadoTarea = "progreso"
			}else if(avance > 100 ){
				estadoTarea = "terminado"
			}
			res.json(
				{
					avance,estadoTarea
				}
			)
		}
	})
	app.post('/postTareaReceptores',async(req,res)=>{
		try {
			var affectedRows = await User.postTareaReceptores(req.body)
			var id_acceso = req.body[0][1]
			var subordinadosTareas = await User2.getTareaSubordinadosTareas(id_acceso)
			res.json(subordinadosTareas)			
		} catch (error) {
			res.status(200).json(error)
		}
	})
}
