const User = require('../models/m.post.obras');
const User2 = require('../../get/models/m.get.obras');

module.exports = (app) => {
    app.post('/postTipoObras', async (req, res) => {
        try {
            var data = await User.postTipoObra(req.body)
            res.json(data)
        } catch (error) {
            res.status(400).json(error)
        }
    })
    app.post('/postEstado', async (req, res) => {
        try {
            var data = await User.postEstado(req.body)
            res.json(data)
        } catch (error) {
            res.status(400).json(error)
        }
    })
    app.post('/postUnidadEjecutora', async (req, res) => {
        try {
            var data = await User.postUnidadEjecutora(req.body)
            res.json(data)
        } catch (error) {
            res.status(400).json(error)
        }
    })
    app.post('/nuevaObra', async (req, res) => {
        try {
            var id_ficha = await User.postFicha(req.body.ficha)
            var plazoEjecucion = {
                "FechaEjecucion": req.body.fecha_final,
                "fichas_id_ficha": id_ficha,
            }
            var id_plazoEjecucion = await User.postPlazoEjecucion(plazoEjecucion)
            var Historial = {
                "Fichas_id_ficha": id_ficha,
                "Estados_id_estado": req.body.id_estado,
                "fecha_inicial": req.body.ficha.fecha_inicial
            }
            var id_historial = await User.postHistorialEstado(Historial)
            for (let i = 0; i < req.body.componentes.length; i++) {
                const componente = req.body.componentes[i];
                componente.push(id_ficha)
            }
            var id_componente = await User.postComponentes(req.body.componentes)
            res.json(id_ficha)
        } catch (error) {
            res.status(400).json(error)
        }
    })
    app.post('/postComponentes', async (req, res) => {
        try {
            var id_componente = await User.postComponentes(req.body)
            var HistorialComponentes = []
            for (let i = 0; i < req.body.length; i++) {
                HistorialComponentes.push(
                    ['Partida Nueva', id_componente++]
                )
            }
            var id_historialComponentes = await User.postHistorialComponentes(HistorialComponentes)
            res.json(id_componente)
        } catch (error) {
            res.status(400).json(error)
        }
    })

    app.post('/nuevasPartidas', async (req, res) => {
        try {
            var estado = req.body.estado
            var id_prioridad = await User2.getPrioridad()
            id_prioridad = id_prioridad.id_prioridad
            var id_iconoCategoria = await User2.getIconocategoria()
            id_iconoCategoria = id_iconoCategoria.id_iconoCategoria
            var id_prioridadesRecurso = await User2.getPrioridadesRecursos()
            id_prioridadesRecurso = id_prioridadesRecurso.id_prioridadesRecurso
            var id_iconoscategoriasrecurso = await User2.getIconocategoriaRecursos()
            id_iconoscategoriasrecurso = id_iconoscategoriasrecurso.id_iconoscategoriasrecurso
            for (let i = 0; i < req.body.partidas.length; i++) {
                const partida = req.body.partidas[i];
                partida.data.prioridades_id_prioridad = id_prioridad
                partida.data.iconosCategorias_id_iconoCategoria = id_iconoCategoria
                partida.data.prioridadesRecursos_id_prioridadesRecurso = id_prioridadesRecurso
                partida.data.iconosCategoriasRecursos_id_iconoscategoriasrecurso = id_iconoscategoriasrecurso
                var id_partida  = await User.postPartida(partida.data)
                if(partida.actividades){
                    for (let i = 0; i < partida.actividades.length; i++) {
                        const actividad = partida.actividades[i];
                        actividad.Partidas_id_partida = id_partida
                        var id_actividad = await User.postActividad(actividad)
                        if (estado != "oficial") {
                            var historialActividad = {
                                estado:'Partida Nueva',
                                actividades_id_actividad:id_actividad
                            }
                            User.posthistorialActividad(historialActividad)
                        }
                    }
                }
                if(partida.recursos){
                    for (let i = 0; i < partida.recursos.length; i++) {
                        const recurso = partida.recursos[i];
                        recurso.Partidas_id_partida = id_partida
                        var id_recurso = await User.postRecurso(recurso)  
                    }
                }
            }
            res.json("exito")
        } catch (error) {
            console.log(error);
            res.status(400).json(error)
        }
    })

    app.post('/postAvanceActividadPorObra', async (req, res) => {
        try {
            var data = await User.postAvanceActividadPorObra(req.body)
            res.json(data)
        } catch (error) {
            res.status(400).json(error)
        }
    })
}
