const pool = require('../../../../db/connection');
let userModel = {};
userModel.deleteEliminarHistorial = (id_historialEstado) => {
	return new Promise((resolve, reject) => {
		pool.query("DELETE FROM historialestados WHERE id_historialEstado = ? ", id_historialEstado, (error, res) => {
			if (error) {
				reject(error.code);
			}
			resolve(res)
		})
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
userModel.deleteResolucion = (id_resolucion)=>{
    return new Promise((resolve, reject) => { 
        pool.query("delete from resoluciones where id_resolucion = ?",[id_resolucion],(error,res)=>{
            if(error){
                reject(error.code);
            }else{
                resolve(res)
            }
        })
    })
    
}


module.exports = userModel;