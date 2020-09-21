const pool = require('../../../../db/connection');  

// let userModel = {}; 
module.exports = {
infobras(id_ficha){ 
    return new Promise((resolve, reject) => { var query = "SELECT DATE_FORMAT (fecha_inicial, '%Y-%M-%d') fecha_inicial, g_tipo_act, fichas.codigo, g_meta, g_snip, tiempo_ejec, g_total_presu, format(SUM(distinct componentes.presupuesto),2) presupuesto_total, FORMAT(SUM(COALESCE(costo_unitario, 0) * COALESCE(avanceactividades.valor, 0)), 2) acumulado_hoy, format(SUM(COALESCE(costo_unitario, 0) * COALESCE(avanceactividades.valor, 0)) / SUM(distinct componentes.presupuesto) * 100,2) porcentaje_acumulado, format(SUM(distinct componentes.presupuesto) - SUM(COALESCE(costo_unitario, 0) * COALESCE(avanceactividades.valor, 0)),2) saldo, format(100 - SUM(COALESCE(costo_unitario, 0) * COALESCE(avanceactividades.valor, 0)) / SUM(distinct componentes.presupuesto) * 100,2) porcentaje_saldo, date_format((max(fecha)), '%W %d-%m-%Y') udm FROM fichas LEFT JOIN componentes ON fichas.id_ficha = componentes.fichas_id_ficha LEFT JOIN partidas ON componentes.id_componente = partidas.componentes_id_componente LEFT JOIN actividades ON partidas.id_partida = actividades.Partidas_id_partida LEFT JOIN avanceactividades ON actividades.id_actividad = avanceactividades.Actividades_id_actividad where id_ficha = ?"
        pool.query(query, [id_ficha], (error, resultado) => { 
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
                                        
            }
        })
    })
}
}

// module.exports = userModel;

