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
// userModel.getGananciasyCostos = (data,callback)=>{
    
//     pool.getConnection(function(err ,conn){
//         if(err){                        
//             callback(err);
//         }
//         else{     
//             //insertar datos query
//             conn.query("select * from costosyganancias",(error,res)=>{ 
//                 if(error){
//                     console.log(error);                    
//                     callback(error.code);
//                 }else{
                   
//                     console.log("res",res); 
//                     callback(null,res);
//                     conn.destroy()
//                 }
                
                
//             })
//         }                
//     })
// }

// userModel.getcronogramamensual = (data,callback)=>{
    
//     pool.getConnection(function(err ,conn){
//         if(err){                        
//             callback(err);
//         }
//         else{     
//             //insertar datos query
//             conn.query("select fichas_id_ficha,programado,financieroEjecutado,mes from cronogramamensual where fichas_id_ficha = ?",[data],(error,res)=>{ 
//                 if(error){
//                     console.log(error);                    
//                     callback(error.code);
//                 }else{
//                     var listaMes = []
//                     var programado = []
//                     var financieroEjecutado = []
//                     ///ac tres arrays de la consulta
//                     for (let i = 0; i < res.length; i++) {
//                         const element = res[i];
//                         console.log(element.mes);
//                         listaMes.push(element.mes)
//                         programado.push(element.programado)
//                         financieroEjecutado.push(element.financieroEjecutado)
//                     }

//                     var cronogramamensual = {
//                         "mes":listaMes,
//                         "programado":programado,
//                         "financieroEjecutado":financieroEjecutado
//                     }





//                     console.log()
//                     //hasta aqui
                   
//                     // console.log("res",listaMes); 
//                     callback(null,cronogramamensual);
//                     conn.destroy()
//                 }
                
                
//             })
//         }                
//     })
// }

// userModel.getIdHistorial = (id_ficha,callback)=>{
    
//     pool.getConnection(function(err ,conn){
//         if(err){ 
//             callback(err);
       
//         }else{        
//             conn.query('select id_historialEstado from fichas left join historialestados on historialestados.Fichas_id_ficha = fichas.id_ficha where id_ficha = ? ORDER BY historialestados.id_historialEstado DESC LIMIT 1',id_ficha,(error,res)=>{
//                 if(error){
//                     callback(error);
//                 }else if(res.length == 0){
//                     console.log("vacio");                    
//                     callback("vacio");
//                 }else{                
//                     console.log("res",res); 
//                     callback(null,res);
//                     conn.destroy()
//                 }
                
                
//             })
//         }
        
                
//     })
// }
// userModel.getAvanceById = (id_actividad,callback)=>{
    
