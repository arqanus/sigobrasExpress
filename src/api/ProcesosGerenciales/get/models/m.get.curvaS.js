const pool = require('../../../../db/connection');

module.exports = {
    getAnyosEjecutados(id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT YEAR(avanceactividades.fecha) anyo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND fichas.id_ficha = ? AND estados.codigo != 'A' AND COALESCE(avanceactividades.valor, 0) != 0 GROUP BY YEAR(avanceactividades.fecha) ORDER BY YEAR(avanceactividades.fecha)", [id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    getPeriodosEjecutados(anyo, id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT estados.codigo estado_codigo, MIN(DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d')) fecha_inicial, MIN(DATE_FORMAT(avanceactividades.fecha, '%Y-%m')) anyoMes, MIN(DATE_FORMAT(avanceactividades.fecha, '%m')) mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND fichas.id_ficha = ? AND (YEAR(avanceactividades.fecha) = ? ) AND estados.codigo != 'A' AND COALESCE(avanceactividades.valor, 0) != 0 GROUP BY historialestados.id_historialEstado , DATE_FORMAT(avanceactividades.fecha, '%Y-%b') ORDER BY avanceactividades.fecha", [id_ficha, anyo], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },

    postDataCurvaS(data) {
        return new Promise((resolve, reject) => {
            pool.query("insert into curva_s (fecha_inicial,programado_monto,financiero_monto,ejecutado_monto,observacion,estado_codigo,fichas_id_ficha) values ?", [data], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    getDataCurvaS(id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT curva_s.*, DATE_FORMAT(fecha_inicial, '%Y-%m-%d') fecha_inicial FROM curva_s WHERE fichas_id_ficha = ? ORDER BY fecha_inicial", [id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    getMontoEjecutadoPeriodo(fecha_inicial,fecha_final,id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT SUM(valor) ejecutado_monto FROM (SELECT partidas.id_partida, CAST(SUM(avanceactividades.valor) AS DECIMAL (20 , 10 )) * costo_unitario valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado IS NULL AND componentes.fichas_id_ficha = ? GROUP BY partidas.id_partida) periodo", [fecha_inicial,fecha_final,id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    getRegistrosAnyoCurvaS(fecha_inicial,id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT id FROM curva_s WHERE YEAR(fecha_inicial) = ? AND fichas_id_ficha = ?;", [fecha_inicial,id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    putFinancieroCurvaS(id,financiero_monto) {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE curva_s SET financiero_monto = ? WHERE id = ?", [financiero_monto,id], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    getFechaFinalCurvaS(fecha_inicial) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT DATE_FORMAT(fecha_inicial, '%Y-%m-%d') fecha_final FROM curva_s WHERE curva_s.fecha_inicial > ? LIMIT 1", [fecha_inicial], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    putEjecutadoCurvaS(ejecutado_monto,fecha_inicial) {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE curva_s SET ejecutado_monto = ? WHERE fecha_inicial = ?", [ejecutado_monto,fecha_inicial], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
}
