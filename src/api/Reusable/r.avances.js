const User = require('./m.avances');
module.exports = (app) => {
    app.post('/getFinanciero', async (req, res) => {
        try {
            var data = await User.getFinanciero(req.body.id_ficha)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    });
}
