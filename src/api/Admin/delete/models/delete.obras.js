const pool = require('../../../../db/connection');
let userModel = {};
userModel.deleteEliminarHistorial = (id_historialEstado,callback)=>{
    pool.query("DELETE FROM historialestados WHERE id_historialEstado = ? ",id_historialEstado,(error,res)=>{
        if(error){
            console.log(error);                    
            callback(error.code);
        }else{
            
            callback(null,res)
        }
    })
}
userModel.deleteEliminarUsuario = (id_usuario)=>{
    return new Promise((resolve, reject) => { 
        pool.query("DELETE FROM usuarios WHERE id_Usuario = ? ",id_usuario,(error,res)=>{
            if(error){
                reject(error.code);
            }else{
                resolve(res)
            }
        })
    })
    
}


module.exports = userModel;