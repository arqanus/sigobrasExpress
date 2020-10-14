const User = require('../models/m.get.interfaz');
function soloLetras(req,res,next){
	var regla = /^[A-Za-z0-9]+$/
	var usuario =  req.body.usuario
	if(usuario.match(regla)&&req.body.password.match(regla)){
		// console.log("usuario",usuario)
		next()
	}else{
		res.status(400).send("caracteres invalidos")
	}
}

module.exports = function(app){
  app.get('/login',soloLetras,async(req,res)=>{		
	  try {
		var data = await User.getId_acceso(req.body)
		res.json(data);
	  } catch (error) {
		res.status(204).json(error);
	  }
  })
  app.post('/getMenu',(req,res)=>{
		if(req.body.id_ficha == null||req.body.id_acceso == null){
			res.json("null");	
		}else{
			User.getMenu(req.body,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
	
			})
		}
	
	
		
	})
	app.post('/getDatosGenerales',async(req,res)=>{
		try {
			var getDatosGenerales = await User.getDatosGenerales(req.body.id_ficha)
			var costo_directo = await User.getCostoDirecto(req.body.id_ficha,true)
			getDatosGenerales.costo_directo = costo_directo
			res.json(getDatosGenerales)
		} catch (error) {
			res.status(204).json(error)
			// res.status(400).json(error)
		}
	})
}