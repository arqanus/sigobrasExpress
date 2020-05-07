const User = require('../models/m.get.comunicados'); 
module.exports = (app) => {
    app.post('/comunicados', async (peticion, respuesta) => {
        try {
            var data = await User.Comunicados(peticion.body.fecha_inicial, peticion.body.fecha_final, peticion.body.texto_mensaje )
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })

    
}