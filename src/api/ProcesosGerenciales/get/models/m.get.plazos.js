const pool = require('../../../../db/connection');
module.exports = {
    getPlazos(id_ficha,nivel,idplazos="null") {
        return new Promise((resolve, reject) => {
            var query = "SELECT plazos_historial.*, DATE_FORMAT(fecha_inicio, '%Y-%m-%d') fecha_inicio, DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final FROM plazos_historial WHERE fichas_id_ficha = ? AND nivel = ? AND COALESCE(plazos_historial.idplazos, 'null') = '"+idplazos+"' ORDER BY fecha_inicio"
            pool.query(query, [id_ficha,nivel], (err, res) => {
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
            var query = "INSERT INTO plazos_historial (idplazos_historial, tipo, nivel,descripcion, fecha_inicio, fecha_final, documento_resolucion_estado, imagen, observacion, fichas_id_ficha,idplazos) VALUES ? ON DUPLICATE KEY UPDATE tipo = values(tipo), descripcion = values(descripcion), fecha_inicio = values(fecha_inicio), fecha_final = values(fecha_final), documento_resolucion_estado = values(documento_resolucion_estado), imagen = values(imagen), observacion = values(observacion) "
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
            var query = "DELETE FROM plazos_historial WHERE idplazos_historial = ?"
            pool.query(query, [idplazos_historial], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    },
    getPlazosTipo(nivel) {
        return new Promise((resolve, reject) => {
            var query = "select * from plazos_tipo where nivel = ?"
            pool.query(query, [nivel], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    }
};



