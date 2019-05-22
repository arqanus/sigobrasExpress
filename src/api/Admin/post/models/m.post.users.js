const pool = require('../../../../db/connection');
let userModel = {};

userModel.postUsuario = (data)=>{
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO usuarios SET ?', data,(error,res)=>{
            if(error) reject(error.code);
            resolve(res);
        })        
    })
}
userModel.postCargo = (data)=>{
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO cargos SET ?', data,(error,res)=>{
            if(error) reject(error.code);
            resolve(res);
        })  
    })
}
userModel.postAcceso = (data)=>{
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO accesos SET ?', data,(error,res)=>{
            if(error) reject(error.code);
            resolve(res);
        })  
    })
}
userModel.postObraUsuario = (data)=>{
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO fichas_has_accesos SET ?', data,(error,res)=>{
            if(error) reject(error.code);
            resolve(res);           
        })  
    })
}
//idacceso utilizado para asignar obra
userModel.getIdAcceso = (data)=>{
    return new Promise((resolve, reject) => {
        pool.query('select id_acceso from accesos where usuarios_id_usuario = ?', data,(error,res)=>{
            if(error) reject(error.code);
            resolve(res);
        })  
    })
}

module.exports = userModel;
