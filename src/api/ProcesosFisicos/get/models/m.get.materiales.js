const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')

let userModel = {};

//materiales
userModel.getmaterialesResumenChart = (id_ficha, tipo) => {
    return new Promise((resolve, reject) => { 
        pool.query("SELECT recursos.tipo, SUM(cantidad * partidas.metrado) * recursos.precio recurso_parcial, SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio recurso_gasto_parcial, SUM(cantidad * partidas.metrado) * recursos.precio - (SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio) diferencia FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? GROUP BY recursos.tipo", [id_ficha, tipo], (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject("vacio");
            }
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
                        "y": tools.formatoPorcentaje(tipoRecurso.recurso_gasto_parcial)
                    }
                )
                categories.push(tipoRecurso.tipo)
            }
            resolve({
                series,
                categories
            });
            
        });
    })
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
userModel.getmaterialesResumen = (id_ficha, tipo) => {
    return new Promise((resolve, reject) => { 
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT recursos.descripcion, recursos.unidad, SUM(cantidad * partidas.metrado) recurso_cantidad, recursos.precio recurso_precio, SUM(cantidad * partidas.metrado) * recursos.precio recurso_parcial, SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) recurso_gasto_cantidad, SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio recurso_gasto_parcial, SUM(cantidad * partidas.metrado) * recursos.precio - (SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio) diferencia, (SUM(cantidad * partidas.metrado) * recursos.precio - (SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio)) / (SUM(cantidad * partidas.metrado) * recursos.precio) * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? AND recursos.tipo = ? GROUP BY recursos.descripcion", [id_ficha, tipo], (error, res) => {
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
    })
};
userModel.getmaterialescomponentesChart = (id_ficha) => {
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
userModel.getmaterialescomponentesResumen = (id_componente,tipo) => {
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT recursos.descripcion, recursos.unidad, SUM(cantidad * partidas.metrado) recurso_cantidad, recursos.precio recurso_precio, SUM(cantidad * partidas.metrado) * recursos.precio recurso_parcial, SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) recurso_gasto_cantidad, SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio recurso_gasto_parcial, SUM(cantidad * partidas.metrado) * recursos.precio - (SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio) diferencia, (SUM(cantidad * partidas.metrado) * recursos.precio - (SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio)) / (SUM(cantidad * partidas.metrado) * recursos.precio) * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida WHERE componentes.id_componente = ? AND recursos.tipo = ? GROUP BY recursos.descripcion", [id_componente,tipo], (error, res) => {
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
userModel.getmaterialespartidacomponente = (id_componente,id_actividad) => {
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partidas.metrado - COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partidas.metrado * partidas.costo_unitario) - (COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / partidas.metrado * 100 * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad, COALESCE(partidas.metrado / partidas.rendimiento, '') partida_duracion, COALESCE(estado_partida.mayorMetrado, FALSE) mayorMetrado, prioridades.valor prioridad_valor, prioridades.color prioridad_color, iconoscategorias.nombre iconocategoria_nombre FROM partidas LEFT JOIN (SELECT partidas.id_partida, TRUE mayorMetrado FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Mayor Metrado' GROUP BY partidas.id_partida) estado_partida ON estado_partida.id_partida = partidas.id_partida left join iconoscategorias on iconoscategorias.id_iconoCategoria = partidas.iconosCategorias_id_iconoCategoria left join prioridades on prioridades.id_prioridad = partidas.prioridades_id_prioridad left join actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN (SELECT historialpartidas.estado, historialpartidas.partidas_id_partida FROM (SELECT MAX(id_historialPartida) id_historialPartida FROM historialpartidas GROUP BY historialpartidas.partidas_id_partida) maximoHistorial LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida) historialPartida ON historialPartida.partidas_id_partida = partidas.id_partida WHERE historialactividades.estado IS NULL AND (partidas.componentes_id_componente = ? OR partidas.id_partida = (SELECT actividades.Partidas_id_partida FROM actividades WHERE actividades.id_actividad = ? LIMIT 1)) GROUP BY partidas.id_partida", [id_componente,id_actividad], (error, res) => {
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
                if(fila.tipo=="titulo"){
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
                    
                }else{
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
userModel.getmaterialespartidaTiposLista = (id_partida, tipo, callback) => {
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT recursos.descripcion, recursos.unidad, SUM(cantidad * partidas.metrado) recurso_cantidad, recursos.precio recurso_precio, SUM(cantidad * partidas.metrado) * recursos.precio recurso_parcial, SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) recurso_gasto_cantidad, SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio recurso_gasto_parcial, SUM(cantidad * partidas.metrado) * recursos.precio - (SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio) diferencia, (SUM(cantidad * partidas.metrado) * recursos.precio - (SUM(COALESCE(partidas_metrado.avance, 0) * recursos.cantidad) * recursos.precio)) / (SUM(cantidad * partidas.metrado) * recursos.precio) * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida WHERE partidas.id_partida = ? AND recursos.tipo = ? GROUP BY recursos.descripcion", [id_partida, tipo], (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject( "vacio");
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
module.exports = userModel;