const pool = require('../../db/connection');

module.exports = {
    getDatosGenerales2(id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT fichas.*,DATE_FORMAT(fecha_inicial, '%Y-%m-%d') fecha_inicial FROM fichas WHERE fichas.id_ficha = ?", [id_ficha], (error, res) => {
                if (error) {
                    reject(error.code);
                }
                resolve(res&&res[0])
            })
        })
    },
    getPresupuestoCostoDirecto(id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT sum(componentes.presupuesto) monto FROM componentes WHERE componentes.fichas_id_ficha = ?", [id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res?res[0]:{})
            })
        })

    },
    getEstadoObra(id_ficha) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT estados.* FROM historialestados LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE Fichas_id_ficha = ? AND fecha_inicial = (SELECT MAX(fecha_inicial) FROM historialestados WHERE Fichas_id_ficha = ?)", [id_ficha,id_ficha], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res?res[0]:{})
            })
        })

    },
    getDatosUsuario(id_acceso) {
        return new Promise((resolve, reject) => {
            pool.query("SELECT cargos.nombre cargo_nombre, usuarios.nombre usuario_nombre FROM accesos LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario WHERE id_acceso = ?", [id_acceso], (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res?res[0]:{})
            })
        })

    },
}

