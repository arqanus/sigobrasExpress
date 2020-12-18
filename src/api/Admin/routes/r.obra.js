const User = require('../models/m.obra');

module.exports = function (app) {
    //gethistorial
    app.put('/fichas', async (req, res) => {
        try {
            var message = ""
            var response = await User.putFichas(req.body)
            if (response.affectedRows>0) {
                message = "Actualizado con exito"
                res.status(200).json({message})
                return 
            }else{
                message = "Hubo un problema"
                res.status(400).json({message})
                return
            }
            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(400).json('error');
        }
    })
    app.post('/estadosObra', async (req, res) => {
        try {
            var data = await User.getEstadosObraToHistorial(req.body)
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: err.code })
        }
    })
    app.post('/historialEstados', async (req, res) => {
        try {
            //Deelete and save
            var response = await User.deleteHistorialEstados(req.body[0].Fichas_id_ficha)
            var dataProcesada = []
            for (let i = 0; i < req.body.length; i++) {
                const item = req.body[i];
                dataProcesada.push(
                    [
                        item.fecha_inicial,
                        item.fecha_final,
                        item.Fichas_id_ficha,
                        item.Estados_id_Estado
                    ]
                )
            }
            var response2 = await User.postHistorialEstados(dataProcesada)
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
    app.get('/historialEstados', async (req, res) => {
        try {
            var data = await User.getDataObraHistorial(req.query)
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: err.code })
        }
    })
}