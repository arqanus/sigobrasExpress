const pool = require('../../../../db/connection');
function formato(data){
    
    // data = parseFloat(data)
    data = Number(data)
    if(isNaN(data)){
        
        data=0
    }
    if(data == 0){
        return 0
    }
    else if(data < 1){
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          })
    }else{
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
    } 

    return data
}
let userModel = {};
//avanceactividad para saber el estado de obra
userModel.putPrioridad = (id_partida,id_prioridad,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }else{        
            conn.query('update partidas set partidas.prioridades_id_prioridad = ? where partidas.id_partida = ?',[id_prioridad,id_partida],(error,res)=>{
                if(error){
                    callback(error);
                }else{                
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
            })
        }
        
                
    })
}
userModel.getPrioridad = (id_partida,callback)=>{
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }else{
            conn.query('SELECT prioridades.* FROM partidas LEFT JOIN prioridades ON prioridades.id_prioridad = partidas.prioridades_id_prioridad WHERE partidas.id_partida =?',[id_partida],(error,res)=>{
                if(error){
                    callback(error);
                }else{                
                    console.log("res",res); 
                    callback(null,res[0]);
                    conn.destroy()
                }
            })
        }
        
                
    })
}
userModel.putIconocategoria = (id_partida,id_prioridad,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }else{        
            conn.query('update partidas set partidas.iconosCategorias_id_iconoCategoria = ? where partidas.id_partida = ?',[id_prioridad,id_partida],(error,res)=>{
                if(error){
                    callback(error);
                }else{                
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
            })
        }
        
                
    })
}
userModel.getIconocategoria = (id_partida,callback)=>{
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }else{
            conn.query('SELECT iconoscategorias.* FROM partidas LEFT JOIN iconoscategorias ON iconoscategorias.id_iconoCategoria = partidas.iconosCategorias_id_iconoCategoria WHERE partidas.id_partida =?',[id_partida],(error,res)=>{
                if(error){
                    callback(error);
                }else{                
                    console.log("res",res); 
                    callback(null,res[0]);
                    conn.destroy()
                }
            })
        }
        
                
    })
}

userModel.putPrioridadRecurso = (id_partida,id_prioridad,callback)=>{
    pool.query('update partidas set partidas.prioridadesRecursos_id_prioridadesRecurso = ? where partidas.id_partida = ?',[id_prioridad,id_partida],(error,res)=>{
        if(error){
            callback(error);
        }else{                
            console.log("res",res); 
            callback(null,res);
        }
    })
}
userModel.getPrioridadRecurso = (id_partida,callback)=>{
    pool.query('SELECT prioridadesrecursos.* FROM partidas LEFT JOIN prioridadesrecursos ON prioridadesrecursos.id_prioridadesRecurso = partidas.prioridadesRecursos_id_prioridadesRecurso WHERE partidas.id_partida = ?',[id_partida],(error,res)=>{
        if(error){
            callback(error);
        }else{                
            console.log("res",res); 
            callback(null,res[0]);
        }
    })
}
userModel.putIconocategoriaRecurso = (id_partida,id_prioridad,callback)=>{
    
          
    pool.query('update partidas set partidas.iconoscategoriasrecursos_id_iconoscategoriasrecurso = ? where partidas.id_partida = ?',[id_prioridad,id_partida],(error,res)=>{
        if(error){
            callback(error);
        }else{                
            console.log("res",res); 
            callback(null,res);
        }
    })
      
}
userModel.getIconocategoriaRecurso = (id_partida,callback)=>{
    pool.query('SELECT iconoscategoriasrecursos.* FROM partidas LEFT JOIN iconoscategoriasrecursos ON iconoscategoriasrecursos.id_iconoscategoriasrecurso = partidas.iconoscategoriasrecursos_id_iconoscategoriasrecurso WHERE partidas.id_partida = ?',[id_partida],(error,res)=>{
        if(error){
            callback(error);
        }else{                
            console.log("res",res); 
            callback(null,res[0]);
        }
    })
}
userModel.putRecursoNuevo = (recursoNuevo) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE recursosnuevos SET recursosnuevos.descripcion = ?, recursosnuevos.unidad = ?, recursosnuevos.cantidad = ?, recursosnuevos.precio = ?,tipoDocumentoAdquisicion_id_tipoDocumentoAdquisicion = ?,codigo = ? where recursosnuevos.id_recursoNuevo = ?", [recursoNuevo.descripcion,recursoNuevo.unidad,recursoNuevo.cantidad,recursoNuevo.precio,recursoNuevo.id_tipoDocumentoAdquisicion,recursoNuevo.codigo,recursoNuevo.id_recursoNuevo], (error, res) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        })
    })
}

module.exports = userModel;