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
    app.post('/postUnidadEjecutoras', async (req, res) => {
        try {
            var data = await User.postUnidadEjecutoras(req.body)
            res.json(data)
        } catch (error) {
            res.status(400).json(error)
        }
    })
    app.post('/nuevaObra', async (req, res) => {
        try {
            var plazoEjecucion = req.body.plazoEjecucion
            var Historial = req.body.Historial
            var componentes = req.body.componentes

            delete req.body.plazoEjecucion
            delete req.body.Historial
            delete req.body.componentes

            var id_ficha = await User.postFicha(req.body)

            plazoEjecucion.fichas_id_ficha = id_ficha
            var id_plazoEjecucion = await User.postPlazoEjecucion(plazoEjecucion)

            Historial.Fichas_id_ficha = id_ficha
            var id_historial = await User.postHistorialEstado(Historial)

            for (let i = 0; i < componentes.length; i++) {
                const componente = componentes[i];
                componente.push(id_ficha)
            }
            var id_componente = await User.postComponentes(componentes)

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

    app.post('/nuevasPartidasLento', async (req, res) => {
        try {
            throw "error"
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
                var actividades = null
                if (partida.actividades) {
                    actividades = partida.actividades
                    delete partida.actividades
                }
                var recursos = null
                if (partida.recursos) {
                    recursos = partida.recursos
                    delete partida.recursos
                }

                //se agrega foreing keys de las prioridadeseiconospor defecto
                partida.prioridades_id_prioridad = id_prioridad
                partida.iconosCategorias_id_iconoCategoria = id_iconoCategoria
                partida.prioridadesRecursos_id_prioridadesRecurso = id_prioridadesRecurso
                partida.iconosCategoriasRecursos_id_iconoscategoriasrecurso = id_iconoscategoriasrecurso

                //se ingresa partida
                var id_partida = await User.postPartida(partida)
                // console.log("id_partida",id_partida);

                if (actividades) {
                    for (let i = 0; i < actividades.length; i++) {
                        const actividad = actividades[i];
                        actividad.Partidas_id_partida = id_partida
                        var id_actividad = await User.postActividad(actividad)
                        // console.log("id_actividad",id_actividad);
                        if (estado != "oficial") {
                            var historialActividad = {
                                estado: 'Partida Nueva',
                                actividades_id_actividad: id_actividad
                            }
                            var historialActividad = User.posthistorialActividad(historialActividad)
                        }
                    }
                }
                if (recursos) {
                    for (let i = 0; i < recursos.length; i++) {
                        const recurso = recursos[i];
                        recurso.Partidas_id_partida = id_partida
                        var id_recurso = await User.postRecurso(recurso)
                        // console.log("id_recurso",id_recurso);
                    }
                }
            }
            res.json("exito")
        } catch (error) {
            console.log(error);
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
            var partidas = []
            for (let i = 0; i < req.body.partidas.length; i++) {
                const partida = req.body.partidas[i];
                partidas.push(
                    [
                        partida.tipo,
                        partida.item,
                        partida.descripcion,
                        partida.metrado,
                        partida.unidad_medida,
                        partida.costo_unitario,
                        partida.equipo,
                        partida.rendimiento,
                        partida.componentes_id_componente,
                        id_prioridad,
                        id_iconoCategoria,
                        id_prioridadesRecurso,
                        id_iconoscategoriasrecurso
                    ]
                )
            }
            var id_partida = await User.postPartidas(partidas)
            var actividades = []
            var recursos = []
            console.log("partidas");
            
            for (let i = 0; i < req.body.partidas.length; i++) {
                const partida = req.body.partidas[i];
                if (partida.tipo == "partida") {
                    //actividades
                    for (let j = 0; j < partida.actividades.length; j++) {
                        const actividad = partida.actividades[j];
                        //se revisa si el nombre de la actividad esta vacio
                        if (!actividad.nombre && actividades[actividades.length - 1]) {
                            actividad.nombre = actividades[actividades.length - 1][1]
                        }
                        actividades.push(
                            [
                                actividad.tipo,
                                actividad.nombre,
                                actividad.veces,
                                actividad.largo,
                                actividad.ancho,
                                actividad.alto,
                                actividad.parcial,
                                id_partida
                            ]
                        )
                    }
                    //recursos
                    for (let j = 0; j < partida.recursos.length; j++) {
                        const recurso = partida.recursos[j];
                        // console.log("recurso",recurso);
                        if(recurso.descripcion == " " || recurso.descripcion == "" ||recurso.descripcion == null){
                            console.log("vacio",recurso,);
                        }
                        
                        recursos.push(
                            [
                                recurso.tipo,
                                recurso.codigo,
                                recurso.descripcion,
                                recurso.unidad,
                                recurso.cuadrilla,
                                recurso.cantidad,
                                recurso.precio,
                                recurso.parcial,
                                id_partida
                            ]
                        )
                    }
                }
                id_partida++
            }
            var id_actividad = await User.postActividades(actividades)
            console.log("id_actividad", id_actividad);
            var id_recurso = await User.postRecursos(recursos)
            console.log("id_recurso", id_recurso);
            if (estado != "oficial") {
                var historialActividad = []
                for (let i = 0; i < actividades.length; i++) {
                    historialActividad.push(
                        [
                            'Partida Nueva',
                            id_actividad
                        ]
                    )
                    id_actividad++
                }
                var id_historialActividad = await User.posthistorialActividades(historialActividad)
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
    app.post('/postclasificadoresPresupuestarios', async (req, res) => {
        try {
            var data = await User.postclasificadoresPresupuestarios(req.body)
            res.json(data)
        } catch (error) {
            res.status(400).json(error)
        }
    })
    app.post('/postResolucion', async (req, res) => {
        try {
            var data = await User.postResolucion(req.body)
            res.json(data.insertId)
        } catch (error) {
            res.status(400).json(error)
        }
    })
    app.post('/postCostosPresupuestales', async (req, res) => {
        try {
            var data = await User.postCostosPresupuestales(req.body)
            res.json(data)
        } catch (error) {
            res.status(400).json(error)
        }
    })
    app.post('/postPresupuesto_analitico', async (req, res) => {
        try {
            var data = await User.postResolucion(req.body.resolucion)
            var id_resolucion = data.insertId
            var data = await User.postCostosPresupuestales(req.body.costosPresupuestales)
            var costosPresupuestales  = await User2.getCostosPresupuestales(req.body.resolucion.fichas_id_ficha)
            var presupuesto_analitico_preparado  = req.body.presupuesto_analitico_preparado
            //remplazando foreink key de costosPresupuestales
            for (let i = 0; i < presupuesto_analitico_preparado.length; i++) {
                const analitico = presupuesto_analitico_preparado[i];
                var index_analitico = costosPresupuestales.findIndex(x => x.nombre == analitico[0])
                console.log(analitico[0],index_analitico,costosPresupuestales[index_analitico]);
                
                    var costoPresupuestal = costosPresupuestales[index_analitico].id_costoPresupuestal
                analitico[0] = costoPresupuestal
                analitico.unshift(id_resolucion)
            }
            var data  = await User.postPresupuestoAnalitico(presupuesto_analitico_preparado)
            res.json(data)
        } catch (error) {
            console.log(error);            
            res.status(400).json(error)
        }
    })
}
