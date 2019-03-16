const pool = require('./connection');
let userModel = {};
function formatoPorcentaje(data){
    
    // data = parseFloat(data)
    data = Number(data)
    if(isNaN(data)){
        
        data=0
    }
    if(data < 1){
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
userModel.getObras = (id_acceso,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        
        else{
            conn.query("SELECT fichas.id_ficha, fichas.g_meta, fichas.g_total_presu, SUM(avanceactividades.valor * partidas.costo_unitario) presu_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / fichas.g_total_presu * 100 porcentaje_avance, fichas.codigo, estado.nombre estado_nombre FROM fichas LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha WHERE fichas_has_accesos.Accesos_id_acceso = ? GROUP BY fichas.id_ficha",id_acceso,(err,res)=>{
                if(err){
                    callback(err);                
                }
                else if(res.length == 0){
                    callback("vacio");
        
                }else{      
                    
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getComponentes = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        
        else{
            conn.query("SELECT fichas.id_ficha, componentes.numero, componentes.nombre, componentes.presupuesto, SUM(avanceactividades.valor * partidas.costo_unitario) comp_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 porcentaje_avance_componentes FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto inner JOIN componentes ON componentes.id_componente = partidas.componentes_id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ? GROUP BY componentes.id_componente",id_ficha,(err,res)=>{
                if(err){
                    callback(err);                
                }
                else if(res.length == 0){
                    callback("vacio");
        
                }else{      
                    
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getCargosById = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}        
        else{
            conn.query("SELECT accesos.id_acceso,cargos.nombre cargo_nombre, CONCAT(usuarios.apellido_paterno, ' ', usuarios.apellido_materno, ' ', usuarios.nombre) nombre_usuario, usuarios.celular, usuarios.direccion, usuarios.dni, usuarios.email FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario where fichas_has_accesos.Fichas_id_ficha = ? order by cargos.id_Cargo",id_ficha,(err,res)=>{
                if(err){
                    callback(err);                
                }
                else if(res.length == 0){
                    callback("vacio");        
                }else{
                    console.log(res);
                    var lastcargo_nombre = -1 
                    var cargos = {}
                    var data = []
                    
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        

                        if (fila.cargo_nombre !== lastcargo_nombre) {
                            if(i != 0){
                                data.push(cargos)
                                cargos = {}
                            }
                            
                            cargos.cargo_nombre = fila.cargo_nombre
                            cargos.data=[
                                {
                                    "nombre_usuario": fila.nombre_usuario,
                                    "celular": fila.celular,
                                    "direccion": fila.direccion,
                                    "dni": fila.dni,                      
                                    "email": fila.email
                                }
                            ]                   
                            
                        }else{
                            cargos.data.push(
                                {
                                    "nombre_usuario": fila.nombre_usuario,
                                    "celular": fila.celular,
                                    "direccion": fila.direccion,
                                    "dni": fila.dni,                      
                                    "email": fila.email
                                }
                            ) 

                        }
                        lastcargo_nombre = fila.cargo_nombre
                            
                        
                    }
                    data.push(cargos)
                    callback(null,data);
                    conn.destroy()
                
                }   
            })
        }
        
                
    })
}






module.exports = userModel;