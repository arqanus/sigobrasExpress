const User = require('../models/m.get.infobras');
module.exports = (app) => {

    app.post('/infobras', async (peticion, respuesta) => {
        try {
            var data = await User.infobras(peticion.body.id_ficha)
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })
}