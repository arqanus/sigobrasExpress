const pool = require('../../../../db/connection');
let userModel = {};
userModel.getObras = (callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}       
        conn.query('select *from fichas left join (SELECT historialestados.Fichas_id_ficha, estados.nombre estado_nombre FROM historialestados INNER JOIN (SELECT MAX(historialestados.id_historialEstado) id_historialEstado FROM historialestados LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado GROUP BY historialestados.Fichas_id_ficha) he ON he.id_historialEstado = historialestados.id_historialEstado INNER JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha', (error,res)=>{
            if(error) callback(error);            
            callback(null,res);
            conn.destroy()
        })        
    })
    
}
userModel.getEstados = (callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('SELECT * FROM estados', (error,res)=>{
                if(error){
                    callback(error);
                }else{
                    console.log("affectedRows",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}

userModel.getComponentesById = (id_ficha,callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}       
        conn.query('SELECT componentes.numero, componentes.nombre, componentes.id_componente, componentes.presupuesto FROM componentes WHERE componentes.Fichas_id_ficha = ?',id_ficha, (error,res)=>{
            if(error) callback(error);            
            callback(null,res);
            conn.destroy()
        })        
    })
}

userModel.getTipoObras = (callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{            
            
            
            conn.query("select * from tipoobras",(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}

userModel.getUnidadEjecutora = (callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{                       
            conn.query("select * from UnidadEjecutoras",(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.getPartidasPorObra = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{                       
            conn.query("select partidas.item,actividades.id_actividad,actividades.parcial/partidas.metrado porcentaje_metrado from componentes left join partidas on partidas.componentes_id_componente = componentes.id_componente left join actividades on actividades.Partidas_id_partida = partidas.id_partida where     componentes.fichas_id_ficha = ? AND ((actividades.parcial IS NOT NULL AND actividades.parcial > 0) OR partidas.tipo = 'titulo')",id_ficha,(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    var partidas = []
                    var partida={}
                    var item = -1
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if(fila.item != item){
                            if(i>0){
                                partidas.push(partida)
                                partida = {}
                            }
                            partida.item = fila.item
                            partida.actividades=[
                                {
                                    "id_actividad":fila.id_actividad,
                                    "porcentaje_metrado":fila.porcentaje_metrado
                                }
                            ]
                            
                        }else{
                            partida.actividades.push({
                                "id_actividad":fila.id_actividad,
                                "porcentaje_metrado":fila.porcentaje_metrado
                            })

                        }
                        item = fila.item

                        
                    }
                    partidas.push(partida)

                    
                    callback(null,partidas);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}



module.exports = userModel;