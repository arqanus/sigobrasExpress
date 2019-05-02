const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')

let userModel = {};
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
var month = new Array();
month[0] = "Enero";
month[1] = "Febrero";
month[2] = "Marzo";
month[3] = "Abril";
month[4] = "Mayo";
month[5] = "Junio";
month[6] = "Julio";
month[7] = "Agosto";
month[8] = "Setiembre";
month[9] = "Octubre";
month[10] = "Noviembre";
month[11] = "Diciembre";

var weekDay = new Array();
weekDay[0] = "Do";
weekDay[1] = "Lu";
weekDay[2] = "Ma";
weekDay[3] = "Mi";
weekDay[4] = "Ju";
weekDay[5] = "Vi";
weekDay[6] = "Sa";

function formato(data){
    
    
    if(data == null){
        return 0
    }
    if(!isNumber(data)){
        return data
    }
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
function formatoAvance(data){
    
    
    if(data == null){
        return 0
    }
    if(!isNumber(data)){
        return data
    }
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
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
          })
    } 

    return data
}
userModel.getComponentes = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT componentes.*  FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida left JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE  partidas.tipo != 'titulo' AND historialactividades.estado IS NULL AND componentes.fichas_id_ficha = ? GROUP BY componentes.id_componente",id_ficha,(error,res)=>{ if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback(null,"vacio");
                    conn.destroy()
                }else{                          
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getPartidas = (id_componente,id_actividad,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partidas.metrado - COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partidas.metrado * partidas.costo_unitario) - (COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / partidas.metrado * 100 * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad, COALESCE(partidas.metrado / partidas.rendimiento, '') partida_duracion, COALESCE(estado_partida.mayorMetrado, FALSE) mayorMetrado, prioridades.valor prioridad_valor, prioridades.color prioridad_color, iconoscategorias.nombre iconocategoria_nombre FROM partidas LEFT JOIN (SELECT partidas.id_partida, TRUE mayorMetrado FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Mayor Metrado' GROUP BY partidas.id_partida) estado_partida ON estado_partida.id_partida = partidas.id_partida left join iconoscategorias on iconoscategorias.id_iconoCategoria = partidas.iconosCategorias_id_iconoCategoria left join prioridades on prioridades.id_prioridad = partidas.prioridades_id_prioridad left join actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN (SELECT historialpartidas.estado, historialpartidas.partidas_id_partida FROM (SELECT MAX(id_historialPartida) id_historialPartida FROM historialpartidas GROUP BY historialpartidas.partidas_id_partida) maximoHistorial LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida) historialPartida ON historialPartida.partidas_id_partida = partidas.id_partida WHERE historialactividades.estado IS NULL AND (partidas.componentes_id_componente = ? OR partidas.id_partida = (SELECT actividades.Partidas_id_partida FROM actividades WHERE actividades.id_actividad = ? LIMIT 1)) GROUP BY partidas.id_partida",[id_componente,id_actividad],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback("vacio");
                    conn.destroy()
                }else{      
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        // fila.iconocategoria_nombre = "MdMonetizationOn"
                        fila.key = i
                        if(fila.tipo=="titulo"){
                            fila.unidad_medida = ""
                            fila.metrado = ""
                            fila.costo_unitario = ""
                            fila.parcial = ""
                            fila.avance_metrado = ""
                            fila.avance_costo = ""
                            fila.metrados_saldo = ""
                            fila.metrados_costo_saldo = ""
                            fila.porcentaje = ""
                            fila.porcentaje_negatividad = ""
                            
                        }else{
                            fila.metrado = formato(fila.metrado)
                            fila.costo_unitario = formato(fila.costo_unitario)
                            fila.parcial = formato(fila.parcial)
                            fila.avance_metrado = formato(fila.avance_metrado)
                            fila.avance_costo = formato(fila.avance_costo)
                            fila.metrados_saldo = formato(fila.metrados_saldo)
                            fila.metrados_costo_saldo = formato(fila.metrados_costo_saldo)
                            fila.porcentaje = Number(formato(fila.porcentaje))
                            
                        }

                        if(fila.partida_duracion!=""){
                            fila.partida_duracion = fila.partida_duracion*480
                            if(fila.partida_duracion < 60){
                                fila.partida_duracion = Math.round(fila.partida_duracion) + "m"
                            }else if(fila.partida_duracion < 480){
                                var horas = Math.trunc(fila.partida_duracion/60)+"h"
                                var minutos = Math.round(fila.partida_duracion%60)+"m"
                                fila.partida_duracion = horas + " "+minutos
                            }else {
                                var dias = Math.trunc(fila.partida_duracion/480)+"d"
                                var residuo_dias = Math.trunc(fila.partida_duracion%480)
                                var horas =  Math.trunc(residuo_dias/60)+"h"
                                var minutos = Math.round(residuo_dias%60)+"m"
                                fila.partida_duracion = dias+" "+horas + " "+minutos
                            }   
                        }
                    }
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getPartidasMayorMetradoAvance= (id_partida,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partida.id_partida, partida.avance_metrado * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, partida.avance_costo * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partida.metrado - COALESCE(partida.avance_metrado, 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partida.metrado * partida.costo_unitario) - (COALESCE(partida.avance_costo, 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, partida.porcentaje * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE (actividades.parcial > 0 OR partidas.tipo = 'titulo') and historialactividades.estado = 'Mayor Metrado' GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0 and historialactividades.estado = 'Mayor Metrado' GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida WHERE partida.id_partida = ?",id_partida,(err,res)=>{
                if(err){
                    console.log(err);
                    callback(err.code);
                }else {      
                    res = res||[]
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        fila.avance_metrado = formato(fila.avance_metrado)
                        fila.avance_costo = formato(fila.avance_costo)
                        fila.metrados_saldo = formato(fila.metrados_saldo)
                        fila.metrados_costo_saldo = formato(fila.metrados_costo_saldo)
                        fila.porcentaje = formato(fila.porcentaje)
                        
                    }
                    callback(null,res[0]);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getActividades = (id_partida,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partida.id_partida, actividades.id_actividad, actividades.tipo actividad_tipo, historialactividades.estado actividad_estado, actividades.nombre nombre_actividad, actividades.veces veces_actividad, actividades.largo largo_actividad, actividades.ancho ancho_actividad, actividades.alto alto_actividad, actividades.parcial metrado_actividad, partida.costo_unitario, actividades.parcial * partida.costo_unitario parcial_actividad, COALESCE(SUM(avanceactividades.valor), 0) actividad_avance_metrado, COALESCE(SUM(avanceactividades.valor *partida.costo_unitario), 0) actividad_avance_costo, actividades.parcial - COALESCE(SUM(avanceactividades.valor), 0) actividad_metrados_saldo, actividades.parcial * partida.costo_unitario- COALESCE(SUM(avanceactividades.valor*partida.costo_unitario), 0)  actividad_metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / actividades.parcial * 100 actividad_porcentaje, TRIM(TRAILING '/DIA' FROM partida.unidad_medida) unidad_medida FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor * partidas.costo_unitario) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 OR partidas.tipo = 'titulo' GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida INNER JOIN actividades ON actividades.Partidas_id_partida = partida.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE partida.id_partida = ? GROUP BY actividades.id_actividad",id_partida,(error,res)=>{ if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback(null,"vacio");
                    conn.destroy()
                }else{      
                    for (let i = 0; i < res.length; i++) {

                        const fila = res[i];
                        if(fila.actividad_tipo =="titulo"){
                            fila.veces_actividad = ""
                            fila.largo_actividad = ""
                            fila.ancho_actividad = ""
                            fila.alto_actividad = ""
                            fila.metrado_actividad = ""
                            fila.costo_unitario = ""
                            fila.parcial_actividad = ""
                            fila.actividad_avance_metrado = ""
                            fila.actividad_avance_costo = ""
                            fila.actividad_metrados_saldo = ""
                            fila.actividad_metrados_costo_saldo = ""
                            fila.actividad_porcentaje = ""
                            fila.unidad_medida = ""
                        }else if(fila.parcial_actividad <0){
                            fila.parcial_actividad = 0
                            fila.actividad_avance_metrado = 0
                            fila.actividad_avance_costo = 0
                            fila.actividad_metrados_saldo = 0
                            fila.actividad_metrados_costo_saldo = 0
                            fila.actividad_porcentaje = 0
                            fila.unidad_medida = 0
                        }else{
                            fila.veces_actividad = formato(fila.veces_actividad)
                            fila.largo_actividad = formato(fila.largo_actividad)
                            fila.ancho_actividad = formato(fila.ancho_actividad)
                            fila.alto_actividad = formato(fila.alto_actividad)
                            fila.metrado_actividad = formato(fila.metrado_actividad )
                            fila.costo_unitario = formato(fila.costo_unitario )                            
                            fila.parcial_actividad = formatoAvance(fila.parcial_actividad )
                            fila.actividad_avance_metrado = formato(fila.actividad_avance_metrado )
                            fila.actividad_avance_costo = formatoAvance(fila.actividad_avance_costo )
                            fila.actividad_metrados_saldo = formato(fila.actividad_metrados_saldo )
                            fila.actividad_metrados_costo_saldo = formato(fila.actividad_metrados_costo_saldo )
                            fila.actividad_porcentaje = formato(fila.actividad_porcentaje )
                        }
                                                
                    }                    
                    callback(null,res);
                    conn.destroy()
                }                
                
            })
        }
        
                
    })
}
userModel.getComponentesPNuevas = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT componentes.* FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Partida Nueva' AND componentes.fichas_id_ficha = ? GROUP BY componentes.id_componente",id_ficha,(error,res)=>{ 
                if(error){
                    callback(error);
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
userModel.getPartidasPNuevas = (id_componente,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partidas.metrado - COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partidas.metrado * partidas.costo_unitario) - (COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / partidas.metrado * 100 * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad, COALESCE(partidas.metrado / partidas.rendimiento, '') partida_duracion, COALESCE(estado_partida.mayorMetrado, FALSE) mayorMetrado, prioridades.valor prioridad_valor, prioridades.color prioridad_color, iconoscategorias.nombre iconocategoria_nombre FROM partidas LEFT JOIN (SELECT partidas.id_partida, TRUE mayorMetrado FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Mayor Metrado' GROUP BY partidas.id_partida) estado_partida ON estado_partida.id_partida = partidas.id_partida LEFT JOIN iconoscategorias ON iconoscategorias.id_iconoCategoria = partidas.iconosCategorias_id_iconoCategoria LEFT JOIN prioridades ON prioridades.id_prioridad = partidas.prioridades_id_prioridad LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN (SELECT historialpartidas.estado, historialpartidas.partidas_id_partida FROM (SELECT MAX(id_historialPartida) id_historialPartida FROM historialpartidas GROUP BY historialpartidas.partidas_id_partida) maximoHistorial LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida) historialPartida ON historialPartida.partidas_id_partida = partidas.id_partida WHERE historialactividades.estado = 'Partida Nueva' AND partidas.componentes_id_componente = ? GROUP BY partidas.id_partida",id_componente,(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback(null,"vacio");
                    conn.destroy()
                }else{    
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        // fila.iconocategoria_nombre = "MdMonetizationOn"
                        if(fila.tipo=="titulo"){
                            fila.unidad_medida = ""
                            fila.metrado = ""
                            fila.costo_unitario = ""
                            fila.parcial = ""
                            fila.avance_metrado = ""
                            fila.avance_costo = ""
                            fila.metrados_saldo = ""
                            fila.metrados_costo_saldo = ""
                            fila.porcentaje = ""
                            fila.porcentaje_negatividad = ""
                            
                        }else{
                            fila.metrado = formato(fila.metrado)
                            fila.costo_unitario = formato(fila.costo_unitario)
                            fila.parcial = formato(fila.parcial)
                            fila.avance_metrado = formato(fila.avance_metrado)
                            fila.avance_costo = formato(fila.avance_costo)
                            fila.metrados_saldo = formato(fila.metrados_saldo)
                            fila.metrados_costo_saldo = formato(fila.metrados_costo_saldo)
                            fila.porcentaje = Number(formato(fila.porcentaje))
                            
                        }

                        if(fila.partida_duracion!=""){
                            fila.partida_duracion = fila.partida_duracion*480
                            if(fila.partida_duracion < 60){
                                fila.partida_duracion = Math.round(fila.partida_duracion) + "m"
                            }else if(fila.partida_duracion < 480){
                                var horas = Math.trunc(fila.partida_duracion/60)+"h"
                                var minutos = Math.round(fila.partida_duracion%60)+"m"
                                fila.partida_duracion = horas + " "+minutos
                            }else {
                                var dias = Math.trunc(fila.partida_duracion/480)+"d"
                                var residuo_dias = Math.trunc(fila.partida_duracion%480)
                                var horas =  Math.trunc(residuo_dias/60)+"h"
                                var minutos = Math.round(residuo_dias%60)+"m"
                                fila.partida_duracion = dias+" "+horas + " "+minutos
                            }   
                        }
                    }
                    callback(null,res);
                    conn.destroy()  

                    
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getActividadesPNuevas = (id_partida,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partida.id_partida, actividades.id_actividad, actividades.tipo actividad_tipo, historialactividades.estado actividad_estado, actividades.nombre nombre_actividad, actividades.veces veces_actividad, actividades.largo largo_actividad, actividades.ancho ancho_actividad, actividades.alto alto_actividad, actividades.parcial metrado_actividad, partida.costo_unitario, actividades.parcial * partida.costo_unitario parcial_actividad, COALESCE(SUM(avanceactividades.valor), 0) actividad_avance_metrado, COALESCE(SUM(avanceactividades.valor * partida.costo_unitario), 0) actividad_avance_costo, actividades.parcial - COALESCE(SUM(avanceactividades.valor), 0) actividad_metrados_saldo, actividades.parcial * partida.costo_unitario - COALESCE(SUM(avanceactividades.valor * partida.costo_unitario), 0) actividad_metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / actividades.parcial * 100 actividad_porcentaje, TRIM(TRAILING '/DIA' FROM partida.unidad_medida) unidad_medida FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor * partidas.costo_unitario) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 OR partidas.tipo = 'titulo' GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida INNER JOIN actividades ON actividades.Partidas_id_partida = partida.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Partida Nueva' and partida.id_partida = ? GROUP BY actividades.id_actividad",id_partida,(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback(null,"vacio");
                    conn.destroy()
                }else{  
                    for (let i = 0; i < res.length; i++) {

                        const fila = res[i];
                        if(fila.actividad_tipo =="titulo"){
                            fila.veces_actividad = ""
                            fila.largo_actividad = ""
                            fila.ancho_actividad = ""
                            fila.alto_actividad = ""
                            fila.metrado_actividad = ""
                            fila.costo_unitario = ""
                            fila.parcial_actividad = ""
                            fila.actividad_avance_metrado = ""
                            fila.actividad_avance_costo = ""
                            fila.actividad_metrados_saldo = ""
                            fila.actividad_metrados_costo_saldo = ""
                            fila.actividad_porcentaje = ""
                            fila.unidad_medida = ""
                        }else if(fila.parcial_actividad <0){
                            fila.parcial_actividad = 0
                            fila.actividad_avance_metrado = 0
                            fila.actividad_avance_costo = 0
                            fila.actividad_metrados_saldo = 0
                            fila.actividad_metrados_costo_saldo = 0
                            fila.actividad_porcentaje = 0
                            fila.unidad_medida = 0
                        }else{
                            fila.veces_actividad = formato(fila.veces_actividad)
                            fila.largo_actividad = formato(fila.largo_actividad)
                            fila.ancho_actividad = formato(fila.ancho_actividad)
                            fila.alto_actividad = formato(fila.alto_actividad)
                            fila.metrado_actividad = formato(fila.metrado_actividad )
                            fila.costo_unitario = formato(fila.costo_unitario )                            
                            fila.parcial_actividad = formatoAvance(fila.parcial_actividad )
                            fila.actividad_avance_metrado = formato(fila.actividad_avance_metrado )
                            fila.actividad_avance_costo = formatoAvance(fila.actividad_avance_costo )
                            fila.actividad_metrados_saldo = formato(fila.actividad_metrados_saldo )
                            fila.actividad_metrados_costo_saldo = formato(fila.actividad_metrados_costo_saldo )
                            fila.actividad_porcentaje = formato(fila.actividad_porcentaje )
                        }
                                                
                    }                    
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}

userModel.getValGeneralTodosComponentes = (id_ficha,fecha_inicial,fecha_final,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT partidas.tipo, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario precio_parcial, periodo_anterior.metrado metrado_anterior, periodo_anterior.valor valor_anterior, periodo_anterior.porcentaje porcentaje_anterior, periodo_actual.metrado metrado_actual, periodo_actual.valor valor_actual, periodo_actual.porcentaje porcentaje_actual, COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0) metrado_total, COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0) valor_total, (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) porcentaje_total, partidas.metrado - (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) metrado_saldo, partidas.metrado * costo_unitario - COALESCE(periodo_anterior.valor, 0) - COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - COALESCE(periodo_anterior.porcentaje, 0) - COALESCE(periodo_actual.porcentaje, 0) porcentaje_saldo FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, CAST(SUM(avanceactividades.valor) AS DECIMAL (15 , 3 )) * costo_unitario valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_anterior ON periodo_anterior.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, CAST(SUM(avanceactividades.valor) AS DECIMAL (15 , 3 )) * costo_unitario valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_actual ON periodo_actual.id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? ORDER BY partidas.id_partida",[fecha_inicial,fecha_inicial,fecha_final,id_ficha],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");
                    
                    callback(null,"vacio");
                    conn.destroy()
                
                }else{
                    var valor_anterior  = 0                    
                    var valor_actual  = 0                    
                    var valor_total = 0                    
                    var valor_saldo  = 0

                    var precio_parcial = 0
                    
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];

                        valor_anterior +=  fila.valor_anterior 
                        valor_actual += fila.valor_actual 
                        valor_total += fila.valor_total 
                        valor_saldo += fila.valor_saldo 
                        
                        porcentaje_anterior +=  fila.porcentaje_anterior 
                        porcentaje_actual += fila.porcentaje_actual 
                        porcentaje_total += fila.porcentaje_total 
                        porcentaje_saldo += fila.porcentaje_saldo 

                        precio_parcial += fila.precio_parcial

                        if(fila.tipo == "titulo"){
                            fila.metrado  = ""
                            fila.costo_unitario  = ""
                            fila.precio_parcial  = ""
                            fila.metrado_anterior  = ""
                            fila.valor_anterior  = ""
                            fila.porcentaje_anterior  = ""
                            fila.metrado_actual  = ""
                            fila.valor_actual  = ""
                            fila.porcentaje_actual  = ""
                            fila.metrado_total = ""
                            fila.valor_total = ""
                            fila.porcentaje_total = ""
                            fila.metrado_saldo  = ""
                            fila.valor_saldo  = ""
                            fila.porcentaje_saldo = ""

                        }
                    }
          
                    callback(null,
                        {
                            "valor_anterior":tools.formatoSoles(valor_anterior),
                            "valor_actual":tools.formatoSoles(valor_actual ),
                            "valor_total":tools.formatoSoles(valor_total ),
                            "valor_saldo":tools.formatoSoles(valor_saldo ),
                            "precio_parcial":tools.formatoSoles(precio_parcial),
                            "porcentaje_anterior":tools.formatoSoles(valor_anterior/precio_parcial*100),
                            "porcentaje_actual":tools.formatoSoles(valor_actual/precio_parcial*100),
                            "porcentaje_total":tools.formatoSoles(valor_total/precio_parcial*100),
                            "porcentaje_saldo":tools.formatoSoles(valor_saldo/precio_parcial*100),
                            "partidas":res
                        }
                    );
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}

