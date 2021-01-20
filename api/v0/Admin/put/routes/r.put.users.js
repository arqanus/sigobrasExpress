const User = require('../models/m.put.users');

module.exports = function(app){
	app.put('/putMenusUsuarios',(req,res)=>{
		req.body = JSON.stringify(req.body)
		User.putMenusUsuarios(req.body,(err,data)=>{
			if(err) {
				res.status(204).json(err)
			}else{
				res.json(data);	
			}		
		})
	})	


	app.put('/putactualizarUsuario',async(req,res)=>{
		try {
			var data=await User.putactualizarUsuario(req.body)
			res.json(data)
		} catch (error) {
			res.status(400).json(error)
		}
	})	

	app.put('/putmenuusuariounico', async (peticion, respuesta) => {

        try {
			peticion.body.menu = JSON.stringify(peticion.body.menu)
                   
            var data = await User.putMenuUsuarioUnico(peticion.body.menu,peticion.body.id_acceso)
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })


}