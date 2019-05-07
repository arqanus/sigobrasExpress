const User = require('../models/m.post.users');
var formidable = require('formidable');    
var fs = require('fs');

module.exports = function(app){
	app.post('/nuevoUsuario',(req,res)=>{
		User.postUsuario(req.body,(err,data)=>{
			if(err) {
				res.status(204).json(err)
			}else{
				res.json(data);	
			}		
		})

	})
	app.post('/nuevoCargo',(req,res)=>{
		
		User.postCargo(req.body,(err,data)=>{
			if(err) {
				res.status(204).json(err)
			}else{
				res.json(data);	
			}
			//deshabilitamos los demas cargos
			// --------------------------------
			
		})

	})
	app.post('/nuevoAcceso',(req,res)=>{	
		User.postAcceso(req.body,(err,data)=>{
			if(err) {
				res.status(204).json(err);
			}else{
				res.json(data);	
			}
				
			
		})

	})
	app.post('/postMenu',(req,res)=>{
		// req.body =JSON.stringify(req.body)
		
		// console.log("iniciand",req.body);
		// res.json(req.body)	
		
			User.postMenu(req.body,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}

			})
	})
	//asignar obra
	app.post('/asignarObra',(req,res)=>{
		var id_usuario = req.body.id_usuario;
		var id_ficha = req.body.id_ficha;
		// delete req.body["cargo_id_cargo"];
		
		User.getIdAcceso(id_usuario,(err,data)=>{
			if(err) res.status(204).json(err);
			// console.log("data",data);
			var obrausuario = {
				"Fichas_id_ficha":id_ficha,
				"Accesos_id_acceso":data[0].id_acceso
			}
			// console.log("data",obrausuario);
			User.postObraUsuario(obrausuario,(err2,data2)=>{
				if(err2) res.json(err2);
				res.json(data2);
			})
			
			
		})

	})	
	app.post('/postUserImageDefault', async (req, res)=>{    
		//ruta de la carpeta public de imagenes
		var folder = "Sistema/"
		var archivo_name = "user_image_default.jpg"
		var dir = __dirname+'/../../../../public/'+folder
		//crear ruta si no existe
		if (!fs.existsSync(dir)){
		  fs.mkdirSync(dir);
		}
		var form = new formidable.IncomingForm();
		//se configura la ruta de guardar
		form.uploadDir = dir;
		var formFiles = await new Promise((resolve, reject)=>{
			form.parse(req, (err, fields, files)=>{
				if (err) {
					return reject(err);
				}
				return resolve(files);
			});
		});
		//se renombre el archivo
		fs.rename(formFiles.User_imagen.path,dir+archivo_name,(err)=>{})
		res.json("/static/"+folder+archivo_name)
	})
	
}
