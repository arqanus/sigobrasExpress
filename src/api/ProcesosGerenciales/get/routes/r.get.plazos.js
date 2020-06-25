const User = require('../models/m.get.plazos');

module.exports = (app) => {
    app.post('/getPlazos', async (req, res) => {
        try {
            var data = await User.getPlazos(req.body.id_ficha)
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(204).json(err)
        }
    })
    app.post('/putPlazos', async (req, res) => {
        try {
            for (let i = 0; i < req.body.length; i++) {
                const padre = req.body[i];
                const hijos = padre[padre.length-1]
                padre.pop()
                // console.log("padre a",padre);
                // console.log("hijos a",hijos);
                var padre_res = await User.putPlazos([padre])
                for (let j = 0; j < hijos.length; j++) {
                    const hijo = hijos[j];
                    hijo.push(padre_res.insertId)
                }
                // console.log("hijos d",hijos);
                var hijos_res = await User.putPlazos(hijos)
            }
            res.json("exito")
        } catch (err) {
            console.log(err);
            res.status(204).json(err)
        }
    })
    app.post('/deletePlazos', async (req, res) => {
        try {
            var data = await User.deletePlazos(req.body.idplazos_historial)
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(204).json(err)
        }
    })
}