const User = require('./m.ampliacionPresupuesto');

module.exports = function (app) {
    app.get('/ampliacionPresupuestal', async (req, res) => {
        try {
            var response = await User.getAmpliacionPresupuestal(req.query)
            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(400).json('error');
        }
    })
    app.get('/costosIndirectosAdicionales', async (req, res) => {
        try {
            var response = await User.getCostosIndirectosAdicionales(req.query)
            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(400).json('error');
        }
    })
    app.get('/costosDirectosAdicionales', async (req, res) => {
        try {
            var response = await User.getCostosDirectosAdicionales(req.query)
            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(400).json('error');
        }
    })
    app.get('/ejecucionPresupuestal', async (req, res) => {
        try {
            var response = await User.getEjecucionPresupuestal(req.query)
            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(400).json('error');
        }
    })
}