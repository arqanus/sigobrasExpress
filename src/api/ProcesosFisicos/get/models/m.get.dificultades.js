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
    getDificultadesHabilitado(id_ficha, id) {
        return new Promise((resolve, reject) => {
            pool.query("select habilitado from dificultades where fichas_id_ficha = ? and id = ?", [id_ficha, id], (error, res) => {
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
}