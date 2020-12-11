const pool = require('../../../db/connection');
module.exports = {
    postgestiondocumentaria_mensajes(data) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO gestiondocumentaria_mensajes set ?`, data, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            })
        })
    },
    postgestiondocumentaria_mensajes_archivoAdjunto(data) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO gestiondocumentaria_archivosadjuntos set ?`, data, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            })
        })
    },
    postgestiondocumentaria_receptores(data) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO gestiondocumentaria_receptores(gestiondocumentaria_mensajes_id, receptor_id) VALUES ?`, [data], (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            })
        })
    },
    getgestiondocumentaria_enviados({ id_acceso }) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT 
            gestiondocumentaria_mensajes.*,
            gestiondocumentaria_archivosadjuntos.documento_link,
            DATE_FORMAT(fecha_registro,"%Y-%m-%d") fecha
        FROM
            accesos
                INNER JOIN
            gestiondocumentaria_mensajes ON gestiondocumentaria_mensajes.emisor_id = accesos.id_acceso
                LEFT JOIN
            gestiondocumentaria_archivosadjuntos ON gestiondocumentaria_archivosadjuntos.gestiondocumentaria_mensajes_id = gestiondocumentaria_mensajes.id
        WHERE
            accesos.id_acceso =  ${id_acceso}
            order by fecha_registro desc
            `, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            })
        })
    },
    getgestiondocumentaria_enviados_usuarios({ id }) {
        return new Promise((resolve, reject) => {
            pool.query(`
        SELECT
            fichas_has_accesos.id, 
            fichas.codigo,
            cargos.nombre cargo_nombre,
            CONCAT(usuarios.apellido_paterno,
                    ' ',
                    usuarios.apellido_materno,
                    ' ',
                    usuarios.nombre) usuario_nombre,
            gestiondocumentaria_receptores.mensaje_visto
        FROM
            gestiondocumentaria_mensajes
                LEFT JOIN
            gestiondocumentaria_receptores ON gestiondocumentaria_receptores.gestiondocumentaria_mensajes_id = gestiondocumentaria_mensajes.id
                LEFT JOIN
            fichas_has_accesos ON fichas_has_accesos.id = gestiondocumentaria_receptores.receptor_id
                LEFT JOIN
            fichas ON fichas.id_ficha = fichas_has_accesos.Fichas_id_ficha
                LEFT JOIN
            accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
                LEFT JOIN
            usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario
                LEFT JOIN
            cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo
        WHERE
            gestiondocumentaria_mensajes.id = ${id}`, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            })
        })
    },
    getgestiondocumentaria_receptores_mensaje_visto({ id_ficha, id_acceso, gestiondocumentaria_mensajes_id }) {
        return new Promise((resolve, reject) => {
            pool.query(`
            SELECT 
                gestiondocumentaria_receptores.mensaje_visto
            FROM
                gestiondocumentaria_receptores
                    LEFT JOIN
                fichas_has_accesos ON fichas_has_accesos.id = gestiondocumentaria_receptores.receptor_id
            WHERE
                Fichas_id_ficha = ${id_ficha}
                    AND Accesos_id_acceso = ${id_acceso}
                    and gestiondocumentaria_mensajes_id = ${gestiondocumentaria_mensajes_id} `,
                (err, res) => {
                    if (err) {
                        return reject(err)
                    }
                    return resolve(res ? res[0] : {})
                })
        })
    },
    putgestiondocumentaria_receptores({ id_ficha, id_acceso, gestiondocumentaria_mensajes_id }) {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE gestiondocumentaria_receptores
                LEFT JOIN
            fichas_has_accesos ON fichas_has_accesos.id = gestiondocumentaria_receptores.receptor_id 
            SET 
                gestiondocumentaria_receptores.mensaje_visto = TRUE
            WHERE
                Fichas_id_ficha = ${id_ficha}
                    AND Accesos_id_acceso = ${id_acceso}
                    AND gestiondocumentaria_mensajes_id = ${gestiondocumentaria_mensajes_id} `,
                (err, res) => {
                    if (err) {
                        return reject(err)
                    }
                    return resolve(res)
                })
        })
    },
    getgestiondocumentaria_recibidos({ id_acceso, id_ficha }) {
        return new Promise((resolve, reject) => {
            pool.query(`
            SELECT 
                gestiondocumentaria_mensajes.*,
                gestiondocumentaria_archivosadjuntos.documento_link,
                DATE_FORMAT(fecha_registro, '%Y-%m-%d') fecha,
                gestiondocumentaria_archivosadjuntos.gestiondocumentaria_archivosadjuntos_tipos_id archivoAdjunto_id,
                gestiondocumentaria_archivosadjuntos_tipos.tipo archivoAdjunto_tipo,
                cargos.nombre emisor_cargo,
                CONCAT(usuarios.apellido_paterno,
                                ' ',
                                usuarios.apellido_materno,
                                ' ',
                                usuarios.nombre) emisor_nombre
            FROM
                fichas_has_accesos
                    INNER JOIN
                gestiondocumentaria_receptores ON gestiondocumentaria_receptores.receptor_id = fichas_has_accesos.id
                    LEFT JOIN
                gestiondocumentaria_mensajes ON gestiondocumentaria_mensajes.id = gestiondocumentaria_receptores.gestiondocumentaria_mensajes_id
                    LEFT JOIN
                gestiondocumentaria_archivosadjuntos ON gestiondocumentaria_archivosadjuntos.gestiondocumentaria_mensajes_id = gestiondocumentaria_mensajes.id
                    LEFT JOIN
                gestiondocumentaria_archivosadjuntos_tipos ON gestiondocumentaria_archivosadjuntos_tipos.id = gestiondocumentaria_archivosadjuntos.gestiondocumentaria_archivosadjuntos_tipos_id
                    LEFT JOIN
                accesos ON accesos.id_acceso = gestiondocumentaria_mensajes.emisor_id
                    LEFT JOIN
                usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario
                    LEFT JOIN
                cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo
            WHERE
             fichas_has_accesos.Accesos_id_acceso = ${id_acceso}
                 AND fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
                 order by fecha_registro desc
                 `, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            })
        })
    },
    getgestiondocumentaria_recibidos_respuestas({ id_acceso, emisor_id, mensaje_id }) {
        return new Promise((resolve, reject) => {
            pool.query(`
            SELECT 
            gestiondocumentaria_respuestas.*,
            gestiondocumentaria_archivosadjuntos.*,
            DATE_FORMAT(fecha_registro, '%Y-%m-%d') fecha
            FROM
                gestiondocumentaria_respuestas
                    LEFT JOIN
                gestiondocumentaria_archivosadjuntos ON gestiondocumentaria_archivosadjuntos.gestiondocumentaria_respuestas_id = gestiondocumentaria_respuestas.id
            WHERE
                gestiondocumentaria_respuestas.mensaje_id = ${mensaje_id}
                    AND emisor_id =  ${emisor_id}
                    AND receptor_id = ${id_acceso}
                
                ORDER BY fecha_registro DESC
                 `, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            })
        })
    },
    getgestiondocumentaria_recibidos_respuestas_cantidad({ id_acceso, emisor_id, mensaje_id }) {
        return new Promise((resolve, reject) => {
            pool.query(`
            SELECT 
                COUNT(*) cantidad
            FROM
                gestiondocumentaria_respuestas
                    LEFT JOIN
                gestiondocumentaria_archivosadjuntos ON gestiondocumentaria_archivosadjuntos.gestiondocumentaria_respuestas_id = gestiondocumentaria_respuestas.id
            WHERE
                gestiondocumentaria_respuestas.mensaje_id = ${mensaje_id}
                    AND emisor_id =  ${emisor_id}
                    AND receptor_id = ${id_acceso}
                
                ORDER BY fecha_registro DESC
                 `, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res?res[0]:{})
            })
        })
    },
    postgestiondocumentaria_respuestas(data) {
        return new Promise((resolve, reject) => {
            pool.query(`insert into gestiondocumentaria_respuestas set ?`, data, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            })
        })
    },
    getfichas_has_accesosId({ id_ficha, id_acceso }) {
        return new Promise((resolve, reject) => {
            pool.query(`
            SELECT 
                id
            FROM
                fichas_has_accesos
            WHERE
                fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
                    AND fichas_has_accesos.Accesos_id_acceso = ${id_acceso}`, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res ? res[0] : {})
            })
        })
    },
    getgestiondocumentaria_archivosadjuntos_tipos() {
        return new Promise((resolve, reject) => {
            pool.query(`
            select * from gestiondocumentaria_archivosadjuntos_tipos`, (err, res) => {
                if (err) {
                    return reject(err)
                }
                return resolve(res)
            })
        })
    },


}