//     pool.getConnection(function(err ,conn){
//         if(err){ callback(err);}
//         else{
//             conn.query('SELECT partida.id_partida, partida.tipo, partida.item, partida.descripcion, partida.unidad_medida, partida.metrado, partida.costo_unitario, partida.parcial, partida.avance_metrado, partida.avance_costo, partida.metrados_saldo, partida.metrados_costo_saldo, partida.porcentaje, actividades.id_actividad, actividades.nombre nombre_actividad, actividades.veces veces_actividad, actividades.largo largo_actividad, actividades.ancho ancho_actividad, actividades.alto alto_actividad, actividades.parcial metrado_actividad, partida.costo_unitario, actividades.parcial * partida.costo_unitario parcial_actividad, if(SUM(avanceactividades.valor) is null,0,SUM(avanceactividades.valor)) actividad_avancce_metrado, if(SUM(avanceactividades.valor) is null,0,SUM(avanceactividades.valor)) * partida.costo_unitario actividad_avance_costo, actividades.parcial - if(SUM(avanceactividades.valor) is null,0,SUM(avanceactividades.valor)) actividad_metrados_saldo, (actividades.parcial - if(SUM(avanceactividades.valor) is null,0,SUM(avanceactividades.valor))) * partida.costo_unitario actividad_metrados_costo_saldo, (if(SUM(avanceactividades.valor) is null,0,SUM(avanceactividades.valor)) / actividades.parcial) * 100 actividad_porcentaje FROM (SELECT partidas.Componentes_id_componente, partidas.presupuestos_id_Presupuesto, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor) * partidas.costo_unitario avance_costo, partidas.metrado - IF(SUM(avanceactividades.valor) IS NULL, 0, SUM(avanceactividades.valor)) metrados_saldo, (partidas.metrado - IF(SUM(avanceactividades.valor) IS NULL, 0, SUM(avanceactividades.valor))) * partidas.costo_unitario metrados_costo_saldo, (IF(SUM(avanceactividades.valor) IS NULL, 0, SUM(avanceactividades.valor)) / partidas.metrado) * 100 porcentaje FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY partidas.id_partida) partida LEFT JOIN actividades ON actividades.Partidas_id_partida = partida.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE partida.id_partida = (SELECT actividades.Partidas_id_partida FROM actividades WHERE actividades.id_actividad = ? LIMIT 1) GROUP BY actividades.id_actividad',id_actividad,(err,res)=>{
//                 if(err){
//                     console.log(err);
//                     callback(err.code);
//                 }else if(res.length == 0){
//                     console.log("vacio");                    
//                     callback("vacio");
//                 }else{
//                     var partida = {}
//                     id_partida = -1
//                     for (let i = 0; i < res.length; i++) {
//                         const fila = res[i];
//                         if(fila.id_partida !=id_partida){                            
//                             partida.id_partida = fila.id_partida
//                             partida.tipo = fila.tipo
//                             partida.item = fila.item
//                             partida.descripcion = fila.descripcion
//                             partida.unidad_medida = fila.unidad_medida
//                             partida.metrado = fila.metrado
//                             partida.costo_unitario = fila.costo_unitario
//                             partida.parcial = fila.parcial
//                             partida.avance_metrado = fila.avance_metrado
//                             partida.avance_costo = fila.avance_costo
//                             partida.metrados_saldo = fila.metrados_saldo
//                             partida.metrados_costo_saldo = fila.metrados_costo_saldo
//                             partida.porcentaje = fila.porcentaje
//                             partida.actividades=[
//                                 {
//                                     "id_actividad":fila.id_actividad,                       "nombre_actividad":fila.nombre_actividad,
//                                     "veces_actividad":fila.veces_actividad,
//                                     "largo_actividad":fila.largo_actividad,
//                                     "ancho_actividad":fila.ancho_actividad,
//                                     "alto_actividad":fila.alto_actividad,
//                                     "metrado_actividad":fila.metrado_actividad,
//                                     "costo_unitario":fila.costo_unitario,
//                                     "parcial_actividad":fila.parcial_actividad,
//                                     "actividad_avancce_metrado":fila.actividad_avancce_metrado,
//                                     "actividad_avance_costo":fila.actividad_avance_costo,
//                                     "actividad_metrados_saldo":fila.actividad_metrados_saldo,
//                                     "actividad_metrados_costo_saldo":fila.actividad_metrados_costo_saldo,
//                                     "actividad_porcentaje":fila.actividad_porcentaje,
//                                     "unidad_medida": fila.unidad_medida
//                                 }
//                             ]
//                         }else{
//                             partida.actividades.push(
//                                 {
//                                     "id_actividad":fila.id_actividad,                       "nombre_actividad":fila.nombre_actividad,
//                                     "veces_actividad":fila.veces_actividad,
//                                     "largo_actividad":fila.largo_actividad,
//                                     "ancho_actividad":fila.ancho_actividad,
//                                     "alto_actividad":fila.alto_actividad,
//                                     "metrado_actividad":fila.metrado_actividad,
//                                     "costo_unitario":fila.costo_unitario,
//                                     "parcial_actividad":fila.parcial_actividad,
//                                     "actividad_avancce_metrado":fila.actividad_avancce_metrado,
//                                     "actividad_avance_costo":fila.actividad_avance_costo,
//                                     "actividad_metrados_saldo":fila.actividad_metrados_saldo,
//                                     "actividad_metrados_costo_saldo":fila.actividad_metrados_costo_saldo,
//                                     "actividad_porcentaje":fila.actividad_porcentaje,
//                                     "unidad_medida": fila.unidad_medida
//                                 }
//                             )

