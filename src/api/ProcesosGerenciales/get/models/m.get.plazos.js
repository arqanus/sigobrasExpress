const pool = require('../../../../db/connection');
module.exports = {
    getPlazos(id_ficha) {
        return new Promise((resolve, reject) => {
            var query = "select * from plazos_historial where fichas_id_ficha = ?"
            pool.query(query, [id_ficha], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    },
    putPlazos(data) {
        return new Promise((resolve, reject) => {
            var query = "INSERT INTO plazos_historial (idplazos_historial, tipo, descripcion, fecha_inicio, fecha_final, documento_resolucion_estado, imagen, observacion, fichas_id_ficha,idplazos) VALUES ? ON DUPLICATE KEY UPDATE tipo = values(tipo), descripcion = values(descripcion), fecha_inicio = values(fecha_inicio), fecha_final = values(fecha_final), documento_resolucion_estado = values(documento_resolucion_estado), imagen = values(imagen), observacion = values(observacion) "
            pool.query(query, [data], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    },
    deletePlazos(idplazos_historial) {
        return new Promise((resolve, reject) => {
            var query = "DELETE FROM plazos_historial WHERE idplazos_historial = 1"
            pool.query(query, [idplazos_historial], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    }
};



