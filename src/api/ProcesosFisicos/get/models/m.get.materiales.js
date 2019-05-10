const pool = require('../../../../db/connection');
let userModel = {};

//materiales
userModel.getmaterialesResumen = (id_ficha, tipo) => {
    return new Promise((resolve, reject) => { 
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT recursos.descripcion, recursos.unidad, SUM(cantidad) recurso_cantidad, recursos.precio recurso_precio, SUM(recursos.parcial) recurso_parcial, SUM(COALESCE(partidas_metrado.metrado, 0)  * recursos.cantidad) recurso_gasto_cantidad, SUM(COALESCE(partidas_metrado.metrado, 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * recursos.parcial) recurso_gasto_parcial, 0 diferencia, 0 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida INNER JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? AND recursos.tipo = ? GROUP BY recursos.descripcion ", [id_ficha, tipo], (error, res) => {
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
userModel.getmaterialespartidacomponente = (id_componente) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_partida, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, metrado * costo_unitario precio_parcial, partidas.tipo, prioridades.valor prioridad_valor, prioridades.color prioridad_color, iconoscategorias.nombre iconocategoria_nombre FROM partidas LEFT JOIN prioridades ON prioridades.id_prioridad = partidas.prioridades_id_prioridad LEFT JOIN iconoscategorias ON iconoscategorias.id_iconoCategoria = partidas.iconosCategorias_id_iconoCategoria WHERE partidas.componentes_id_componente = ?", id_componente, (error, res) => {
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
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT recursos.descripcion, recursos.unidad, SUM(cantidad) recurso_cantidad, recursos.precio recurso_precio, SUM(recursos.parcial) recurso_parcial, SUM(COALESCE(partidas_metrado.metrado, 0) * recursos.cantidad) recurso_gasto_cantidad, SUM(COALESCE(partidas_metrado.metrado, 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * recursos.parcial) recurso_gasto_parcial, 0 diferencia, 0 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL GROUP BY partidas.id_partida) partidas_metrado ON partidas_metrado.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida INNER JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida WHERE recursos.Partidas_id_partida = ? AND recursos.tipo = ? GROUP BY partidas.id_partida", [id_partida, tipo], (error, res) => {
            if (error) {
                reject(error);
            }
            else if (res.length == 0) {
                reject( "vacio");
            }
            else {
                resolve( res);
            }
        });
    });
};
module.exports = userModel;