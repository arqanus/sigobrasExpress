const pool = require('../../../../db/connection');
let userModel = {};
userModel.postAvanceActividad = (data, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) { callback(err); }
        else {
            conn.query('INSERT INTO AvanceActividades set ?', data, (error, res) => {
                if (error) {
                    callback(error);
                    conn.destroy()
                } else {
                    console.log("affectedRows", res);
                    callback(null, res);
                    conn.destroy()
                }
            })
        }
    })
}
userModel.postActividad = (data, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) { callback(err); }
        else {
            conn.query('INSERT INTO actividades set ?', data, (error, res) => {
                if (error) {
                    callback(error);
                    conn.destroy()
                } else {
                    console.log("affectedRows", res);
                    callback(null, res.insertId);
                    conn.destroy()
                }
            })
        }
    })
}
userModel.posthistorialActividades = (data, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) { callback(err); }
        else {
            conn.query('INSERT INTO historialActividades set ?', data, (error, res) => {
                if (error) {
                    callback(error);
                    conn.destroy()
                } else {
                    console.log("affectedRows", res);
                    callback(null, res.insertId);
                    conn.destroy()
                }
            })
        }
    })
}
userModel.postavancePartidaImagen = (data, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) { callback(err); }
        else {
            conn.query('INSERT INTO partidasImagenes set ?', data, (error, res) => {
                if (error) {
                    callback(error);
                    conn.destroy()
                } else {
                    console.log("affectedRows", res);
                    callback(null, res);
                    conn.destroy()
                }
            })
        }
    })
}
userModel.postrecursosEjecucionrealCantidad = (data) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,cantidad) VALUES ? ON DUPLICATE key UPDATE cantidad = VALUES(cantidad)', [data], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        })
    })
}
userModel.postrecursosEjecucionrealPrecio = (data) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,precio) VALUES ? ON DUPLICATE key UPDATE precio = VALUES(precio)', [data], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        })
    })
}
userModel.postrecursosEjecucionrealCodigo = (data) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,codigo,tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion) VALUES ? ON DUPLICATE key UPDATE tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion = VALUES(tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion),codigo = VALUES(codigo)', [data], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        })
    })
}
userModel.postrecursosEjecucionrealUnidad = (data) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,unidad) VALUES ? ON DUPLICATE key UPDATE unidad = VALUES(unidad)', [data], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        })
    })
}
userModel.postrecursosEjecucionrealdescripcionModificada = (data) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO recursos_ejecucionreal (fichas_id_ficha,tipo,descripcion,descripcion_modificada) VALUES ? ON DUPLICATE key UPDATE descripcion_modificada = VALUES(descripcion_modificada)', [data], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        })
    })
}
userModel.getrecursosEjecucionreal = (id_ficha, descripcion) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT tipo, codigo recurso_codigo, descripcion, cantidad recurso_gasto_cantidad, precio recurso_gasto_precio, unidad recurso_gasto_unidad, descripcion_modificada recurso_gasto_descripcion FROM recursos_ejecucionreal WHERE recursos_ejecucionreal.fichas_id_ficha = ? AND recursos_ejecucionreal.descripcion = ?", [id_ficha, descripcion], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res[0]);
            }
        })
    })
}
userModel.postdocumentoAdquisicion = (data) => {
    return new Promise((resolve, reject) => {
        pool.query("insert into documentosAdquisicion set ?", [data], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res.insertId);
            }
        })
    })
}
userModel.putrecursosEjecucionrealIdDocumentoAdquisicion = (data) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO recursos_ejecucionreal (fichas_id_ficha,descripcion,documentosAdquisicion_id_documentoAdquisicion) VALUES ? ON DUPLICATE key UPDATE documentosAdquisicion_id_documentoAdquisicion = VALUES(documentosAdquisicion_id_documentoAdquisicion)", [data], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        })
    })
}
module.exports = userModel;