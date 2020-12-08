const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')

let userModel = {};

//materiales
userModel.getmaterialesResumenConsulta = (consulta, id_ficha, tipo, todosTipos = false, agrupacion = "recursos.descripcion,recursos_ejecucionreal.fichas_id_ficha") => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT COALESCE(recursos_ejecucionreal.codigo, '') recurso_codigo, COALESCE(tipodocumentoadquisicion.id_tipoDocumentoAdquisicion, '') id_tipoDocumentoAdquisicion, COALESCE(tipodocumentoadquisicion.nombre, '') tipodocumentoadquisicion_nombre, recursos.descripcion, recursos.unidad, SUM(IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', 0, recursos.cantidad * partidas.metrado)) recurso_cantidad, IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', 0, recursos.precio) recurso_precio, SUM(IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', REDONDEO(recursos.cantidad * recursos.precio / 100) * partidas.metrado, REDONDEO(recursos.cantidad * recursos.precio) * partidas.metrado)) recurso_parcial, SUM(IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', 0, partidas_metrado.avance * recursos.cantidad)) recurso_gasto_cantidad, IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', 0, recursos.precio) recurso_gasto_precio, SUM(IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', REDONDEO(partidas_metrado.ManoDeObra * recursos.cantidad / 100), REDONDEO(recursos.cantidad * recursos.precio) * partidas_metrado.avance)) recurso_gasto_parcial, SUM(IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', REDONDEO(recursos.cantidad * recursos.precio / 100) * partidas.metrado, REDONDEO(recursos.cantidad * recursos.precio) * partidas.metrado)) - (SUM(IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', REDONDEO(partidas_metrado.ManoDeObra * recursos.cantidad / 100), REDONDEO(recursos.cantidad * recursos.precio) * partidas_metrado.avance))) diferencia, (SUM(IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', REDONDEO(recursos.cantidad * recursos.precio / 100) * partidas.metrado, REDONDEO(recursos.cantidad * recursos.precio) * partidas.metrado)) - (SUM(IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', REDONDEO(partidas_metrado.ManoDeObra * recursos.cantidad / 100), REDONDEO(recursos.cantidad * recursos.precio) * partidas_metrado.avance)))) / (SUM(IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', REDONDEO(recursos.cantidad * recursos.precio / 100) * partidas.metrado, REDONDEO(recursos.cantidad * recursos.precio) * partidas.metrado))) * 100 porcentaje, recursos.tipo FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida LEFT JOIN recursos_ejecucionreal ON recursos_ejecucionreal.descripcion = recursos.descripcion and componentes.fichas_id_ficha = recursos_ejecucionreal.fichas_id_ficha LEFT JOIN tipodocumentoadquisicion ON tipodocumentoadquisicion.id_tipoDocumentoAdquisicion = recursos_ejecucionreal.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion LEFT JOIN (SELECT partidas.id_partida, COALESCE(SUM(recursos.cantidad * partidas_metrado.avance * recursos.precio), 0) ManoDeObra, partidas_metrado.avance FROM partidas LEFT JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida AND recursos.tipo = 'Mano de Obra' LEFT JOIN (SELECT partidas.id_partida, COALESCE(SUM(avanceactividades.valor), 0) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida WHERE " + consulta + " = ? AND  (recursos.tipo = ? or ? ) GROUP BY " + agrupacion, [id_ficha, tipo, todosTipos], (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                resolve("vacio");
            } else {
                resolve(res);
            }
        });
    })
};
userModel.getmaterialesResumenChart = (consulta, id_ficha) => {
    return new Promise(async (resolve, reject) => {
        var res = await userModel.getmaterialesResumenConsulta(consulta, id_ficha, null, true, "recursos.tipo")
        var series = [
            {
                "type": "column",
                "name": "Expediente",
                "data": []
            },
            {
                "type": "column",
                "name": "Acumulado",
                "data": []
            },
            {
                "type": "spline",
                "name": "Diferencia",
                "data": []
            },
            {
                "type": "pie",
                "name": "Segun Expediente",
                "data": [],
                "center": [100, 80],
                "size": 100,
                "showInLegend": false,
                "dataLabels": {
                    "enabled": false
                }
            }
        ]
        var categories = []
        for (let i = 0; i < res.length; i++) {
            const tipoRecurso = res[i];
            series[0].data.push(tools.formatoPorcentaje(tipoRecurso.recurso_parcial))
            series[1].data.push(tools.formatoPorcentaje(tipoRecurso.recurso_gasto_parcial))
            series[2].data.push(tools.formatoPorcentaje(tipoRecurso.diferencia))
            series[3].data.push(
                {
                    "name": tipoRecurso.tipo,
                    "y": tools.formatoPorcentaje(tipoRecurso.recurso_parcial)
                }
            )
            categories.push(tipoRecurso.tipo)
        }
        resolve({
            series,
            categories
        });
    });
};
userModel.getmaterialesResumenTipos = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT recursos.tipo FROM componentes left join partidas on partidas.componentes_id_componente = componentes.id_componente inner join recursos on recursos.Partidas_id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? GROUP BY recursos.tipo", [id_ficha], (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
            else {
                resolve(res);
            }
        });
    })
};
userModel.getmaterialesResumen = (consulta, id_ficha, tipo) => {
    return new Promise(async (resolve, reject) => {
        var res = await userModel.getmaterialesResumenConsulta(consulta, id_ficha, tipo)
        for (let i = 0; i < res.length; i++) {
            const recurso = res[i];
            recurso.recurso_cantidad = tools.formatoSoles(recurso.recurso_cantidad)
            recurso.recurso_precio = tools.formatoSoles(recurso.recurso_precio)
            recurso.recurso_parcial = tools.formatoSoles(recurso.recurso_parcial)
            recurso.recurso_gasto_cantidad = tools.formatoSoles(recurso.recurso_gasto_cantidad)
            recurso.recurso_gasto_parcial = tools.formatoSoles(recurso.recurso_gasto_parcial)
            recurso.diferencia = tools.formatoSoles(recurso.diferencia)
            recurso.porcentaje = tools.formatoSoles(recurso.porcentaje)
        }
        resolve(res)
    });
};
userModel.getmaterialesResumenEjecucionReal = (id_ficha, tipo, todosRecursos = false, codigo = "null", todosCodigos = true, id_tipoDocumentoAdquisicion, todosTipos = true, agrupacion = "recursos.descripcion", formato = true) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT 'oficial' recurso_estado_origen,COALESCE(recursos_ejecucionreal.codigo, '') recurso_codigo, COALESCE(tipodocumentoadquisicion.id_tipoDocumentoAdquisicion, '') id_tipoDocumentoAdquisicion, COALESCE(tipodocumentoadquisicion.nombre, '') tipodocumentoadquisicion_nombre, COALESCE(recursos_ejecucionreal.descripcion_modificada, recursos.descripcion) descripcion, recursos.unidad, SUM(IF(recursos.unidad = '%MO', 0, recursos.cantidad * partidas.metrado)) recurso_cantidad, IF(recursos.unidad = '%MO', 0, recursos.precio) recurso_precio, SUM(IF(recursos.unidad = '%MO', recursos.cantidad * recursos.precio / 100, recursos.cantidad * partidas.metrado * recursos.precio)) recurso_parcial, COALESCE(recursos_ejecucionreal.cantidad, SUM(IF(recursos.unidad = '%MO', 0, COALESCE(partidas_metrado.avance, 0) * recursos.cantidad))) recurso_gasto_cantidad, COALESCE(recursos_ejecucionreal.precio, recursos.precio) recurso_gasto_precio, (COALESCE(recursos_ejecucionreal.cantidad, SUM(IF(recursos.unidad = '%MO', 0, COALESCE(partidas_metrado.avance, 0) * recursos.cantidad)))) * (COALESCE(recursos_ejecucionreal.precio, recursos.precio)) recurso_gasto_parcial, (SUM(IF(recursos.unidad = '%MO', recursos.cantidad * recursos.precio / 100, recursos.cantidad * partidas.metrado * recursos.precio))) - ((COALESCE(recursos_ejecucionreal.cantidad, SUM(IF(recursos.unidad = '%MO', 0, COALESCE(partidas_metrado.avance, 0) * recursos.cantidad)))) * (COALESCE(recursos_ejecucionreal.precio, recursos.precio))) diferencia, ((SUM(IF(recursos.unidad = '%MO', recursos.cantidad * recursos.precio / 100, recursos.cantidad * partidas.metrado * recursos.precio))) - ((COALESCE(recursos_ejecucionreal.cantidad, SUM(IF(recursos.unidad = '%MO', 0, COALESCE(partidas_metrado.avance, 0) * recursos.cantidad)))) * (COALESCE(recursos_ejecucionreal.precio, recursos.precio)))) / (SUM(IF(recursos.unidad = '%MO', recursos.cantidad * recursos.precio / 100, recursos.cantidad * partidas.metrado * recursos.precio))) * 100 porcentaje, recursos.tipo, IF(recursos_ejecucionreal.documentosAdquisicion_id_documentoAdquisicion IS NULL, 0, 1) bloqueado, documentosAdquisicion_id_documentoAdquisicion FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, COALESCE(SUM(recursos.cantidad * partidas_metrado.avance * recursos.precio), 0) ManoDeObra, partidas_metrado.avance FROM partidas LEFT JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida AND recursos.tipo = 'Mano de Obra' LEFT JOIN (SELECT partidas.id_partida, COALESCE(SUM(avanceactividades.valor), 0) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida LEFT JOIN recursos_ejecucionreal ON recursos_ejecucionreal.descripcion = recursos.descripcion AND componentes.fichas_id_ficha = recursos_ejecucionreal.fichas_id_ficha LEFT JOIN tipodocumentoadquisicion ON tipodocumentoadquisicion.id_tipoDocumentoAdquisicion = recursos_ejecucionreal.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion WHERE componentes.fichas_id_ficha = ? AND (recursos.tipo = ? or ?)AND (COALESCE(recursos_ejecucionreal.codigo,'null') = ? or ?) and (tipodocumentoadquisicion.id_tipoDocumentoAdquisicion = ? or ?) GROUP BY " + agrupacion, [id_ficha, tipo, todosRecursos, codigo, todosCodigos, id_tipoDocumentoAdquisicion, todosTipos], (error, res) => {
            if (error) {
                reject(error);
            }
            else {
                if (formato) {
                    for (let i = 0; i < res.length; i++) {
                        const recurso = res[i];
                        recurso.recurso_cantidad = tools.formatoSoles(recurso.recurso_cantidad)
                        recurso.recurso_precio = tools.formatoSoles(recurso.recurso_precio)
                        recurso.recurso_parcial = tools.formatoSoles(recurso.recurso_parcial)
                        recurso.recurso_gasto_cantidad = tools.formatoSoles(recurso.recurso_gasto_cantidad)
                        recurso.recurso_gasto_parcial = tools.formatoSoles(recurso.recurso_gasto_parcial)
                        recurso.diferencia = tools.formatoSoles(recurso.diferencia)
                        recurso.porcentaje = tools.formatoPorcentaje(recurso.porcentaje)
                    }
                }
                resolve(res);
            }
        });
    });
};
userModel.getmaterialesResumenEjecucionRealChart = (id_ficha) => {
    console.log(id_ficha);
    return new Promise(async (resolve, reject) => {
        var res = await userModel.getmaterialesResumenEjecucionReal(id_ficha, "", true, "", true, "", true, "recursos.tipo", false)
        var series = [
            {
                "type": "column",
                "name": "Expediente",
                "data": []
            },
            {
                "type": "column",
                "name": "Acumulado",
                "data": []
            },
            {
                "type": "spline",
                "name": "Diferencia",
                "data": []
            },
            {
                "type": "pie",
                "name": "Segun Expediente",
                "data": [],
                "center": [100, 80],
                "size": 100,
                "showInLegend": false,
                "dataLabels": {
                    "enabled": false
                }
            }
        ]
        var categories = []
        for (let i = 0; i < res.length; i++) {
            const tipoRecurso = res[i];
            series[0].data.push(tools.formatoPorcentaje(tipoRecurso.recurso_parcial))
            series[1].data.push(tools.formatoPorcentaje(tipoRecurso.recurso_gasto_parcial))
            series[2].data.push(tools.formatoPorcentaje(tipoRecurso.diferencia))
            series[3].data.push(
                {
                    "name": tipoRecurso.tipo,
                    "y": tools.formatoPorcentaje(tipoRecurso.recurso_parcial)
                }
            )
            categories.push(tipoRecurso.tipo)
        }
        resolve({
            series,
            categories
        });
    });
};
userModel.getmaterialesResumenEjecucionRealCodigos = (id_ficha, tipoDocumentoAdquisicion) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT codigo, COUNT(descripcion) cantidad,bloqueado FROM (SELECT recursos_ejecucionreal.codigo, recursos_ejecucionreal.descripcion,IF(recursos_ejecucionreal.documentosAdquisicion_id_documentoAdquisicion IS NULL, 0, 1) bloqueado FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida INNER JOIN recursos_ejecucionreal ON recursos_ejecucionreal.descripcion = CONVERT( recursos.descripcion USING UTF8) COLLATE utf8_spanish_ci WHERE recursos_ejecucionreal.fichas_id_ficha = ? AND recursos_ejecucionreal.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion = ? AND recursos_ejecucionreal.codigo IS NOT NULL GROUP BY recursos_ejecucionreal.descripcion) recursos_ejecucionreal GROUP BY codigo", [id_ficha, tipoDocumentoAdquisicion], (error, res) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(res);
            }
        });
    });
};
userModel.gettipodocumentoadquisicion = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from tipodocumentoadquisicion", (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
            else {
                resolve(res)
            }
        });
    });
};
userModel.getclasificadoresPesupuestarios = (todos = true, clasificador = null) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM clasificadores_presupuestarios WHERE ? OR clasificadores_presupuestarios.clasificador = ?", [todos, clasificador], (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
            else {
                resolve(res)
            }
        });
    });
};
userModel.getdocumentosadquisicion = (id_documentoAdquisicion) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT documentosadquisicion.id_documentoAdquisicion, documentosadquisicion.razonSocial, documentosadquisicion.RUC, DATE_FORMAT(documentosadquisicion.fecha,'%Y-%m-%d') fecha, documentosadquisicion.SIAF, documentosadquisicion.NCP, clasificadores_presupuestarios.clasificador FROM documentosadquisicion LEFT JOIN clasificadores_presupuestarios ON clasificadores_presupuestarios.id_clasificador_presupuestario = documentosadquisicion.clasificadores_presupuestarios_id_clasificador_presupuestario WHERE documentosadquisicion.id_documentoAdquisicion = ?", [id_documentoAdquisicion], (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                resolve("vacio");
            }
            else {
                resolve(res[0])
            }
        });
    });
};
userModel.getmaterialescomponentesTipos = (id_componente) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT recursos.tipo FROM componentes left join partidas on partidas.componentes_id_componente = componentes.id_componente inner join recursos on recursos.Partidas_id_partida = partidas.id_partida WHERE componentes.id_componente = ? GROUP BY recursos.tipo", id_componente, (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
            else {
                resolve(res);
            }
        });
    })
};
userModel.getmaterialescomponentes = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("select id_componente,numero,nombre from componentes where componentes.fichas_id_ficha = ?", id_ficha, (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
            else {
                resolve(res);
            }
        });
    })
};
userModel.getmaterialespartidacomponente = (id_componente, id_actividad) => {
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partidas.metrado - COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partidas.metrado * partidas.costo_unitario) - (COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / partidas.metrado * 100 * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad, COALESCE(partidas.metrado / partidas.rendimiento, '') partida_duracion, COALESCE(estado_partida.mayorMetrado, FALSE) mayorMetrado, prioridadesrecursos.valor prioridad_valor, prioridadesrecursos.color prioridad_color, iconoscategoriasrecursos.nombre iconocategoria_nombre FROM partidas LEFT JOIN (SELECT partidas.id_partida, TRUE mayorMetrado FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Mayor Metrado' GROUP BY partidas.id_partida) estado_partida ON estado_partida.id_partida = partidas.id_partida LEFT JOIN iconoscategoriasrecursos ON iconoscategoriasrecursos.id_iconoscategoriasrecurso = partidas.iconoscategoriasrecursos_id_iconoscategoriasrecurso LEFT JOIN prioridadesrecursos ON prioridadesrecursos.id_prioridadesRecurso = partidas.prioridadesRecursos_id_prioridadesRecurso LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0  GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0  GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN (SELECT historialpartidas.estado, historialpartidas.partidas_id_partida FROM (SELECT MAX(id_historialPartida) id_historialPartida FROM historialpartidas GROUP BY historialpartidas.partidas_id_partida) maximoHistorial LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida) historialPartida ON historialPartida.partidas_id_partida = partidas.id_partida WHERE (partidas.componentes_id_componente = ? OR partidas.id_partida = (SELECT actividades.Partidas_id_partida FROM actividades WHERE actividades.id_actividad = ? LIMIT 1)) GROUP BY partidas.id_partida", [id_componente, id_actividad], (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
            for (let i = 0; i < res.length; i++) {
                const fila = res[i];
                // fila.iconocategoria_nombre = "MdMonetizationOn"
                fila.key = i
                if (fila.tipo == "titulo") {
                    fila.unidad_medida = ""
                    fila.metrado = ""
                    fila.costo_unitario = ""
                    fila.parcial = ""
                    fila.avance_metrado = ""
                    fila.avance_costo = ""
                    fila.metrados_saldo = ""
                    fila.metrados_costo_saldo = ""
                    fila.porcentaje = ""
                    fila.porcentaje_negatividad = ""

                } else {
                    fila.metrado = tools.formatoSoles(fila.metrado)
                    fila.costo_unitario = tools.formatoSoles(fila.costo_unitario)
                    fila.parcial = tools.formatoSoles(fila.parcial)
                    fila.avance_metrado = tools.formatoSoles(fila.avance_metrado)
                    fila.avance_costo = tools.formatoSoles(fila.avance_costo)
                    fila.metrados_saldo = tools.formatoSoles(fila.metrados_saldo)
                    fila.metrados_costo_saldo = tools.formatoSoles(fila.metrados_costo_saldo)
                    fila.porcentaje = tools.formatoPorcentaje(fila.porcentaje)
                }
            }
            resolve(res);

        });
    });
};
userModel.getmaterialespartidaTipos = (id_partida) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT recursos.tipo FROM recursos WHERE recursos.Partidas_id_partida = ? GROUP BY recursos.tipo", id_partida, (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
            else {
                resolve(res);
            }
        });
    });
};
userModel.getmaterialespartidaTiposLista = (id_partida, tipo) => {
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT recursos.descripcion, recursos.unidad, cantidad recurso_cantidad, precio recurso_precio,precio recurso_gasto_precio, parcial recurso_parcial, SUM(IF(recursos.unidad = '%MO', 0, partidas_metrado.avance * recursos.cantidad)) recurso_gasto_cantidad, SUM(IF(recursos.unidad = '%MO', partidas_metrado.ManoDeObra * recursos.cantidad / 100, cantidad * partidas_metrado.avance * recursos.precio)) recurso_gasto_parcial, SUM(IF(recursos.unidad = '%MO', cantidad * precio / 100, cantidad * partidas.metrado * recursos.precio)) - (SUM(IF(recursos.unidad = '%MO', partidas_metrado.ManoDeObra * recursos.cantidad / 100, cantidad * partidas_metrado.avance * recursos.precio))) diferencia, (SUM(IF(recursos.unidad = '%MO', cantidad * precio / 100, cantidad * partidas.metrado * recursos.precio)) - (SUM(IF(recursos.unidad = '%MO', partidas_metrado.ManoDeObra * recursos.cantidad / 100, cantidad * partidas_metrado.avance * recursos.precio)))) / (SUM(IF(recursos.unidad = '%MO', cantidad * precio / 100, cantidad * partidas.metrado * recursos.precio))) * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, COALESCE(SUM(recursos.cantidad * partidas_metrado.avance * recursos.precio), 0) ManoDeObra, partidas_metrado.avance FROM partidas LEFT JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida AND recursos.tipo = 'Mano de Obra' LEFT JOIN (SELECT partidas.id_partida, COALESCE(SUM(avanceactividades.valor), 0) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida WHERE partidas.id_partida = ? AND recursos.tipo = ? GROUP BY recursos.descripcion", [id_partida, tipo], (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
            for (let i = 0; i < res.length; i++) {
                const recurso = res[i];
                recurso.recurso_cantidad = tools.formatoSoles(recurso.recurso_cantidad)
                recurso.recurso_precio = tools.formatoSoles(recurso.recurso_precio)
                recurso.recurso_parcial = tools.formatoSoles(recurso.recurso_parcial)
                recurso.recurso_gasto_cantidad = tools.formatoSoles(recurso.recurso_gasto_cantidad)
                recurso.recurso_gasto_parcial = tools.formatoSoles(recurso.recurso_gasto_parcial)
                recurso.diferencia = tools.formatoSoles(recurso.diferencia)
                recurso.porcentaje = tools.formatoSoles(recurso.porcentaje)
            }
            resolve(res);
        });
    });
};
userModel.getmaterialesPrioridadesRecursos = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from prioridadesrecursos", (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
            resolve(res);
        });
    });
};
userModel.getmaterialesiconoscategoriasrecursos = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM iconoscategoriasrecursos", (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
            resolve(res);
        });
    });
};
userModel.getRecursosNuevos = (id_ficha, tipo) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_recursoNuevo,'nuevo' recurso_estado_origen,codigo recurso_codigo, id_tipoDocumentoAdquisicion, nombre tipodocumentoadquisicion_nombre, descripcion, unidad, cantidad recurso_cantidad, precio recurso_precio, cantidad*precio recurso_parcial, '' recurso_gasto_cantidad, '' recurso_gasto_precio, '' recurso_gasto_parcial, '' diferencia, '' porcentaje, tipo, false bloqueado, documentosAdquisicion_id_documentoAdquisicion FROM recursosnuevos LEFT JOIN tipodocumentoadquisicion ON tipodocumentoadquisicion.id_tipoDocumentoAdquisicion = recursosnuevos.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion WHERE recursosnuevos.fichas_id_ficha = ? and tipo = ?", [id_ficha, tipo], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        });
    });
};
userModel.getRecursosNuevosCodigos = (id_ficha, id_tipoDocumentoAdquisicion) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT codigo,count(recursosnuevos.id_recursoNuevo)cantidad,false bloqueado FROM recursosnuevos WHERE recursosnuevos.fichas_id_ficha = ? AND recursosnuevos.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion = ? GROUP BY codigo", [id_ficha, id_tipoDocumentoAdquisicion], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        });
    });
};
userModel.getRecursosNuevosCodigosData = (id_ficha, codigo, id_tipoDocumentoAdquisicion) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT 'nuevo' recurso_estado_origen,codigo recurso_codigo, tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion id_tipoDocumentoAdquisicion, tipodocumentoadquisicion.nombre tipodocumentoadquisicion_nombre, descripcion, unidad, cantidad recurso_gasto_cantidad, precio recurso_gasto_precio, cantidad * precio recurso_gasto_parcial ,documentosAdquisicion_id_documentoAdquisicion,id_recursoNuevo FROM recursosnuevos left join tipodocumentoadquisicion on tipodocumentoadquisicion.id_tipoDocumentoAdquisicion = recursosnuevos.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion WHERE fichas_id_ficha = ? AND codigo = ? AND recursosnuevos.tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion = ?", [id_ficha, codigo, id_tipoDocumentoAdquisicion], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        });
    });
};
userModel.getResumenRecursosConteoDatos = ({ id_ficha, tipo, texto_buscar }) => {
    var query = "SELECT COUNT(*) total FROM (SELECT recursos.* FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida"
    var condiciones = []
    if (id_ficha != 0) {
        condiciones.push(`(componentes.fichas_id_ficha = ${id_ficha})`)
    }
    if (tipo != "") {
        condiciones.push(`(recursos.tipo =  \'${tipo}\')`)
    }
    if (texto_buscar != "") {
        condiciones.push(`(recursos.descripcion like \'%${texto_buscar}%\' || recursos.unidad like \'%${texto_buscar}%\')`)
    }
    if (condiciones.length > 0) {
        query += " WHERE " + condiciones.join(" AND ")
    }
    query += ` GROUP BY recursos.descripcion) temp`
    // return query
    return new Promise((resolve, reject) => {
        pool.query(query, (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res ? res[0] : {});
        });
    });
};
userModel.getResumenRecursos = ({ id_ficha, tipo, texto_buscar, inicio, cantidad_datos }) => {
    var query = "SELECT recursos.*, SUM(IF(recursos.unidad = '%MO' OR recursos.unidad = '%PU', 0, recursos.cantidad * partidas.metrado)) recurso_cantidad FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida"
    var condiciones = []
    if (id_ficha != 0) {
        condiciones.push(`(componentes.fichas_id_ficha = ${id_ficha})`)
    }
    if (tipo != "") {
        condiciones.push(`(recursos.tipo =  \'${tipo}\')`)
    }
    if (texto_buscar != "") {
        condiciones.push(`(recursos.descripcion like \'%${texto_buscar}%\' || recursos.unidad like \'%${texto_buscar}%\')`)
    }
    if (condiciones.length > 0) {
        query += " WHERE " + condiciones.join(" AND ")
    }
    query += ` GROUP BY recursos.descripcion LIMIT ${inicio} , ${cantidad_datos}`
    // return query
    return new Promise((resolve, reject) => {
        pool.query(query, (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res);
        });
    });
};
userModel.getResumenRecursosCantidadByDescripcion = ({ id_ficha, descripcion }) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT SUM(recursos.cantidad * avanceactividades.valor) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE componentes.fichas_id_ficha = ? AND recursos.descripcion = ?", [id_ficha, descripcion], (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res ? res[0] : {});
        });
    });
};
userModel.getResumenRecursosRealesByDescripcion = ({ id_ficha, descripcion }) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM recursos_ejecucionreal WHERE recursos_ejecucionreal.fichas_id_ficha = ? AND recursos_ejecucionreal.descripcion = ?", [id_ficha, descripcion], (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res ? res[0] : {});
        });
    });
};
userModel.getTipoDocumentoAdquisicionTotal = ({ id_ficha, id_tipoDocumentoAdquisicion }) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT COUNT(*) n_elementos FROM recursos_ejecucionreal WHERE recursos_ejecucionreal.fichas_id_ficha = ? AND tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion = ?;", [id_ficha, id_tipoDocumentoAdquisicion], (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res ? res[0] : {});
        });
    });
};
userModel.getRecursosEjecucionRealByTipoDocumentoAdquisicion = ({ id_ficha, id_tipoDocumentoAdquisicion }) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT codigo, COUNT(codigo) n_elementos FROM recursos_ejecucionreal WHERE recursos_ejecucionreal.fichas_id_ficha = ? AND tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion = ? GROUP BY codigo", [id_ficha, id_tipoDocumentoAdquisicion], (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res);
        });
    });
};
userModel.getRecursosEjecucionRealByTipoAndCodigo = ({ id_ficha, id_tipoDocumentoAdquisicion, codigo }) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT recursos.* FROM recursos_ejecucionreal LEFT JOIN recursos ON recursos.descripcion = recursos_ejecucionreal.descripcion AND recursos_ejecucionreal.fichas_id_ficha = ? WHERE recursos_ejecucionreal.fichas_id_ficha = ? AND tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion = ? AND recursos_ejecucionreal.codigo = ? GROUP BY recursos.descripcion", [id_ficha, id_ficha, id_tipoDocumentoAdquisicion, codigo], (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res);
        });
    });
};
userModel.getDocumentoAdquisicionDetalles = ({ id_ficha, id_tipoDocumentoAdquisicion, codigo }) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM documentosadquisicion WHERE fichas_id_ficha = ? AND id_documentoAdquisicion = ? AND codigo = ? ;", [id_ficha, id_tipoDocumentoAdquisicion, codigo], (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res ? res[0] : {});
        });
    });
};
userModel.postDocumentoAdquisicionDetalles = ({ id_tipoDocumentoAdquisicion, fichas_id_ficha, codigo, razonSocial, RUC, SIAF, NCP,id_clasificador_presupuestario }) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO documentosadquisicion (id_tipoDocumentoAdquisicion, fichas_id_ficha, codigo,razonSocial,RUC,SIAF,NCP,id_clasificador_presupuestario) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE key UPDATE razonSocial = VALUES(razonSocial), RUC = VALUES(RUC), SIAF = VALUES(SIAF), NCP = VALUES(NCP), id_clasificador_presupuestario = VALUES(id_clasificador_presupuestario) ", [id_tipoDocumentoAdquisicion, fichas_id_ficha, codigo, razonSocial, RUC, SIAF, NCP,id_clasificador_presupuestario], (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res);
        });
    });
};

module.exports = userModel;