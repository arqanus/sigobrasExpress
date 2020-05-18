const User = require('../models/m.get.comunicados'); 
module.exports = (app) => {
    app.post('/comunicados', async (peticion, respuesta) => {
        try {
            var comunicadoRespuesta = await User.Comunicados(peticion.body.fecha_inicial, peticion.body.fecha_final, peticion.body.texto_mensaje )
            
            var idComunicado = comunicadoRespuesta.insertId
            var idFichas = peticion.body.id_fichas
            for (let i = 0; i < idFichas.length; i++) {
                idFichas [i].push(idComunicado)
            }
            var data = await User.comunicadoFichas(idFichas)


            respuesta.json("Éxito!")
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })



    app.post('/comunicadosInicio', async (peticion, respuesta) => {
        try {
                   
            var data = await User.comunicadoInicio(peticion.body.id_ficha)
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })



    app.post('/obrasListaUser', async (peticion, respuesta) => {
        try {
                   
            var data = await User.obrasListaUser(peticion.body.id_acceso)
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })

    app.post('/listaComunicados', async (peticion, respuesta) => {
        try {
                   
            var data = await User.listaComunicados(peticion.body.id_acceso)
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })

    app.post('/eliminarcomunicado', async (peticion, respuesta) => {
        try {
                   
            var data = await User.eliminarComunicados(peticion.body.idcomunicados)
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })


    
}