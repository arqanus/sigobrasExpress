const pool = require('../../../../db/connection');

module.exports = {
    getDificultades(if_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT dificultades.*, DATE_FORMAT(residente_fechaInicio, '%Y-%m-%d') residente_fechaInicio, DATE_FORMAT(residente_fechaFinal, '%Y-%m-%d') residente_fechaFinal, DATE_FORMAT(supervisor_fechaVisto, '%Y-%m-%d') supervisor_fechaVisto FROM dificultades WHERE fichas_id_ficha = ?", [if_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    getDificultadesHabilitado(id) {
        return new Promise((resolve, reject) => {
            pool.query("select habilitado from dificultades where  id = ?", [id], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res[0])
            })
        })

    },
    postDificultadesResidente(data) {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO dificultades ( id, residente_descripcion,residente_documento,residente_documentoLink,residente_fechaInicio,residente_duracion, residente_tipoDuracion,residente_fechaFinal,fichas_id_ficha) VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE key UPDATE residente_descripcion = VALUES(residente_descripcion), residente_documento = VALUES(residente_documento), residente_documentoLink = VALUES(residente_documentoLink), residente_fechaInicio = VALUES(residente_fechaInicio), residente_duracion = VALUES(residente_duracion), residente_tipoDuracion = VALUES(residente_tipoDuracion), residente_fechaFinal = VALUES(residente_fechaFinal)", [data.id, data.residente_descripcion, data.residente_documento, data.residente_documentoLink, data.residente_fechaInicio, data.residente_duracion, data.residente_tipoDuracion, data.residente_fechaFinal, data.fichas_id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    postDificultadesSupervisor(data, habilitado) {
        console.log("habilitado", habilitado);
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO dificultades ( id,supervisor_fechaVisto,supervisor_visto,supervisor_comentario,fichas_id_ficha,habilitado) VALUES (?,?,?,?,?,?) ON DUPLICATE key UPDATE supervisor_fechaVisto = VALUES(supervisor_fechaVisto),supervisor_visto = VALUES(supervisor_visto), supervisor_comentario = VALUES(supervisor_comentario),habilitado = VALUES(habilitado)", [data.id, data.supervisor_fechaVisto, data.supervisor_visto, data.supervisor_comentario, data.fichas_id_ficha, habilitado], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    //consultas
    getConsultas(if_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT consultas.*, DATE_FORMAT(fecha, '%Y-%m-%d') fecha, DATE_FORMAT(supervisor_fechaVisto, '%Y-%m-%d') supervisor_fechaVisto FROM consultas WHERE fichas_id_ficha = ?;", [if_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    getConsultasHabilitado(id) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT habilitado FROM consultas WHERE id = ?;", [id], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res[0])
            })
        })

    },
    postConsultaResidente(data) {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO consultas ( id, fecha,residente_descripcion,fichas_id_ficha) VALUES (?,?,?,?) ON DUPLICATE key UPDATE fecha = VALUES(fecha), residente_descripcion = VALUES(residente_descripcion)", [data.id, data.fecha, data.residente_descripcion, data.fichas_id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    postConsultaSupervisor(data) {
        return new Promise((resolve, reject) => {
            pool.query("update consultas set supervisor_fechaVisto = ?,supervisor_respuesta = ?,supervisor_comentario = ?,habilitado=?  where id = ?", [data.supervisor_fechaVisto, data.supervisor_respuesta, data.supervisor_comentario, false, data.id], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    //observaciones
    getObservaciones(if_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT observaciones.*, DATE_FORMAT(fecha, '%Y-%m-%d') fecha, DATE_FORMAT(respuesta_fecha, '%Y-%m-%d') respuesta_fecha FROM observaciones WHERE fichas_id_ficha = ?;", [if_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    getObservacionesHabilitado(id) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT habilitado FROM observaciones WHERE id = ?;", [id], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res[0])
            })
        })

    },
    postObservacionesResidente(data) {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO observaciones ( id, autor,cargo,fecha,descripcion,fichas_id_ficha) VALUES (?,?,?,?,?,?) ON DUPLICATE key UPDATE autor = VALUES(autor), cargo = VALUES(cargo),fecha=values(fecha),descripcion=values(descripcion)", [data.id, data.autor, data.cargo, data.fecha, data.descripcion, data.fichas_id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
    postObservacionesSupervisor(data, habilitado) {
        console.log("habilitado", habilitado);
        return new Promise((resolve, reject) => {
            pool.query("update observaciones set respuesta = ?,respuesta_fecha = ?,respuesta_autor = ?,habilitado = ? where id = ?", [data.respuesta, data.respuesta_fecha, data.respuesta_autor, false, data.id], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res)
            })
        })

    },
}