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
    putPlazos(data) {
        return new Promise((resolve, reject) => {
            pool.query(`
            INSERT INTO plazos_historial 
            (
                id, 
                tipo, 
                nivel,descripcion, 
                fecha_inicio, 
                fecha_final, 
                documento_resolucion_estado, 
                imagen, 
                observacion, 
                fichas_id_ficha,
                n_dias,
                plazo_aprobado
                ) 
            VALUES 
            ? 
            ON DUPLICATE KEY UPDATE 
            tipo = values(tipo), 
            descripcion = values(descripcion), 
            fecha_inicio = values(fecha_inicio), 
            fecha_final = values(fecha_final), 
            documento_resolucion_estado = values(documento_resolucion_estado), 
            imagen = values(imagen), 
            observacion = values(observacion),
            n_dias = values(n_dias),
            plazo_aprobado = values(plazo_aprobado) 
            `, [data], (err, res) => {
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
                plazos_historial.*, plazos_tipo.nombre tipo_nombre,
                DATE_FORMAT(fecha_inicio,"%Y-%m-%d")fecha_inicio,
                DATE_FORMAT(fecha_final,"%Y-%m-%d")fecha_final
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
                plazos_historial.*, plazos_tipo.nombre tipo_nombre,
                DATE_FORMAT(fecha_inicio,"%Y-%m-%d")fecha_inicio,
                DATE_FORMAT(fecha_final,"%Y-%m-%d")fecha_final
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



