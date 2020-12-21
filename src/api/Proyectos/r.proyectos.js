const User = require('./m.proyectos');
module.exports = (app) => {
    app.get('/proyectos', async (req, res) => {
        try {
            var data = await User.getProyectos(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    })
    app.get('/proyectoMeta', async (req, res) => {
        try {
            var data = await User.getProyectosMeta(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    })
    app.get('/proyectoUsuario', async (req, res) => {
        try {
            var data = await User.getProyectoUsuario(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    })
    app.get('/proyectoPlanTrabajo', async (req, res) => {
        try {
            var data = await User.getProyectoPlanTrabajo(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    })
    app.get('/proyectoPlanTrabajoRecursos', async (req, res) => {
        try {
            var data = await User.getProyectoPlanTrabajoRecursos(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    })
    app.get('/proyectoPlazos', async (req, res) => {
        try {
            var data = await User.getProyectoPlazos(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    })
}