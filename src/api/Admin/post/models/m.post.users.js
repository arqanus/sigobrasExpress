const pool = require('../../../../db/connection');
let userModel = {};

userModel.postUsuario = (data,callback)=>{
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO usuarios SET ?', data,(error,res)=>{
            if(error){ reject(error.code);}
            else{
                resolve(res.insertId);   
            }
        })        
    })
}
userModel.postCargo = (data,callback)=>{
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO cargos SET ?', data,(error,res)=>{
            if(error){ reject(error.code);}
            else{
                resolve(res.insertId);   
            }
        })  
    })
}
userModel.postAcceso = (data,callback)=>{
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO accesos SET ?', data,(error,res)=>{
            if(error){ reject(error.code);}
            else{
                resolve(res.insertId);   
            }
        })  
    })
}
userModel.postObraUsuario = (data,callback)=>{
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO fichas_has_accesos SET ?', data,(error,res)=>{
            if(error){ reject(error.code);}
            else{
                resolve(res.insertId);   
            }
                      
        })  
    })
}
//idacceso utilizado para asignar obra
userModel.getIdAcceso = (data,callback)=>{
    return new Promise((resolve, reject) => {
        pool.query('select id_acceso from accesos where usuarios_id_usuario = ?', data,(error,res)=>{
            if(error){ reject(error.code);}
            else{
                resolve(res.insertId);   
            }
        })  
    })
}

userModel.postnuevoUsuario = (data)=>{
    return new Promise((resolve, reject) => {
        pool.query(' INSERT INTO usuarios SET ?', data,(error,res)=>{
            if(error){ reject(error.code);}
            else{
                resolve(res.insertId);   
            }
        })  
    })
}

userModel.putUsuarioImagen = (imagen,id_usuario)=>{
    return new Promise((resolve, reject) => {
        pool.query(' update usuarios set imagen=? where id_usuario= ?', [imagen,id_usuario],(error,res)=>{
            if(error){ reject(error.code);}
            else{
                resolve(res.insertId);   
            }
        })  
    })
}
userModel.editarUsuario = (idUser,id_usuario)=>{
    return new Promise((resolve, reject) => {
        pool.query(' SELECT * FROM usuarios WHERE id_usuario = ?', [idUser,id_usuario],(error,res)=>{
            if(error){ reject(error.code);}
            else{
                resolve(res.insertId);   
            }
        })  
    })
}

module.exports = userModel;
