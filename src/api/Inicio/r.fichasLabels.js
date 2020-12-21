const User = require('./m.fichasLabels');
module.exports = (app) => {
    app.get('/FichasLabels', async (req, res) => {
        try {
            var data = await User.getFichasLabels(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code })
        }
    });
    app.post('/FichasLabels', async (req, res) => {
        try {
            var data = await User.postFichasLabels(req.body)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code })
        }
    });
    app.get('/FichasAsignarLabels', async (req, res) => {
        try {
            var data = await User.getFichasAsignarLabels(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code })
        }
    });
    app.get('/FichasLabelsAsignadas', async (req, res) => {
        try {
            var data = await User.getFichasLabelsAsignadas(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code })
        }
    });
    app.post('/FichasAsignarLabels', async (req, res) => {
        try {
            var response = await User.getFichasAsignarLabels(req.body)
            console.log("cantidad", response.cantidad);
            if (response.cantidad) {
                console.log("if");
                var response3 = await User.deleteFichasAsignarLabels(req.body)
            } else {
                console.log("else");
                var response2 = await User.postFichasAsignarLabels(req.body)
            }
            res.json({ message: "exito" })
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code })
        }
    });
    app.delete('/FichasAsignarLabels', async (req, res) => {
        try {
            var data = await User.deleteFichasAsignarLabels(req.body)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code })
        }
    });
    app.get('/primerPlazo', async (req, res) => {
        try {
            var data = await User.getPrimerPlazo(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code })
        }
    });
    app.get('/ultimoPlazoAprobado', async (req, res) => {
        try {
            var data = await User.getUltimoPlazoAprobado(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code })
        }
    });
    app.get('/ultimoPlazoSinAprobar', async (req, res) => {
        try {
            var data = await User.getUltimoPlazoSinAprobar(req.query)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error.code })
        }
    });
}
