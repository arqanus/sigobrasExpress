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
                *
            FROM
                plazos_historial
            WHERE
                nivel = 1 AND fichas_id_ficha = ${id_ficha}
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
                *
            FROM
                plazos_historial
            WHERE
                nivel = 2 AND fichas_id_ficha = ${id_ficha}
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



