const User = require('../models/m.get.pFisicos');
module.exports = (app) => {
    app.post('/getComponentes', async (req, res) => {
        try {
            if (req.body.id_ficha == null || req.body.id_ficha == "null" || req.body.id_ficha == "") {
                res.json("null");
            } else {
                var componentes = await User.getComponentes(req.body.id_ficha)
                var partidas = await User.getPartidas(componentes[0].id_componente, null)
                componentes[0].partidas = partidas
                res.json(componentes);
            }
        } catch (error) {
            console.log(error)
            res.status(204).json(error)
        }
    })
    app.post('/getPartidas', async (req, res) => {
        try {
            if (req.body.id_componente == null || req.body.id_componente == "null" || req.body.id_componente == "") {
                res.json("null");
            } else {
                var data = await User.getPartidas(req.body.id_componente, null)
                res.json(data)
            }
        } catch (error) {
            console.log(error)
            res.status(204).json(error)
        }
    })
    app.post('/getActividades', async (req, res) => {
        try {
            if (req.body.id_partida == null || req.body.id_partida == "null" || req.body.id_partida == "") {
                res.json("null");
            } else {
                var data = await User.getActividades(req.body.id_partida)
                mayorMetrado = await User.getPartidasMayorMetradoAvance(req.body.id_partida)
                mayorMetrado = mayorMetrado || {}
                res.json(
                    {
                        "mayor_metrado": {
                            "mm_avance_metrado": mayorMetrado.avance_metrado || 0,
                            "mm_avance_costo": mayorMetrado.avance_costo || 0,
                            "mm_metrados_saldo": mayorMetrado.metrados_saldo || 0,
                            "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo || 0,
                            "mm_porcentaje": mayorMetrado.porcentaje || 0
                        },
                        "actividades": data
                    }
                );
            }
        } catch (error) {
            console.log(error)
            res.status(204).json(error)
        }
    })
    app.post('/getComponentesPNuevas', async (req, res) => {
        try {
            if (req.body.id_ficha == null) {
                res.json("null");
            } else {
                var componentes = await User.getComponentesPNuevas(req.body.id_ficha)
                var partidas = await User.getPartidasPNuevas(componentes[0].id_componente)
                componentes[0].partidas = partidas
                res.json(componentes);
            }
        } catch (error) {
            console.log(error)
            res.status(204).json(error)
        }
    })
    app.post('/getPartidasPNuevas', async (req, res) => {
        try {
            var data = await User.getPartidasPNuevas(req.body.id_componente)
            res.json(data)
        } catch (error) {
            console.log(error)
            res.status(204).json(error)
        }
    })
    app.post('/getActividadesPNuevas', async (req, res) => {
        try {
            if (req.body.id_partida == null || req.body.id_partida == "null" || req.body.id_partida == "") {
                res.json("null");
            } else {
                var data = await User.getActividades(req.body.id_partida)
                mayorMetrado = await User.getPartidasMayorMetradoAvance(req.body.id_partida)
                mayorMetrado = mayorMetrado || {}
                res.json(
                    {
                        "mayor_metrado": {
                            "mm_avance_metrado": mayorMetrado.avance_metrado || 0,
                            "mm_avance_costo": mayorMetrado.avance_costo || 0,
                            "mm_metrados_saldo": mayorMetrado.metrados_saldo || 0,
                            "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo || 0,
                            "mm_porcentaje": mayorMetrado.porcentaje || 0
                        },
                        "actividades": data
                    }
                );
            }
        } catch (error) {
            console.log(error)
            res.status(204).json(error)
        }
    })
    app.post('/getActividadesDuracion', async (req, res) => {
        try {
            var data = await User.getActividadesDuracion(req.body.id_ficha)
            res.json(data)
        } catch (error) {
            console.log(error)
            res.status(204).json(error)
        }
    })
    app.get('/getPrioridades', async (req, res) => {
        try {
            var data = await User.getPrioridades()
            res.json(data)
        } catch (error) {
            console.log(error)
            res.status(204).json(error)
        }
    })
    app.get('/getIconoscategorias', async (req, res) => {
        try {
            var data = await User.getIconoscategorias()
            res.json(data)
        } catch (error) {
            console.log(error)
            res.status(204).json(error)
        }
    })
    app.post('/getPartidasObra', async (req, res) => {
        try {
            var data = await User.getPartidas(null, null,req.body.id_ficha)
            res.json(data)
        } catch (error) {
            console.log(error)
            res.status(204).json(error)
        }
    })

}
