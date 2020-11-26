const pool = require('../../db/connection');

module.exports = {
    getFinanciero(id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT SUM(financiero_monto) financiero_avance, SUM(financiero_monto)/fichas.g_total_presu * 100 financiero_avance_porcentaje FROM curva_s left join fichas on fichas.id_ficha = curva_s.fichas_id_ficha WHERE curva_s.tipo = 'PERIODO' AND curva_s.fichas_id_ficha = ?", [id_ficha, id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res?res[0]:{})
            })
        })

    },
    getFisico(id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT SUM(avanceactividades.valor * partidas.costo_unitario) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND componentes.fichas_id_ficha = ?", [id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res ? res[0] : {})
            })
        })

    },
    getFisicoComponente(id_componente) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT SUM(avanceactividades.valor * partidas.costo_unitario) avance FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND partidas.componentes_id_componente = ?", [id_componente], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res ? res[0] : {})
            })
        })

    },
    getUltimoEjecutadoCurvaS(id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT curva_s.*, MONTH(fecha_inicial) mes FROM curva_s WHERE fichas_id_ficha = ? AND tipo = 'PERIODO' AND ejecutado_monto != 0 ORDER BY fecha_inicial DESC LIMIT 1;", [id_ficha, id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res ? res[0] : {})
            })
        })

    },
    getUltimoDiaMetrado(id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT DATE_FORMAT(MAX(avanceactividades.fecha), '%Y-%m-%d') fecha FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND componentes.fichas_id_ficha = ?", [id_ficha, id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res ? res[0] : {})
            })
        })

    },
}

