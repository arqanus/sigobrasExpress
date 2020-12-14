const User = require('./m.notificaciones');
module.exports = (app) => {
    app.get('/FichasNotificaciones', async (req, res) => {
        try {
            var data = await User.getFichasNotificaciones(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code || "error" })
        }
    });
    app.get('/FichasNotificaciones_cantidad', async (req, res) => {
        try {
            var data = await User.getFichasNotificaciones_cantidad(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code || "error" })
        }
    });
    app.put('/FichasNotificaciones', async (req, res) => {
        try {
            var data = await User.putFichasNotificaciones(req.body)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code || "error" })
        }
    });
}
