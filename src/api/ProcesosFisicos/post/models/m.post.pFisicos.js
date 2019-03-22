const pool = require('../../../../db/connection');
function formato(data){
    
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
let userModel = {};
//avanceactividad para saber el estado de obra
userModel.getIdHistorial = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        
        }else{        
            conn.query('select historialestados.id_historialEstado,historialestados.Estados_id_Estado,estados.nombre from historialestados left join estados on estados.id_Estado = historialestados.Estados_id_Estado where historialestados.Fichas_id_ficha=? and estados.nombre !="Compatibilidad"and estados.nombre !="Paralizado"and estados.nombre !="Actualizacion" order by historialestados.id_historialEstado desc limit 1',id_ficha,(error,res)=>{
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback("vacio");
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
userModel.postAvanceActividad = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO AvanceActividades set ?',data,(error,res)=>{
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
userModel.getPartidasbyIdActividad = (id_actividad,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partida.id_partida, partida.tipo, partida.item, partida.descripcion, TRIM(BOTH '/DIA' FROM partida.unidad_medida) unidad_medida, partida.metrado, partida.costo_unitario, partida.parcial_positivo + COALESCE(parcial_negativo, 0) parcial, partida.avance_metrado * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, partida.avance_costo * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partida.metrado - partida.avance_metrado * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, partida.parcial_positivo + COALESCE(parcial_negativo, 0) - (partida.avance_metrado * partida.costo_unitario) metrados_costo_saldo, partida.porcentaje * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor * partidas.costo_unitario) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida LEFT JOIN (SELECT historialpartidas.estado, historialpartidas.partidas_id_partida FROM (SELECT MAX(id_historialPartida) id_historialPartida FROM historialpartidas GROUP BY historialpartidas.partidas_id_partida) maximoHistorial LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida) historialPartida ON historialPartida.partidas_id_partida = partida.id_partida WHERE partida.id_partida = (SELECT actividades.Partidas_id_partida FROM actividades WHERE actividades.id_actividad = ? LIMIT 1)",id_actividad,(err,res)=>{
                if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback("vacio");
                    conn.destroy()
                }else{          
                    callback(null,res[0]);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getActividadesbyIdActividad = (id_actividad,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partida.id_partida, actividades.id_actividad, actividades.tipo actividad_tipo, historialactividades.estado actividad_estado, actividades.nombre nombre_actividad, actividades.veces veces_actividad, actividades.largo largo_actividad, actividades.ancho ancho_actividad, actividades.alto alto_actividad, actividades.parcial metrado_actividad, partida.costo_unitario, actividades.parcial * partida.costo_unitario parcial_actividad, COALESCE(SUM(avanceactividades.valor), 0) actividad_avance_metrado, COALESCE(SUM(avanceactividades.valor * partida.costo_unitario), 0) actividad_avance_costo, actividades.parcial - COALESCE(SUM(avanceactividades.valor), 0) actividad_metrados_saldo, actividades.parcial - COALESCE(SUM(avanceactividades.valor * partida.costo_unitario), 0) actividad_metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / actividades.parcial * 100 actividad_porcentaje, TRIM(TRAILING '/DIA' FROM partida.unidad_medida) unidad_medida FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor * partidas.costo_unitario) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 OR partidas.tipo = 'titulo' GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida INNER JOIN actividades ON actividades.Partidas_id_partida = partida.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE partida.id_partida = (SELECT actividades.Partidas_id_partida FROM actividades WHERE actividades.id_actividad = ? LIMIT 1) GROUP BY actividades.id_actividad ",id_actividad,(err,res)=>{
                if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback("vacio");
                    conn.destroy()
                }else{          
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.postActividad = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO actividades set ?',data,(error,res)=>{
                if(error){
                    callback(error);
                }else{
                    console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.posthistorialActividades = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO historialActividades set ?',data,(error,res)=>{
                if(error){
                    callback(error);
                }else{
                    console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
//old
userModel.getAvanceById = (id_actividad,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT partida.id_partida, partida.tipo, partida.item, partida.descripcion, TRIM(BOTH '/DIA' FROM partida.unidad_medida), partida.metrado, partida.costo_unitario, partida.parcial, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)*COALESCE(partida.avance_metrado ,0) avance_metrado, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)*COALESCE(partida.avance_costo ,0) avance_costo, partida.metrado - (partida.avance_metrado*(COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_saldo, partida.parcial - (partida.avance_metrado * partida.costo_unitario*(COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(partida.porcentaje ,0)*(COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, actividad.id_actividad, actividad.tipo actividad_tipo, actividad.estado actividad_estado, actividad.nombre actividad_nombre, actividad.veces, actividad.largo, actividad.ancho, actividad.alto, actividad.metrado_actividad, partida.costo_unitario, if((    actividad.metrado_actividad * partida.costo_unitario)<0,0,actividad.metrado_actividad * partida.costo_unitario) parcial_actividad, actividad.actividad_avance_metrado, actividad.actividad_avance_metrado * partida.costo_unitario actividad_avance_costo, if((actividad.metrado_actividad - actividad.actividad_avance_metrado)<0,0,actividad.metrado_actividad - actividad.actividad_avance_metrado) actividad_metrados_saldo, (actividad.metrado_actividad - actividad.actividad_avance_metrado) * partida.costo_unitario actividad_metrados_costo_saldo, (actividad.actividad_avance_metrado / actividad.metrado_actividad) * 100 actividad_porcentaje FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor) * partidas.costo_unitario avance_costo, partidas.metrado - IF(SUM(avanceactividades.valor) IS NULL, 0, SUM(avanceactividades.valor)) metrados_saldo, (partidas.metrado - IF(SUM(avanceactividades.valor) IS NULL, 0, SUM(avanceactividades.valor))) * partidas.costo_unitario metrados_costo_saldo, (IF(SUM(avanceactividades.valor) IS NULL, 0, SUM(avanceactividades.valor)) / partidas.metrado) * 100 porcentaje FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT Partidas_id_partida, id_actividad, tipo, historialactividades.estado, nombre, veces, largo, ancho, alto, parcial metrado_actividad, IF(SUM(avanceactividades.valor) IS NULL, 0, SUM(avanceactividades.valor)) actividad_avance_metrado FROM actividades LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad GROUP BY actividades.id_actividad) actividad ON actividad.Partidas_id_partida = partida.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividad.id_actividad LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida)parcial_positivo on parcial_positivo.id_partida = partida.id_partida left join (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida)parcial_negativo on parcial_negativo.id_partida = partida.id_partida WHERE partida.id_partida = (SELECT actividades.Partidas_id_partida FROM actividades WHERE actividades.id_actividad = ? LIMIT 1) GROUP BY actividad.id_actividad",id_actividad,(err,res)=>{
                if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback("vacio");
                }else{
                    const partida = {}
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if(i==0){                        
                                
                            partida.id_partida =  fila.id_partida
                            partida.tipo = fila.tipo
                            partida.estado = null
                            partida.item = fila.item
                            partida.descripcion =  fila.descripcion
                            partida.unidad_medida =  fila.unidad_medida
                            partida.metrado =  fila.metrado
                            partida.costo_unitario =  fila.costo_unitario
                            partida.parcial =  fila.parcial
                            partida.avance_metrado =  fila.avance_metrado
                            partida.avance_costo =  fila.avance_costo
                            partida.metrados_saldo =  fila.metrados_saldo
                            partida.metrados_costo_saldo =  fila.metrados_costo_saldo
                            partida.porcentaje =  fila.porcentaje
                            partida.actividades = 
                            [
                                {
                                    "id_actividad":fila.id_actividad,
                                    "actividad_tipo":fila.actividad_tipo,
                                    "actividad_estado":fila.actividad_estado,
                                    "nombre_actividad":fila.actividad_nombre,
                                    "veces_actividad":fila.veces,
                                    "largo_actividad":fila.largo,
                                    "ancho_actividad":fila.ancho,
                                    "alto_actividad":fila.alto,
                                    "metrado_actividad":fila.metrado_actividad,
                                    "costo_unitario":fila.costo_unitario,
                                    "parcial_actividad":fila.parcial_actividad,
                                    "actividad_avance_metrado": fila.actividad_avance_metrado,
                                    "actividad_avance_costo": fila.actividad_avance_costo,
                                    "actividad_metrados_saldo": fila.actividad_metrados_saldo,
                                    "actividad_metrados_costo_saldo": fila.actividad_metrados_costo_saldo,
                                    "actividad_porcentaje": fila.actividad_porcentaje,
                                    "unidad_medida": fila.unidad_medida,
                                }
                            ]
                                                                 
                            
                        }else{
                            partida.actividades.push(
                                {
                                    "id_actividad":fila.id_actividad,
                                    "actividad_tipo":fila.actividad_tipo,
                                    "actividad_estado":fila.actividad_estado,
                                    "nombre_actividad":fila.actividad_nombre,
                                    "veces_actividad":fila.veces,
                                    "largo_actividad":fila.largo,
                                    "ancho_actividad":fila.ancho,
                                    "alto_actividad":fila.alto,
                                    "metrado_actividad":fila.metrado_actividad,
                                    "costo_unitario":fila.costo_unitario,
                                    "parcial_actividad":fila.parcial_actividad,
                                    "actividad_avance_metrado": fila.actividad_avance_metrado,
                                    "actividad_avance_costo": fila.actividad_avance_costo,
                                    "actividad_metrados_saldo": fila.actividad_metrados_saldo,
                                    "actividad_metrados_costo_saldo": fila.actividad_metrados_costo_saldo,
                                    "actividad_porcentaje": fila.actividad_porcentaje,
                                    "unidad_medida": fila.unidad_medida,
                                }
                            )

                        }
                       
                        
                    }
                    
                    

                            if(partida.tipo == "partida"){
                                partida.metrado = formato(partida.metrado)
                                partida.costo_unitario = formato(partida.costo_unitario)
                                partida.parcial = formato(partida.parcial)
                                partida.avance_metrado = formato(partida.avance_metrado)
                                partida.avance_costo = formato(partida.avance_costo)
                                partida.metrados_saldo = formato(partida.metrados_saldo)
                                partida.metrados_costo_saldo = formato(partida.metrados_costo_saldo)
                                

                            }
                            else{
                                partida.metrado = null
                                partida.costo_unitario = null
                                partida.parcial = null
                                partida.avance_metrado = null
                                partida.avance_costo = null
                                partida.metrados_saldo = null
                                partida.metrados_costo_saldo = null
                                partida.porcentaje = null

                            }
                        
                            const actividades = partida.actividades
                            for (let k = 0; k < actividades.length; k++) {
                                const actividad = actividades[k];
                                if(actividad.actividad_tipo == "subtitulo"){
                                    actividad.metrado_actividad = formato(actividad.metrado_actividad)
                                    actividad.costo_unitario = formato(actividad.costo_unitario)
                                    actividad.parcial_actividad = formato(actividad.parcial_actividad)
                                    actividad.actividad_avance_metrado = formato(actividad.actividad_avance_metrado)
                                    actividad.actividad_avance_costo = formato(actividad.actividad_avance_costo)
                                    actividad.actividad_metrados_saldo = formato(actividad.actividad_metrados_saldo)
                                    actividad.actividad_metrados_costo_saldo = formato(actividad.actividad_metrados_costo_saldo)
                                    actividad.actividad_porcentaje = formato(actividad.actividad_porcentaje)
    
                                    //asignando estado de mayor metrado a partidda
                                    if(actividad.actividad_estado =="Mayor Metrado"){
                                        partida.estado = "Mayor Metrado"
                                    }

                                }
                                else{
                                    actividad.metrado_actividad = null
                                    actividad.costo_unitario = null
                                    actividad.parcial_actividad = null
                                    actividad.actividad_avance_metrado = null
                                    actividad.actividad_avance_costo = null
                                    actividad.actividad_metrados_saldo = null
                                    actividad.actividad_metrados_costo_saldo = null
                                    actividad.actividad_porcentaje = null
                                    actividad.unidad_medida = null
    
                                }
                               
                            }                                                   
                        
                        
                                                
                    

                        
                                                
                    

                    callback(null,partida);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}

module.exports = userModel;