const pool = require('../../db/connection');

module.exports = {
    getCostosIndirectos({id_ficha}) {
        return new Promise((resolve, reject) => {
            pool.query(`
            SELECT 
                *
            FROM
                fichas_costosindirectos
            WHERE
                (fichas_id_ficha =  ${id_ficha} );
            `, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res)
            })
        })
    },
    postCostosIndirectos({nombre,monto_expediente,monto_adicional,id_ficha}) {
        return new Promise((resolve, reject) => {
            pool.query(`
            INSERT INTO 
                fichas_costosindirectos 
                    (nombre, monto_expediente, monto_adicional, fichas_id_ficha) 
            VALUES 
                (\'${nombre}\', ${monto_expediente}, ${monto_adicional}, ${id_ficha});
            `, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res)
            })
        })
    },
    deleteCostoIndirecto({ id }) {
        return new Promise((resolve, reject) => {
            pool.query(`
            DELETE FROM fichas_costosindirectos 
            WHERE 
            id = ${id}
            `, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res)
            })
        })
    },
    putCostoIndirecto({ id,nombre,monto_expediente,monto_adicional }) {
        return new Promise((resolve, reject) => {
            pool.query(`
            UPDATE 
                fichas_costosindirectos 
            SET 
                nombre = \'${nombre}\',
                monto_expediente = ${monto_expediente},
                monto_adicional = ${monto_adicional}
            WHERE 
                id = ${id}
            `, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res)
            })
        })
    },
}