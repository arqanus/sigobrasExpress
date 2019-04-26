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
	app.post('/postProyecto',(req,res)=>{
		User.postProyecto(req.body,(err,data)=>{
			if(err) {
				res.status(204).json(err)
			}else{
				res.json(data);
			}		
		})
	})
	app.post('/postTarea', (req, res)=>{    
       
    
 
		//ruta de la carpeta public de imagenes
		var dir = __dirname+'/../../../../public/'
		//crear ruta si no existe
		if (!fs.existsSync(dir)){
		  fs.mkdirSync(dir);
		}
		  
		var form = new formidable.IncomingForm();
		//se configura la ruta de guardar
		form.uploadDir = dir;
		  
		form.parse(req, (err, fields, files) =>{
		  console.log("asunto :",fields.asunto)
		  console.log("descripcion :",fields.descripcion)
		  console.log("fecha_inicial :",fields.fecha_inicial)
		  console.log("fecha_final :",fields.fecha_final)
		  console.log("fecha_final :",fields.fecha_final)
		  console.log("proyectos_id_proyecto :",fields.proyectos_id_proyecto)
		  console.log("emisor :",fields.emisor)
		  console.log("receptor :",fields.receptor)
		  console.log("extension :",fields.extension)
		  console.log("codigo_obra :",fields.codigo_obra)
	
	
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
		  
		  var ruta = "/"+fields.receptor+"_"+fields.emisor+"_"+datetime()+fields.extension
		  //files foto
		  if(files.archivo){
			fs.rename(files.archivo.path,obraFolder+ruta,(err)=>{
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
				"receptor":fields.receptor,
				"archivo":"/static/"+fields.codigo_obra+"/tareas"+ruta
			  }
			  User.postTarea(tarea,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
				  res.json("exito")              
				}
			  })
			}); 
		  }else{
			var tarea = {		
				"asunto":fields.asunto,
				"descripcion":fields.descripcion,
				"fecha_inicial":fields.fecha_inicial,
				"fecha_final":fields.fecha_final,
				"proyectos_id_proyecto":fields.proyectos_id_proyecto,
				"emisor":fields.emisor,
				"receptor":fields.receptor
			}
			User.postTarea(tarea,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json("exito")              
				}
			})
		  }
				
		});
	})
	app.post('/postTareaAvance',async (req,res)=>{
		var Ncambios  = await User.postTareaAvance(req.body.avance,req.body.id_tarea)
		if(Ncambios == 0){
			res.json("NO SE REALIZARON CAMBIOS")
		}else{
			var avance = await User2.getTareaIdTarea(req.body.id_tarea)
			var estadoTarea = ""
			avance = avance.avance

			if(avance == 0){
				estadoTarea = "pendiente"
			}else if(0 < avance && avance < 100 ){
				estadoTarea = "progreso"
			}else if(avance == 100 ){
				estadoTarea = "terminado"
			}
			res.json(
				{
					avance,
					estadoTarea
				}
			)
		}
	})

	
}
