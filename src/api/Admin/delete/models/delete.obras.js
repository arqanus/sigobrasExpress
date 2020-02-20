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
userModel.deleteHistorial = (body)=>{
    return new Promise((resolve, reject) => { 
        var query = 
        `DELETE 
            avanceactividades
        FROM
            componentes
                LEFT JOIN
            partidas ON partidas.componentes_id_componente = componentes.id_componente
                LEFT JOIN
            actividades ON actividades.Partidas_id_partida = partidas.id_partida
                LEFT JOIN
            avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        WHERE
            fichas_id_ficha = ${body.obra}
                AND (YEAR(avanceactividades.fecha) = ${body.anio}
                OR IF(${body.anio} = 0, TRUE, FALSE))
                AND (MONTH(avanceactividades.fecha) = ${body.mes}
                OR IF(${body.mes} = 0, TRUE, FALSE))`
        pool.query(query,(error,res)=>{
            if(error){
                reject(error.code);
            }else{
                resolve(res)
            }
        })
    })
    
}
userModel.deleteHistorialById = (id_AvanceActividades)=>{
    return new Promise((resolve, reject) => { 
        var query = 
        `delete from avanceactividades where id_AvanceActividades = ${id_AvanceActividades}`
        pool.query(query,(error,res)=>{
            if(error){
                reject(error.code);
            }else{
                resolve(res)
            }
        })
    })
    
}

module.exports = userModel;