const pool = require('../../../../db/connection');
let userModel = {};

userModel.postProyecto = (data) => {
    return new Promise((resolve, reject) => { 
        pool.query('INSERT INTO proyectos SET ?', [data], (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.insertId);
            }
        })
    })
}
userModel.postTarea = (data) => {
    return new Promise((resolve, reject) => { 
        pool.query('INSERT INTO tareas SET ?', data, (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res.insertId);
            }
        })
    })
}
userModel.postTareaReceptores = (data) => {
    return new Promise((resolve, reject) => { 
        pool.query('INSERT INTO tareas_has_accesos (tareas_id_tarea,receptor) values ? ON DUPLICATE key UPDATE receptor = VALUES(receptor)', [data], (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res.affectedRows);
            }
        })
    })
}
userModel.postTareaAvance = (avance, id_tarea, ) => {
    return new Promise((resolve, reject) => {
        pool.query('update tareas SET avance = ? where id_tarea = ?', [avance, id_tarea], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res.affectedRows)
        })
    })
}

userModel.postTareaComentario = (data) => {
    return new Promise((resolve, reject) => {
        pool.query('insert into comentarios set ?', [data], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res.insertId)
        })
    })
}

module.exports = userModel;
