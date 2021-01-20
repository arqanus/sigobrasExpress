const User = require('./m.avances');
const DatosGenerales = require('./m.datosGenerales');
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
    app.post('/getFisico', async (req, res) => {
        try {
            var fisico = await User.getFisico(req.body.id_ficha)
            var costo_directo = await DatosGenerales.getPresupuestoCostoDirecto(req.body.id_ficha)
            res.json({
                fisico_avance: fisico.avance,
                fisico_avance_porcentaje: fisico.avance / costo_directo.monto * 100
            })
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    });
    app.post('/getFisicoComponente', async (req, res) => {
        try {
            var componente_fisico = await User.getFisicoComponente(req.body.id_componente)
            res.json(componente_fisico)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    });
    app.post('/getUltimoEjecutadoCurvaS', async (req, res) => {
        try {
            var data = await User.getUltimoEjecutadoCurvaS(req.body.id_ficha)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    });
    app.post('/getUltimoDiaMetrado', async (req, res) => {
        try {
            var data = await User.getUltimoDiaMetrado(req.body.id_ficha)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    });
}
