const pool = require('../../db/connection');

module.exports = {
    getFinanciero(id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT SUM(financiero_monto) financiero_avance, SUM(financiero_monto)/fichas.g_total_presu * 100 financiero_avance_porcentaje FROM curva_s left join fichas on fichas.id_ficha = curva_s.fichas_id_ficha WHERE curva_s.tipo = 'PERIODO' AND curva_s.fichas_id_ficha = ?", [id_ficha, id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res[0])
            })
        })

    },
}