//                         }
//                         id_partida = fila.id_partida
//                         console.log("idactividad",id_partida);
                        
                        
//                     }
                  
                                      
//                         partida.metrado = formatoPorcentaje(partida.metrado)
//                         partida.costo_unitario = formatoPorcentaje(partida.costo_unitario)
//                         partida.parcial = formatoPorcentaje(partida.parcial)
//                         partida.avance_metrado = formatoPorcentaje(partida.avance_metrado)
//                         partida.avance_costo = formatoPorcentaje(partida.avance_costo)
//                         partida.metrados_saldo = formatoPorcentaje(partida.metrados_saldo)
//                         partida.metrados_costo_saldo = formatoPorcentaje(partida.metrados_costo_saldo)
//                         const actividades = partida.actividades
//                         for (let k = 0; k < actividades.length; k++) {
//                             const actividad = actividades[k];
//                             actividad.metrado_actividad = formatoPorcentaje(actividad.metrado_actividad)
//                             actividad.costo_unitario = formatoPorcentaje(actividad.costo_unitario)
//                             actividad.parcial_actividad = formatoPorcentaje(actividad.parcial_actividad)
//                             actividad.actividad_avance_metrado = formatoPorcentaje(actividad.actividad_avance_metrado)
//                             actividad.actividad_avance_costo = formatoPorcentaje(actividad.actividad_avance_costo)
//                             actividad.actividad_metrados_saldo = formatoPorcentaje(actividad.actividad_metrados_saldo)
//                             actividad.actividad_metrados_costo_saldo = formatoPorcentaje(actividad.actividad_metrados_costo_saldo)
//                             actividad.actividad_porcentaje = formatoPorcentaje(actividad.actividad_porcentaje)
//                         }                                                   
                    
                        
                                                
                    

//                     callback(null,partida);
//                     conn.destroy()
//                 }
                
                
//             })
//         }
        
                
//     })
// }
// userModel.getDatosGenerales = (id_ficha,callback)=>{
    
//     pool.getConnection(function(err ,conn){
//         if(err){ callback(err);}
//         else{
//             conn.query('SELECT fichas.g_meta, TIMESTAMPDIFF(DAY, fichas.fecha_inicial, CURDATE()) dias_ejecutados, TIMESTAMPDIFF(DAY, CURDATE(), plazoejecucion.fechaEjecucion) dias_saldo, estado.nombre estado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_acumulado, SUM(avanceactividades.valor * partidas.costo_unitario) / fichas.g_total_presu * 100 porcentaje_acumulado, avance_actual.avance avance_actual, avance_actual.avance / fichas.g_total_presu * 100 porcentaje_actual, avance_ayer.avance avance_ayer, avance_ayer.avance / fichas.g_total_presu * 100 porcentaje_ayer FROM fichas LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN plazoejecucion ON plazoejecucion.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas.id_ficha, SUM(avanceactividades.valor * partidas.costo_unitario) avance, avanceactividades.fecha FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE DATE(avanceactividades.fecha) = CURDATE() GROUP BY fichas.id_ficha) avance_actual ON avance_actual.id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas.id_ficha, SUM(avanceactividades.valor * partidas.costo_unitario) avance, avanceactividades.fecha FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE DATE(avanceactividades.fecha) = SUBDATE(CURDATE(), 1) GROUP BY fichas.id_ficha) avance_ayer ON avance_ayer.id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ? GROUP BY fichas.id_ficha',id_ficha, (error,res)=>{
//                 if(error){
//                     console.log(error);                    
//                     callback(error.code);
//                 }
//                 else if(res.length ==0){
//                     callback("vacio");
//                 }else{
//                     console.log("res",res); 
                    
//                         const ficha = res[0];                        
//                         ficha.avance_acumulado = formatoPorcentaje(ficha.avance_acumulado)
//                         ficha.porcentaje_acumulado = formatoPorcentaje(ficha.porcentaje_acumulado)
//                         ficha.avance_actual = formatoPorcentaje(ficha.avance_actual)
//                         ficha.porcentaje_actual = formatoPorcentaje(ficha.porcentaje_actual)
//                         ficha.avance_ayer = formatoPorcentaje(ficha.avance_ayer)
//                         ficha.porcentaje_ayer = formatoPorcentaje(ficha.porcentaje_ayer)
                        
                    
                 
//                     callback(null,res[0]);
//                     conn.destroy()
//                 }
                
                
//             })
//         }                
//     })
// }
module.exports = userModel;