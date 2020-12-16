const pool = require('../../../db/connection');
module.exports = {
    postPlazos(data) {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO plazos_historial SET ?", [data], (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res)
            })
        })
    },
    getPlazosPadres({ id_ficha }) {
        return new Promise((resolve, reject) => {
            pool.query(`
            SELECT 
                plazos_historial.*, plazos_tipo.nombre tipo_nombre
            FROM
                plazos_historial
                    LEFT JOIN
                plazos_tipo ON plazos_tipo.idplazos_tipo = plazos_historial.tipo
            WHERE
                plazos_historial.nivel = 1
                    AND fichas_id_ficha = ${id_ficha}
            `, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res)
            })
        })
    },
    getPlazosHijos({ id_ficha, id_padre }) {
        return new Promise((resolve, reject) => {
            pool.query(`
            SELECT 
                plazos_historial.*, plazos_tipo.nombre tipo_nombre
            FROM
                plazos_historial
                    LEFT JOIN
                plazos_tipo ON plazos_tipo.idplazos_tipo = plazos_historial.tipo
            WHERE
                plazos_historial.nivel = 2
                    AND fichas_id_ficha = ${id_ficha}
                    AND id_padre = ${id_padre}
            `, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res)
            })
        })
    },
};



