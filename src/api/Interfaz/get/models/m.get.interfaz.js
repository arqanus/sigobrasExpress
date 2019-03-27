const pool = require('../../../../db/connection');
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
//idacceso en login
userModel.getId_acceso = (data,callback)=>{
    console.log("postLogin");
    console.log("data",data);
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{     
            var query = "SELECT accesos.id_acceso,accesos.usuario, cargos.nombre nombre_cargo, usuarios.nombre nombre_usuario,fichas.id_ficha FROM accesos LEFT JOIN cargos ON accesos.Cargos_id_Cargo = cargos.id_Cargo LEFT JOIN usuarios ON accesos.Usuarios_id_usuario = usuarios.id_usuario LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso LEFT JOIN fichas ON fichas.id_ficha = fichas_has_accesos.Fichas_id_ficha WHERE usuario ='"+data.usuario+"' AND password = '"+data.password+"' order by accesos.id_acceso desc limit 1"
            console.log("query=>",query);
            
            conn.query(query,(error,res)=>{
                if(error) {
                    console.log(error);                    
                    callback(error);
                    conn.destroy()
                }
                else if(res.length == 0){
                    console.log("vacio");                    
                    callback(null,"vacio");
                    conn.destroy()
                
                }else{                    
                    console.log("res",res); 
                    callback(null,res[0]);
                    conn.destroy()
                }
                
            })  
        }      
    })
}
//revisar
userModel.getMenu = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{            
            conn.query("SELECT fichas.id_ficha, id_acceso, data, estado.estado_nombre,estado.id_historialEstado FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN menus ON menus.accesos_id_acceso = accesos.id_acceso LEFT JOIN (SELECT fichas.id_ficha, estados.nombre estado_nombre,historialestados.id_historialEstado FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado ) estado ON estado.id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ? AND id_acceso = ? order by estado.id_historialEstado desc limit 1 ",[data.id_ficha,data.id_acceso],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else if(res.length ==0){
                    console.log("vacio");                    
                    callback("vacio");
                }else{
                    var json = JSON.parse(res[0].data)
                    var estado = res[0].estado_nombre
                    console.log("estado",estado);
                    

                    for (let i = 0; i < json.length; i++) {
                        const element = json[i];
                        console.log("nombremenu",element.nombreMenu);
                        if(element.nombreMenu=="PROCESOS FISICOS"){
                            if(estado == "Ejecucion"){
                                element.submenus.splice(0,0,
                                    {
                                        "ruta": "/MDdiario",
                                        "nombreMenu": "Metrados diarios",
                                        "nombrecomponente":"MDdiario"
                                    }
                                )
                            }else if(estado == "Corte"){
                                element.submenus.splice(0,0,
                                    {
                                        "nombreMenu": "Corte de obra",
                                        "ruta": "/CorteObra",
                                        "nombrecomponente":"CorteObra"
                                    }
                                )
                            }else if(estado == "Actualizacion"){
                                element.submenus.splice(0,0,
                                    {
                                        "nombreMenu": "Actualización de obra",
                                        "ruta": "/ActualizacionObra",
                                        "nombrecomponente":"ActualizacionObra"
                                    }
                                )
                            }else if(estado == "Paralizado"){
                                element.submenus.splice(0,0,
                                    {
                                        "nombreMenu": "Paralizado ",
                                        "ruta": "/ParalizacionObra",
                                        "nombrecomponente":"ParalizacionObra"
                                    }
                                )
                            }else if(estado == "Compatibilidad"){
                                element.submenus.splice(0,0,
                                    {
                                        "nombreMenu": "Compatibilidad",
                                        "ruta": "/CompatibilidadObra",
                                        "nombrecomponente":"CompatibilidadObra"
                                    }
                                )
                            }
                            

                        }
                         
                    }
                    console.log("res",json); 
                    callback(null,json);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.getDatosGenerales = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('SELECT fichas.g_meta, TIMESTAMPDIFF(DAY, fichas.fecha_inicial, CURDATE()) dias_ejecutados, TIMESTAMPDIFF(DAY, CURDATE(), plazoejecucion.fechaEjecucion) dias_saldo, estado.nombre estado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_acumulado, SUM(avanceactividades.valor * partidas.costo_unitario) / fichas.g_total_presu * 100 porcentaje_acumulado, avance_actual.avance avance_actual, avance_actual.avance / fichas.g_total_presu * 100 porcentaje_actual, avance_ayer.avance avance_ayer, avance_ayer.avance / fichas.g_total_presu * 100 porcentaje_ayer FROM fichas LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN plazoejecucion ON plazoejecucion.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas.id_ficha, SUM(avanceactividades.valor * partidas.costo_unitario) avance, avanceactividades.fecha FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE DATE(avanceactividades.fecha) = CURDATE() GROUP BY fichas.id_ficha) avance_actual ON avance_actual.id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas.id_ficha, SUM(avanceactividades.valor * partidas.costo_unitario) avance, avanceactividades.fecha FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE DATE(avanceactividades.fecha) = SUBDATE(CURDATE(), 1) GROUP BY fichas.id_ficha) avance_ayer ON avance_ayer.id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ? GROUP BY fichas.id_ficha',[id_ficha], (error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }
                else if(res.length ==0){
                    callback("vacio");
                }else{
                    console.log("res",res); 
                    
                        const ficha = res[0];                        
                        ficha.avance_acumulado = formatoPorcentaje(ficha.avance_acumulado)
                        ficha.porcentaje_acumulado = formatoPorcentaje(ficha.porcentaje_acumulado)
                        ficha.avance_actual = formatoPorcentaje(ficha.avance_actual)
                        ficha.porcentaje_actual = formatoPorcentaje(ficha.porcentaje_actual)
                        ficha.avance_ayer = formatoPorcentaje(ficha.avance_ayer)
                        ficha.porcentaje_ayer = formatoPorcentaje(ficha.porcentaje_ayer)
                        
                    
                 
                    callback(null,res[0]);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}

module.exports = userModel;