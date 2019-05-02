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
module.exports = userModel;