//recursos
userModel.getActividadesDuracion = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }else{
            conn.query('/******** 02.04.06 Consulta de actividades por tiempo *************/ SELECT item, descripcion, actividades.nombre nombre_actividad, (parcial / rendimiento) duracion_dia, (parcial / rendimiento) * 480 duracion FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE fichas.id_ficha = ? AND (parcial / rendimiento) IS NOT NULL AND (parcial / rendimiento) > 0 ORDER BY (parcial / rendimiento) ASC',id_ficha,(err,res)=>{ 
                if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback(null,"vacio");
                }else{  
                                                                      
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        // fila.duracion_real = fila.duracion
                        if(fila.duracion < 60){
                            fila.duracion = formato(fila.duracion) + "min"
                        }else if(fila.duracion < 480){
                            var horas = Math.trunc(fila.duracion/60)+"h"
                            var minutos = formato(fila.duracion%60)+"min"
                            fila.duracion = horas + " "+minutos
                        }else {
                            var dias = Math.trunc(fila.duracion/480)+"d"
                            var residuo_dias = Math.trunc(fila.duracion%480)
                            var horas =  Math.trunc(residuo_dias/60)+"h"
                            var minutos = formato(residuo_dias%60)+"min"
                            fila.duracion = dias+" "+horas + " "+minutos
                        }   
                        res[i].duracion_dia =formato(res[i].duracion_dia)
                                              
                        
                    }                   
                                                
                    

                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getMaterialesPorObra = (id_ficha,callback)=>{
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }else{
            conn.query('SELECT recursos.descripcion, recursos.unidad, SUM(cuadrilla) cuadrilla_total, SUM(cantidad) cantidad_total, SUM(precio) precio_total, SUM(recursos.parcial) parcial_total FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida WHERE id_ficha = ? GROUP BY descripcion ORDER BY recursos.descripcion',id_ficha,(err,res)=>{ 
                if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback(null,"vacio");
                    conn.destroy()
                }else{ 
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];                 
                        fila.cuadrilla_total = formato(fila.cuadrilla_total)
                        fila.cantidad_total = formato(fila.cantidad_total)
                        fila.precio_total = formato(fila.precio_total)
                        fila.parcial_total = formato(fila.parcial_total)
                        
                    } 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getPrioridades  = (callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
            conn.destroy()
        }        
        else{
            conn.query("select * from prioridades",(err,res)=>{ 
                if(err){
                    console.log(err);                    
                    callback(err.code);                 
                }
                else if(res.length == 0){
                    callback(null,"vacio");    
                    conn.destroy()    
                }else{   
                    callback(null,res);
                    conn.destroy()
                }
            })
        }
        
                
    })
}
userModel.getIconoscategorias  = (callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
            conn.destroy()
        }        
        else{
            conn.query("select * from iconoscategorias",(err,res)=>{ 
                if(err){
                    console.log(err);                    
                    callback(err.code);                 
                }
                else if(res.length == 0){
                    callback(null,"vacio");    
                    conn.destroy()    
                }else{   
                    callback(null,res);
                    conn.destroy()
                }
            })
        }
        
                
    })
}
module.exports = userModel;
