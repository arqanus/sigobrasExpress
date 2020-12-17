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
    app.put('/plazos', async (req, res) => {
        try {
            var dataProcesada = [
                req.body.id,
                req.body.tipo,
                req.body.nivel,
                req.body.descripcion,
                req.body.fecha_inicio,
                req.body.fecha_final,
                req.body.documento_resolucion_estado,
                req.body.imagen,
                req.body.observacion,
                req.body.fichas_id_ficha,
                req.body.n_dias,
                req.body.plazo_aprobado
            ]
            console.log(dataProcesada);
            var response = await User.putPlazos([dataProcesada])
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
    app.delete('/plazosPadresAndHijos',async(req,res)=>{
		try {
			var data = await User.deletePlazosPadresAndHijos(req.body)
			res.json(data);
		} catch (error) {
			res.status(400).json(error)
		}
	})
}