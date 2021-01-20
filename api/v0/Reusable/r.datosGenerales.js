const User = require('./m.datosGenerales');
module.exports = (app) => {
    app.post('/getDatosGenerales2', async (req, res) => {
        try {
            var getDatosGenerales = await User.getDatosGenerales2(req.body.id_ficha)
            res.json(getDatosGenerales)
        } catch (error) {
            res.status(204).json(error)
        }
    })
    app.post('/getPresupuestoCostoDirecto', async (req, res) => {
        try {
            var data = await User.getPresupuestoCostoDirecto(req.body.id_ficha)
            res.json(data)
        } catch (error) {
            res.status(204).json(error)
        }
    })
    app.post('/getEstadoObra', async (req, res) => {
        try {
            var data = await User.getEstadoObra(req.body.id_ficha)
            res.json(data)
        } catch (error) {
            res.status(204).json(error)
        }
    })
    app.post('/getDatosUsuario', async (req, res) => {
        try {
            var data = await User.getDatosUsuario(req.body.id_acceso)
            res.json(data)
        } catch (error) {
            res.status(204).json(error)
        }
    })
}
