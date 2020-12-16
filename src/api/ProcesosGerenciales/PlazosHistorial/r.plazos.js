const User = require('./m.plazos');

module.exports = (app) => {
    app.post('/plazos', async (req, res) => {
        try {
            var response = await User.postPlazos(req.body)
            if (response.affectedRows > 0) {
                res.status(200).json({ message: "registro exitoso" })
            }
            else {
                res.status(204).json({ message: "hubo un problema" })
            }
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: err.code })
        }
    })
    app.get('/plazosPadres', async (req, res) => {
        try {
            var data = await User.getPlazosPadres(req.query)
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: err.code })
        }
    })
    app.get('/plazosHijos', async (req, res) => {
        try {
            var data = await User.getPlazosHijos(req.query)
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: err.code })
        }
    })
}