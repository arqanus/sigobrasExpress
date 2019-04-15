const pool = require('../../../../db/connection');
let userModel = {};
function rome(N,s,b,a,o,t){
    t=N/1e3|0;N%=1e3;
    for(s=b='',a=5;N;b++,a^=7)
      for(o=N%a,N=N/a^0;o--;)
        s='IVXLCDM'.charAt(o>2?b+N-(N&=~1)+(o=1):b)+s;
    return Array(t+1).join('M')+s;
}
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
function formatoValorizaciones(data){
    
    
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
        return "-"
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
function shortDate(fecha){
    return (fecha.getFullYear()+"-"+('0' + (fecha.getMonth()+1)).slice(-2) + '-'+('0' + fecha.getDate()).slice(-2))
}
function getDaysInMonth( dia_final) {
    var dia= 1
    var days = []
    var yarray = []
     while (dia <= dia_final) {
        days.push(dia);
        
        
        
        if(dia <= (new Date()).getDate()){
            yarray.push(0)
        }
        dia++
        
     }
     return (
         {
            "xarray":days,
            "yarray":yarray
         }
     );
}
function regresionLineal(data){
        var
        xarray = data.xarray,
        yarray = data.yarray,
        x = y = xy = xx = a = b = resultado = 0,
        cantidad = yarray.length
        cantidadx = xarray.length
        var y2=[]
    if(cantidad == 1){
        return y2
    }
        
        
        
    for (i = 0; i < cantidad; i++) {
        
        x += xarray[i];
        y += yarray[i];
        xy += xarray[i]*yarray[i];
        xx += xarray[i]*xarray[i];
    }
    console.log(x,y,xy,xx);
    console.log(((cantidad * xx) - (x * x)));
    
    b = ((cantidad * xy) - (x * y)) / ((cantidad * xx) - (x * x));

    a = (y - (b * x)) / cantidad;
    console.log("a ",a," b ",b);
    
    for (let i = 0; i < cantidadx; i++) {
        y2.push(
            a + (b * xarray[i])
        )
    }
    return y2
  
}

userModel.getPartidasCompletas = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT componentes.id_componente, componentes.numero, componentes.nombre, partida.id_partida, partida.tipo, partida.item, partida.descripcion, TRIM(BOTH '/DIA' FROM partida.unidad_medida)unidad_medida, partida.metrado, partida.costo_unitario, partida.parcial, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)*COALESCE(partida.avance_metrado ,0) avance_metrado, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)*COALESCE(partida.avance_costo ,0) avance_costo, partida.metrado - (partida.avance_metrado*(COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_saldo, partida.parcial - (partida.avance_metrado * partida.costo_unitario*(COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(partida.porcentaje ,0)*(COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, actividad.id_actividad, actividad.tipo actividad_tipo, actividad.estado actividad_estado, actividad.nombre actividad_nombre, actividad.veces, actividad.largo, actividad.ancho, actividad.alto, actividad.metrado_actividad, partida.costo_unitario, actividad.metrado_actividad * partida.costo_unitario parcial_actividad, actividad.actividad_avance_metrado, actividad.actividad_avance_metrado * partida.costo_unitario actividad_avance_costo, actividad.metrado_actividad - actividad.actividad_avance_metrado actividad_metrados_saldo, (actividad.metrado_actividad - actividad.actividad_avance_metrado) * partida.costo_unitario actividad_metrados_costo_saldo, (actividad.actividad_avance_metrado / actividad.metrado_actividad) * 100 actividad_porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad_ajustado FROM componentes INNER JOIN (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, IF(SUM(avanceactividades.valor) IS NULL, 0, SUM(avanceactividades.valor)) avance_metrado, SUM(avanceactividades.valor) * partidas.costo_unitario avance_costo, (SUM(avanceactividades.valor) / partidas.metrado) * 100 porcentaje FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY partidas.id_partida) partida ON partida.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT historialpartidas.estado, historialpartidas.partidas_id_partida FROM (SELECT MAX(id_historialPartida) id_historialPartida FROM historialpartidas GROUP BY historialpartidas.partidas_id_partida) maximoHistorial LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida) historialPartida ON historialPartida.partidas_id_partida = partida.id_partida LEFT JOIN (SELECT Partidas_id_partida, id_actividad, tipo, historialactividades.estado, nombre, veces, largo, ancho, alto, parcial metrado_actividad, IF(SUM(avanceactividades.valor) IS NULL, 0, SUM(avanceactividades.valor)) actividad_avance_metrado FROM actividades LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad GROUP BY actividades.id_actividad) actividad ON actividad.Partidas_id_partida = partida.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida)parcial_positivo on parcial_positivo.id_partida = partida.id_partida left join (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida)parcial_negativo on parcial_negativo.id_partida = partida.id_partida WHERE componentes.Fichas_id_ficha = ? AND historialPartida.estado IS NULL AND componentes.id_componente IS NOT NULL ORDER BY componentes.id_componente , partida.id_partida , actividad.id_actividad",id_ficha,(error,res)=>{
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback(null,"vacio");
                }else{
                    var componentes=[]
                    var componente = {}
                    var lastIdComponente = -1
                    var lastIdPartida = -1
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if(fila.id_componente != lastIdComponente){
                            if(i != 0){
                                componentes.push(componente)
                                componente = {}
                            }
                            

                            componente.id_componente = fila.id_componente
                            componente.numero = fila.numero
                            componente.nombre = fila.nombre
                            componente.partidas = [
                                {
                                   "id_partida": fila.id_partida,
                                    "tipo":fila.tipo,
                                    "estado":null,
                                    "item":fila.item,
                                    "descripcion": fila.descripcion,
                                    "unidad_medida": fila.unidad_medida,
                                    "metrado": fila.metrado,
                                    "costo_unitario": fila.costo_unitario,
                                    "parcial": fila.parcial,
                                    "avance_metrado": fila.avance_metrado,
                                    "avance_costo": fila.avance_costo,
                                    "metrados_saldo": fila.metrados_saldo,
                                    "metrados_costo_saldo": fila.metrados_costo_saldo,
                                    "porcentaje": fila.porcentaje,
                                    "actividades":[
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
                                }                               
                                
                            ]                           

                        }else{
                            if(fila.id_partida != lastIdPartida){
                                //nueva partida
                                var partida = {
                                    "id_partida": fila.id_partida,
                                    "tipo":fila.tipo,
                                    "estado":null,
                                    "item":fila.item,
                                    "descripcion": fila.descripcion,
                                    "unidad_medida": fila.unidad_medida,
                                    "metrado": fila.metrado,
                                    "costo_unitario": fila.costo_unitario,
                                    "parcial": fila.parcial,
                                    "avance_metrado": fila.avance_metrado,
                                    "avance_costo": fila.avance_costo,
                                    "metrados_saldo": fila.metrados_saldo,
                                    "metrados_costo_saldo": fila.metrados_costo_saldo,
                                    "porcentaje": fila.porcentaje,
                                    "actividades":[
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
                                }
                                componente.partidas.push(partida)
                            }else{
                                //si es la misma partida
                                var actividad=
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
                                componente.partidas[componente.partidas.length-1].actividades.push(actividad)

                                

                            }

                        }
                        lastIdComponente = fila.id_componente
                        lastIdPartida = fila.id_partida

                        
                    }
                    componentes.push(componente)
                    //
                    for (let i = 0; i < componentes.length; i++) {
                        const partidas = componentes[i].partidas;
                        for (let j = 0; j < partidas.length; j++) {
                            const partida = partidas[j];
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
                        }
                        
                                                
                    }

                    
                    callback(null,componentes);
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
            conn.query("SELECT id_componente,numero,nombre from componentes where componentes.fichas_id_ficha=?",id_ficha,(error,res)=>{ if(error){
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
userModel.getPartidas = (id_componente,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partidas.id_partida,partidas.prioridad, partidas.tipo, partidas.item, partidas.descripcion, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, COALESCE(SUM(avanceactividades.valor),0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario),0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partidas.metrado - COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partidas.metrado * partidas.costo_unitario) - (COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor),0) / partidas.metrado * 100 * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad, COALESCE(partidas.metrado / partidas.rendimiento, '') partida_duracion FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN (SELECT historialpartidas.estado, historialpartidas.partidas_id_partida FROM (SELECT MAX(id_historialPartida) id_historialPartida FROM historialpartidas GROUP BY historialpartidas.partidas_id_partida) maximoHistorial LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida) historialPartida ON historialPartida.partidas_id_partida = partidas.id_partida WHERE historialactividades.estado IS NULL AND partidas.componentes_id_componente = ? GROUP BY partidas.id_partida",id_componente,(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback(null,"vacio");
                    conn.destroy()
                }else{      
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
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
                            fila.porcentaje = formato(fila.porcentaje)
                            
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
                    res = res||{}
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
                            fila.parcial_actividad = formato(fila.parcial_actividad )
                            fila.actividad_avance_metrado = formato(fila.actividad_avance_metrado )
                            fila.actividad_avance_costo = formato(fila.actividad_avance_costo )
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
            conn.query("SELECT id_componente, numero, nombre,historialpartidas.estado FROM componentes left join partidas on partidas.componentes_id_componente = componentes.id_componente left join historialpartidas on historialpartidas.partidas_id_partida = partidas.id_partida WHERE historialpartidas.estado = 'PartidaNueva' and componentes.fichas_id_ficha = ? group by componentes.id_componente",id_ficha,(error,res)=>{ 
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
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partida.id_partida, partida.tipo, partida.item, partida.descripcion, TRIM(BOTH '/DIA' FROM partida.unidad_medida) unidad_medida, partida.metrado, partida.costo_unitario, partida.parcial, partida.avance_metrado * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, partida.avance_costo * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partida.metrado - COALESCE(partida.avance_metrado, 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partida.metrado * partida.costo_unitario) - (COALESCE(partida.avance_costo, 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, partida.porcentaje * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad, COALESCE(partida.metrado / partida.rendimiento, '') partida_duracion FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor) / partidas.metrado * 100 porcentaje, partidas.rendimiento FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partida.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida LEFT JOIN (SELECT historialpartidas.estado, historialpartidas.partidas_id_partida FROM (SELECT MAX(id_historialPartida) id_historialPartida FROM historialpartidas GROUP BY historialpartidas.partidas_id_partida) maximoHistorial LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida) historialPartida ON historialPartida.partidas_id_partida = partida.id_partida WHERE partida.componentes_id_componente = ? AND historialpartida.estado ='PartidaNueva'",id_componente,(error,res)=>{ 
                if(error){
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
userModel.getActividadesPNuevas = (id_partida,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partida.id_partida, actividades.id_actividad, actividades.tipo actividad_tipo, historialactividades.estado actividad_estado, actividades.nombre actividad_nombre, actividades.veces, actividades.largo, actividades.ancho, actividades.alto, actividades.parcial metrado_actividad, partida.costo_unitario, actividades.parcial * partida.costo_unitario parcial_actividad, COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) actividad_avance_metrado, COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * partida.costo_unitario actividad_avance_costo, actividades.parcial - COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) actividad_metrados_saldo, (actividades.parcial - COALESCE(SUM(avanceactividades.valor), 0)) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * partida.costo_unitario actividad_metrados_costo_saldo, (COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) / actividades.parcial) * 100 actividad_porcentaje, TRIM(TRAILING '/DIA' FROM partida.unidad_medida) unidad_medida FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor * partidas.costo_unitario) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 OR partidas.tipo = 'titulo' GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida INNER JOIN actividades ON actividades.Partidas_id_partida = partida.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad where partida.id_partida = ? GROUP BY actividades.id_actividad",id_partida,(error,res)=>{ 
                if(error){
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
//historial
userModel.getHistorial = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT componentes.id_componente, componentes.numero, componentes.nombre nombre_componente, partidas.item, partidas.descripcion descripcion_partida, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, actividades.nombre nombre_actividad, avanceactividades.descripcion descripcion_actividad, avanceactividades.observacion, DATE(avanceactividades.fecha) fecha, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * avanceactividades.valor valor, partidas.costo_unitario, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * avanceactividades.valor * partidas.costo_unitario parcial, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * avanceactividades.valor * partidas.costo_unitario/tb_presupuesto.presupuesto *100 porcentaje FROM fichas LEFT JOIN (SELECT componentes.fichas_id_ficha id_ficha, SUM(presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida RIGHT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE componentes.Fichas_id_ficha = ? ORDER BY componentes.id_componente , avanceactividades.fecha DESC , partidas.id_partida",id_ficha,(err,res)=>{
                if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    console.log("vacio");
                    callback(null,"vacio");
                }else{                    
                    // console.log("res",res); 
                    var lastIdComponente = -1
                    var componentes = []
                    var componente = {}
                    var componente_total_soles = 0
                    var fecha_total_soles = 0
                    var componente_total_porcentaje = 0
                    var fecha_total_porcentaje = 0
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        
                        fila.fecha = fila.fecha.getDate()+" de "+month[fila.fecha.getMonth()]+" del "+fila.fecha.getFullYear()
                     

                        if(fila.id_componente != lastIdComponente){
                            if(i != 0 ){
                                componente.componente_total_soles = formato(componente_total_soles)
                               
                                componente.componente_total_porcentaje = formato(componente_total_porcentaje)

                                componente.fechas[componente.fechas.length-1].fecha_total_soles = formato(fecha_total_soles)

                            
                                componente.fechas[componente.fechas.length-1].fecha_total_porcentaje = formato(fecha_total_porcentaje)

                                componentes.push(componente);
                                componente = {}
                                componente_total_soles = 0
                                fecha_total_soles = 0
                                componente_total_porcentaje = 0
                                fecha_total_porcentaje = 0
                            }   
                            

                            
                            componente.id_componente = fila.id_componente
                            componente.numero = fila.numero
                            componente.nombre_componente = fila.nombre_componente
                            componente.componente_total_soles = 9999
                            componente.componente_total_porcentaje = 9999
                            componente.fechas = [
                                {
                                    "fecha": fila.fecha,
                                    
                                    "fecha_total_soles":9999,
                                    "fecha_total_porcentaje":9999,
                                    "historial":[
                                        {
                                            "item" : fila.item,
                                            "descripcion_partida" : fila.descripcion_partida,
                                            "unidad_medida":fila.unidad_medida,
                                            "nombre_actividad" : fila.nombre_actividad,
                                            "descripcion_actividad" : fila.descripcion_actividad,
                                            "observacion":fila.observacion,                 
                                            "valor":formato(fila.valor),
                                            "costo_unitario":fila.costo_unitario,
                                            "parcial":formato( fila.parcial),
                                            "saldo":fila.saldo
                                        }
                                    ]
                                }
                                
                            ]  
                                          
                            
                        }
                        else{
                            if(fila.fecha != lastFecha){
                                componente.fechas[componente.fechas.length-1].fecha_total_soles = formato(fecha_total_soles)
                                fecha_total_soles=0
                                componente.fechas[componente.fechas.length-1].fecha_total_porcentaje = formato(fecha_total_porcentaje)
                                fecha_total_porcentaje=0
                                componente.fechas.push(
                                    {
                                        "fecha": fila.fecha,                                        
                                        "fecha_total_soles":9999,
                                        "fecha_total_porcentaje":9999,
                                        "historial":[
                                            {
                                                "item" : fila.item,
                                                "descripcion_partida" : fila.descripcion_partida,
                                                "unidad_medida":fila.unidad_medida,
                                                "nombre_actividad" : fila.nombre_actividad,
                                                "descripcion_actividad" : fila.descripcion_actividad,
                                                "observacion":fila.observacion,                 
                                                "valor":formato(fila.valor),
                                                "costo_unitario":fila.costo_unitario,
                                                "parcial":formato( fila.parcial),
                                                "saldo":fila.saldo
                                            }
                                        ]
                                    }
                                    
                                )   
                                fecha_total_soles = 0
                            }else{
                                componente.fechas[componente.fechas.length-1].historial.push(
                                    {
                                        "item" : fila.item,
                                        "descripcion_partida" : fila.descripcion_partida,
                                        "nombre_actividad" : fila.nombre_actividad,
                                        "unidad_medida":fila.unidad_medida,
                                        "descripcion_actividad" : fila.descripcion_actividad,
                                        "observacion":fila.observacion,                 
                                        "valor":formato(fila.valor),
                                        "costo_unitario":fila.costo_unitario,
                                        "parcial":formato( fila.parcial),
                                        "saldo":fila.saldo
                                    }
                                )
                            }
                                                     

                        }
                        componente_total_soles +=fila.parcial
                        fecha_total_soles +=fila.parcial  
                        componente_total_porcentaje +=fila.porcentaje
                        fecha_total_porcentaje +=fila.porcentaje 
                        
                        lastIdComponente = fila.id_componente
                        lastFecha = fila.fecha

                        
                    }

                    componente.componente_total_soles = formato(componente_total_soles)
                  
                    componente.componente_total_porcentaje = formato(componente_total_porcentaje)

                    componente.fechas[componente.fechas.length-1].fecha_total_soles = formato(fecha_total_soles)
              
                    componente.fechas[componente.fechas.length-1].fecha_total_porcentaje = formato(fecha_total_porcentaje)

                    componentes.push(componente);
                    
                    callback(null,componentes);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getHistorialComponentes = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('/*************** por componentes********************/ SELECT componentes.id_componente,componentes.numero, componentes.presupuesto, componentes.nombre nombre_componente, SUM(avanceactividades.valor * partidas.costo_unitario) comp_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100  porcentaje_avance_componentesa FROM fichas left JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ? GROUP BY componentes.id_componente ',id_ficha,(err,res)=>{
                 if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    console.log("vacio");
                    callback(null,"vacio");
                }else{                    
                    
                    
                    
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getHistorialFechas = (id_componente,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("select partidas.componentes_id_componente id_componente, DATE_FORMAT(fecha, '%d-%m-%Y') AS fecha ,sum(valor*costo_unitario) fecha_avance from partidas left join actividades on actividades.Partidas_id_partida = partidas.id_partida inner join avanceactividades on avanceactividades.Actividades_id_actividad=actividades.id_actividad GROUP BY date(avanceactividades.fecha)",id_componente,(err,res)=>{
                 if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    
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
userModel.getHistorialFechasHistorial = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('/*************** por componentes********************/ SELECT componentes.numero, componentes.presupuesto, componentes.nombre nombre_componente, SUM(avanceactividades.valor * partidas.costo_unitario) comp_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100  porcentaje_avance_componentesa FROM fichas left JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ? GROUP BY componentes.id_componente ',id_ficha,(err,res)=>{
                 if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    console.log("vacio");
                    callback(null,"vacio");
                }else{                    
                    
                    
                    
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getHistorialRegresionLineal = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            

            conn.query("/*********avance por dia***************/ SELECT id_ficha, date_format(avanceactividades.fecha,'%Y-%m-%d') fecha, SUM(valor * costo_unitario) avance FROM fichas left join componentes on componentes.fichas_id_ficha= fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida inner JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE month(avanceactividades.fecha) = month(now()) and fichas.id_ficha = ? GROUP BY fichas.id_ficha, date_format(avanceactividades.fecha,'%Y-%m-%d') ",id_ficha,(err,res)=>{
                 if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    console.log("vacio");
                    callback(null,"vacio");
                }else{      
                    
                    var lastDay = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
                    var fechasData = getDaysInMonth(lastDay)
                    var dias = []
                    var avances1 = []
                    var fecha_actual = false
                    
                    for (let i = 0; i < res.length; i++) {
                        var dia1 = res[i].fecha.split("-");;
                        dia1 = dia1[2]                        
                        
                        for (let j = 0; j < fechasData.yarray.length; j++) {
                            const dia2 = fechasData.xarray[j];
                            if(dia1==dia2){
                                
                                
                                fechasData.yarray[j] = res[i].avance
                                break;
                            }
                            
                        }
                       
                    } 
                    
                    fechasData.regresion = regresionLineal(fechasData)
                    
                    
                    callback(null,
                        fechasData);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}



userModel.getValGeneral = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT t1.Fichas_id_ficha, t1.id_historialEstado, t1.id_periodo, t1.numero_periodo, t1.numero, t1.id_componente, t1.nombre, t1.presupuesto, 0 valor_total_anterior, 0 valor_total_actual, 0 valor_suma_acumulado, 0 valor_total_saldo, t1.id_partida, t1.tipo, t1.item, t1.descripcion, t1.unidad_medida, t1.metrado, t1.costo_unitario, t1.costo_unitario * t1.metrado parcial, 0 metrado_anterior, 0 valor_anterior, 0 porcentaje_anterior, t2.metrado_actual, t2.valor_actual, t2.porcentaje_actual, 0 metrado_total, 0 valor_total, 0 porcentaje_total, 0 metrado_saldo, 0 valor_saldo, 0 porcentaje_saldo FROM (SELECT periodo.id_periodo, periodo.id_historialEstado, (CONCAT(periodo.codigo, periodo.numero)) numero_periodo, componentes.fichas_id_ficha, componentes.numero, componentes.id_componente, componentes.nombre, componentes.presupuesto, partida.id_partida, partida.tipo, partida.item, partida.unidad_medida, partida.descripcion, partida.metrado, partida.costo_unitario, partida.metrado * partida.costo_unitario parcial FROM componentes INNER JOIN (SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.unidad_medida, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.componentes_id_componente FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL GROUP BY partidas.id_partida) partida ON partida.componentes_id_componente = componentes.id_componente CROSS JOIN (SELECT TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1 numero, estados.codigo codigo, historialestados.id_historialEstado, CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE historialestados.Fichas_id_ficha = ?) periodo) t1 LEFT JOIN (SELECT periodo.id_periodo, componentes.id_componente, partidas.id_partida, SUM(avanceactividades.valor) metrado_actual, SUM(avanceactividades.valor * partidas.costo_unitario) valor_actual, (SUM(avanceactividades.valor) / partidas.metrado) * 100 porcentaje_actual FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad INNER JOIN (SELECT CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo, historialestados.id_historialestado FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) periodo ON periodo.id_historialEstado = avanceactividades.historialEstados_id_historialEstado GROUP BY periodo.id_periodo , partidas.id_partida) t2 ON t1.id_periodo = t2.id_periodo AND t1.id_componente = t2.id_componente AND t1.id_partida = t2.id_partida WHERE t1.numero IS NOT NULL AND t1.Fichas_id_ficha = ? ORDER BY t1.id_historialEstado , t1.id_partida",[id_ficha,id_ficha],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");
                    
                    callback(null,"vacio");
                
                }else{
                    var periodos = []
                    var periodo = {}                    
                    var lastIdPeriodo = -1
                    var lastIdComponente = -1
                    var lastIdPartida = -1
                    var valor_total_actual=0
                    //se estructuran los datos
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];

                        //variables temporales
                        valor_total_actual+=fila.valor_actual                    
                        

                        if(fila.id_periodo != lastIdPeriodo){
                            if(i != 0){
                                periodos.push(periodo)
                                periodo = {}
                                valor_total_actual = 0
                            }
                            
                            
                            //insercion de datos
                            periodo.id_periodo = fila.id_periodo
                            periodo.numero_periodo = fila.numero_periodo
                            periodo.componentes=[
                                {
                                    "componente_numero": fila.numero,
                                    "id_componente": fila.id_componente,
                                    "nombre":fila.nombre,
                                    "presupuesto":fila.presupuesto,
                                    "valor_total_anterior":fila.valor_total_anterior,
                                    "valor_total_actual":valor_total_actual,
                                    "valor_suma_acumulado":fila.valor_suma_acumulado,
                                    "valor_total_saldo": fila.valor_total_saldo,
                                    "partidas":[
                                        {
                                            "tipo":fila.tipo,
                                            "item":fila.item,
                                            "descripcion":fila.descripcion,
                                            "unidad_medida":fila.unidad_medida,
                                            "metrado":fila.metrado,
                                            "costo_unitario":fila.costo_unitario,
                                            "parcial":fila.parcial,
                                            "metrado_anterior":fila.metrado_anterior,
                                            "valor_anterior":fila.valor_anterior,
                                            "porcentaje_anterior":fila.porcentaje_anterior,
                                            "metrado_actual":fila.metrado_actual,
                                            "valor_actual":fila.valor_actual,
                                            "porcentaje_actual":fila.porcentaje_actual,
                                            "metrado_total":fila.metrado_total,
                                            "valor_total":fila.valor_total,
                                            "porcentaje_total":fila.porcentaje_total,
                                            "metrado_saldo":fila.metrado_saldo,
                                            "valor_saldo":fila.valor_saldo,
                                            "porcentaje_saldo":fila.porcentaje_saldo
                                        }
                                    ]
                                }
                            ]
                        }else{
                            
                            if(fila.id_componente != lastIdComponente){
                                var componente = {
                                    "componente_numero": fila.numero,
                                    "id_componente": fila.id_componente,
                                    "nombre":fila.nombre,
                                    "presupuesto":fila.presupuesto,
                                    "valor_total_anterior":fila.valor_total_anterior,
                                    "valor_total_actual":valor_total_actual,
                                    "valor_suma_acumulado":fila.valor_suma_acumulado,
                                    "valor_total_saldo": fila.valor_total_saldo,
                                    "partidas":[
                                        {
                                            "tipo":fila.tipo,
                                            "item":fila.item,
                                            "descripcion":fila.descripcion,
                                            "unidad_medida":fila.unidad_medida,
                                            "metrado":fila.metrado,
                                            "costo_unitario":fila.costo_unitario,
                                            "parcial":fila.parcial,
                                            "metrado_anterior":fila.metrado_anterior,
                                            "valor_anterior":fila.valor_anterior,
                                            "porcentaje_anterior":fila.porcentaje_anterior,
                                            "metrado_actual":fila.metrado_actual,
                                            "valor_actual":fila.valor_actual,
                                            "porcentaje_actual":fila.porcentaje_actual,
                                            "metrado_total":fila.metrado_total,
                                            "valor_total":fila.valor_total,
                                            "porcentaje_total":fila.porcentaje_total,
                                            "metrado_saldo":fila.metrado_saldo,
                                            "valor_saldo":fila.valor_saldo,
                                            "porcentaje_saldo":fila.porcentaje_saldo
                                        }
                                    ]
                                }
                                periodo.componentes.push(componente) 
                                valor_total_actual = 0
                            }else{
                                periodo.componentes[periodo.componentes.length-1].valor_total_actual =valor_total_actual
                                var partida = {
                                        "tipo":fila.tipo,
                                        "item":fila.item,
                                        "descripcion":fila.descripcion,
                                        "unidad_medida":fila.unidad_medida,
                                        "metrado":fila.metrado,
                                        "costo_unitario":fila.costo_unitario,
                                        "parcial":fila.parcial,
                                        "metrado_anterior":fila.metrado_anterior,
                                        "valor_anterior":fila.valor_anterior,
                                        "porcentaje_anterior":fila.porcentaje_anterior,
                                        "metrado_actual":fila.metrado_actual,
                                        "valor_actual":fila.valor_actual,
                                        "porcentaje_actual":fila.porcentaje_actual,
                                        "metrado_total":fila.metrado_total,
                                        "valor_total":fila.valor_total,
                                        "porcentaje_total":fila.porcentaje_total,
                                        "metrado_saldo":fila.metrado_saldo,
                                        "valor_saldo":fila.valor_saldo,
                                        "porcentaje_saldo":fila.porcentaje_saldo
                                }
                                periodo.componentes[periodo.componentes.length-1].partidas.push(partida)
                                

                            }
                                                     

                        }
                        lastIdPeriodo = fila.id_periodo
                        lastIdComponente = fila.id_componente
                        lastIdPartida = fila.lastIdPartida
                    }
                    periodos.push(periodo)
                    //operaciones de anterior total y saldo
                    console.log("length",periodos.length);
                    
                    for (let i = 0; i < periodos.length; i++) {
                        //variables de resumen
                        periodos[i].resumen = {
                            "presupuesto_total":0,
                            "avance_anterior":0,
                            "avance_actual":0,
                            "avance_acumulado":0,
                            "saldo":0,
                            "componentes":[]
                        }


                        const componentes = periodos[i].componentes;
                        
                        for (let j = 0; j < componentes.length; j++) {

                            const componente = componentes[j]        
                            

                                                
                            //comp valor total anterior
                            if(i > 0){
                                componente.valor_total_anterior = periodos[i-1].componentes[j].valor_suma_acumulado                               
                            }
                            //comp valor total acumulado
                            componente.valor_suma_acumulado = componente.valor_total_anterior + componente.valor_total_actual
                            //comp valor saldo
                            componente.valor_total_saldo = componente.presupuesto - componente.valor_suma_acumulado

                            //datos de resumen
                            periodos[i].resumen.presupuesto_total += componente.presupuesto
                            periodos[i].resumen.avance_anterior += componente.valor_total_anterior
                            periodos[i].resumen.avance_actual += componente.valor_total_actual         
                            periodos[i].resumen.avance_acumulado += componente.valor_suma_acumulado    
                            periodos[i].resumen.saldo += componente.valor_total_saldo     

                             //datos de resumen componentes
                            periodos[i].resumen.componentes.push(
                                {
                                    "componente_numero": componente.componente_numero,
                                    "nombre": componente.nombre,
                                    "presupuesto": formato(componente.presupuesto),
                                    "valor_total_anterior":formato( componente.valor_total_anterior),
                                    "valor_total_anterior_porcentaje":formato(componente.valor_total_anterior/componente.presupuesto * 100),
                                    "valor_total_actual":formato( componente.valor_total_actual),
                                    "valor_total_actual_porcentaje":formato(componente.valor_total_actual/componente.presupuesto * 100),
                                    "valor_suma_acumulado":formato( componente.valor_suma_acumulado),
                                    "valor_suma_acumulado_porcentaje":formato(componente.valor_suma_acumulado/componente.presupuesto * 100),
                                    "valor_total_saldo":formato( componente.valor_total_saldo),
                                    "valor_total_saldo_porcentaje":formato(componente.valor_total_saldo/componente.presupuesto * 100)
                                }
                            )

                            
                            const partidas = componente.partidas
                            for (let k = 0; k < partidas.length; k++) {
                                
                                var partida = partidas[k];
                                
                                // part valor total anterior
                                if(i > 0){
                                    //metrado anterior
                                    partida.metrado_anterior = periodos[i-1].componentes[j].partidas[k].metrado_actual
                                    //valor anterior
                                    partida.valor_anterior = periodos[i-1].componentes[j].partidas[k].valor_actual
                                    //porcentaje anterior
                                    partida.porcentaje_anterior = periodos[i-1].componentes[j].partidas[k].porcentaje_actual
                                }
                                //partida metrado acumulado
                                partida.metrado_total = partida.metrado_actual + partida.metrado_anterior
                                
                                
                                //partida valor acumulado
                                partida.valor_total = partida.valor_actual + partida.valor_anterior
                                //partida porcentaje acumuado
                                partida.porcentaje_total = partida.porcentaje_actual + partida.porcentaje_anterior

                                //partida metrado saldo
                                partida.metrado_saldo = partida.metrado - partida.metrado_total
                                
                                //partida valor saldo
                                partida.valor_saldo = partida.parcial - partida.valor_total
                                
                                //partida porcenjata saldo
                                partida.porcentaje_saldo = 100 - partida.porcentaje_total
                                

                               
                               
                            }
                            

                            
                        }                        

                        
                    }
                    //aplicando formato en 2 decimales
                    for (let i = 0; i < periodos.length; i++) {
                        const componentes = periodos[i].componentes;


                        periodos[i].resumen.presupuesto_total=formato(periodos[i].resumen.presupuesto_total)
                        periodos[i].resumen.avance_anterior =formato(periodos[i].resumen.avance_anterior )
                        periodos[i].resumen.avance_actual =formato(periodos[i].resumen.avance_actual )
                        periodos[i].resumen.avance_acumulado =formato(periodos[i].resumen.avance_acumulado )
                        periodos[i].resumen.saldo =formato(periodos[i].resumen.saldo )
                        for (let j = 0; j < componentes.length; j++) {
                            const componente = componentes[j];
                            //formato 2 digitos
                            componente.presupuesto = formato(componente.presupuesto)
                            componente.valor_total_anterior = formato(componente.valor_total_anterior)
                            componente.valor_total_actual = formato(componente.valor_total_actual)
                            componente.valor_suma_acumulado = formato(componente.valor_suma_acumulado)
                            componente.valor_total_saldo = formato(componente.valor_total_saldo)
                            const partidas = componente.partidas
                            for (let k = 0; k < partidas.length; k++) {
                                const partida = partidas[k];
                                 //formato de dos digitos
                                partida.metrado = formato(partida.metrado)
                                partida.costo_unitario = formato(partida.costo_unitario)
                                partida.parcial = formato(partida.parcial)

                                 partida.metrado_anterior = formato(partida.metrado_anterior)
                                 partida.valor_anterior = formato(partida.valor_anterior)
                                 partida.porcentaje_anterior = formato(partida.porcentaje_anterior)
                                 partida.metrado_actual = formato(partida.metrado_actual)
                                 partida.valor_actual = formato(partida.valor_actual)
                                 partida.porcentaje_actual = formato(partida.porcentaje_actual)
                                 partida.metrado_total = formato(partida.metrado_total)
                                 partida.valor_total = formato(partida.valor_total)
                                 partida.porcentaje_total = formato(partida.porcentaje_total)
                                 partida.metrado_saldo = formato(partida.metrado_saldo)
                                 partida.valor_saldo = formato(partida.valor_saldo)
                                 partida.porcentaje_saldo = formato(partida.porcentaje_saldo)
                                
                            }

                            
                        }
                        
                    }

                    callback(null,periodos);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getValGeneralExtras = (id_ficha,tipo,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query(" SELECT t1.Fichas_id_ficha, t1.id_historialEstado, t1.id_periodo, t1.numero_periodo, t1.numero, t1.id_componente, t1.nombre, t1.presupuesto, 0 valor_total_anterior, 0 valor_total_actual, 0 valor_suma_acumulado, 0 valor_total_saldo, t1.id_partida, t1.tipo, t1.item, t1.descripcion, t1.unidad_medida, t1.metrado, t1.costo_unitario, t1.costo_unitario * t1.metrado parcial, 0 metrado_anterior, 0 valor_anterior, 0 porcentaje_anterior, t2.metrado_actual, t2.valor_actual, t2.porcentaje_actual, 0 metrado_total, 0 valor_total, 0 porcentaje_total, 0 metrado_saldo, 0 valor_saldo, 0 porcentaje_saldo FROM (SELECT periodo.id_periodo, periodo.id_historialEstado, (CONCAT(periodo.codigo, periodo.numero)) numero_periodo, componentes.Fichas_id_ficha, componentes.numero, componentes.id_componente, componentes.nombre, componentes.presupuesto, partida.id_partida, partida.tipo, partida.item, partida.unidad_medida, partida.descripcion, partida.metrado, partida.costo_unitario, partida.metrado * partida.costo_unitario parcial FROM componentes INNER JOIN (SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.unidad_medida, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.componentes_id_componente FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? GROUP BY partidas.id_partida) partida ON partida.componentes_id_componente = componentes.id_componente CROSS JOIN (SELECT TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1 numero, estados.codigo codigo, historialestados.id_historialEstado, CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE historialestados.Fichas_id_ficha = ?) periodo) t1 LEFT JOIN (SELECT periodo.id_periodo, componentes.id_componente, partidas.id_partida, SUM(avanceactividades.valor) metrado_actual, SUM(avanceactividades.valor * partidas.costo_unitario) valor_actual, (SUM(avanceactividades.valor) / partidas.metrado) * 100 porcentaje_actual FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad INNER JOIN (SELECT CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo, historialestados.id_historialestado FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) periodo ON periodo.id_historialEstado = avanceactividades.historialEstados_id_historialEstado GROUP BY periodo.id_periodo , partidas.id_partida) t2 ON t1.id_periodo = t2.id_periodo AND t1.id_componente = t2.id_componente AND t1.id_partida = t2.id_partida WHERE t1.numero IS NOT NULL AND t1.Fichas_id_ficha = ? ORDER BY t1.id_historialEstado , t1.id_partida",[tipo,id_ficha,id_ficha],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");
                    
                    callback(null,"vacio");
                
                }else{
                    var periodos = []
                    var periodo = {}                    
                    var lastIdPeriodo = -1
                    var lastIdComponente = -1
                    var lastIdPartida = -1
                    var valor_total_actual=0
                    //se estructuran los datos
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];

                        //variables temporales
                        valor_total_actual+=fila.valor_actual                    
                        

                        if(fila.id_periodo != lastIdPeriodo){
                            if(i != 0){
                                periodos.push(periodo)
                                periodo = {}
                                valor_total_actual = 0
                            }
                            
                            
                            //insercion de datos
                            periodo.id_periodo = fila.id_periodo
                            periodo.numero_periodo = fila.numero_periodo
                            periodo.componentes=[
                                {
                                    "componente_numero": fila.numero,
                                    "id_componente": fila.id_componente,
                                    "nombre":fila.nombre,
                                    "presupuesto":fila.presupuesto,
                                    "valor_total_anterior":fila.valor_total_anterior,
                                    "valor_total_actual":valor_total_actual,
                                    "valor_suma_acumulado":fila.valor_suma_acumulado,
                                    "valor_total_saldo": fila.valor_total_saldo,
                                    "partidas":[
                                        {
                                            "tipo":fila.tipo,
                                            "item":fila.item,
                                            "descripcion":fila.descripcion,
                                            "unidad_medida":fila.unidad_medida,
                                            "metrado":fila.metrado,
                                            "costo_unitario":fila.costo_unitario,
                                            "parcial":fila.parcial,
                                            "metrado_anterior":fila.metrado_anterior,
                                            "valor_anterior":fila.valor_anterior,
                                            "porcentaje_anterior":fila.porcentaje_anterior,
                                            "metrado_actual":fila.metrado_actual,
                                            "valor_actual":fila.valor_actual,
                                            "porcentaje_actual":fila.porcentaje_actual,
                                            "metrado_total":fila.metrado_total,
                                            "valor_total":fila.valor_total,
                                            "porcentaje_total":fila.porcentaje_total,
                                            "metrado_saldo":fila.metrado_saldo,
                                            "valor_saldo":fila.valor_saldo,
                                            "porcentaje_saldo":fila.porcentaje_saldo
                                        }
                                    ]
                                }
                            ]
                        }else{
                            
                            if(fila.id_componente != lastIdComponente){
                                var componente = {
                                    "componente_numero": fila.numero,
                                    "id_componente": fila.id_componente,
                                    "nombre":fila.nombre,
                                    "presupuesto":fila.presupuesto,
                                    "valor_total_anterior":fila.valor_total_anterior,
                                    "valor_total_actual":valor_total_actual,
                                    "valor_suma_acumulado":fila.valor_suma_acumulado,
                                    "valor_total_saldo": fila.valor_total_saldo,
                                    "partidas":[
                                        {
                                            "tipo":fila.tipo,
                                            "item":fila.item,
                                            "descripcion":fila.descripcion,
                                            "unidad_medida":fila.unidad_medida,
                                            "metrado":fila.metrado,
                                            "costo_unitario":fila.costo_unitario,
                                            "parcial":fila.parcial,
                                            "metrado_anterior":fila.metrado_anterior,
                                            "valor_anterior":fila.valor_anterior,
                                            "porcentaje_anterior":fila.porcentaje_anterior,
                                            "metrado_actual":fila.metrado_actual,
                                            "valor_actual":fila.valor_actual,
                                            "porcentaje_actual":fila.porcentaje_actual,
                                            "metrado_total":fila.metrado_total,
                                            "valor_total":fila.valor_total,
                                            "porcentaje_total":fila.porcentaje_total,
                                            "metrado_saldo":fila.metrado_saldo,
                                            "valor_saldo":fila.valor_saldo,
                                            "porcentaje_saldo":fila.porcentaje_saldo
                                        }
                                    ]
                                }
                                periodo.componentes.push(componente) 
                                valor_total_actual = 0
                            }else{
                                periodo.componentes[periodo.componentes.length-1].valor_total_actual =valor_total_actual
                                var partida = {
                                        "tipo":fila.tipo,
                                        "item":fila.item,
                                        "descripcion":fila.descripcion,
                                        "unidad_medida":fila.unidad_medida,
                                        "metrado":fila.metrado,
                                        "costo_unitario":fila.costo_unitario,
                                        "parcial":fila.parcial,
                                        "metrado_anterior":fila.metrado_anterior,
                                        "valor_anterior":fila.valor_anterior,
                                        "porcentaje_anterior":fila.porcentaje_anterior,
                                        "metrado_actual":fila.metrado_actual,
                                        "valor_actual":fila.valor_actual,
                                        "porcentaje_actual":fila.porcentaje_actual,
                                        "metrado_total":fila.metrado_total,
                                        "valor_total":fila.valor_total,
                                        "porcentaje_total":fila.porcentaje_total,
                                        "metrado_saldo":fila.metrado_saldo,
                                        "valor_saldo":fila.valor_saldo,
                                        "porcentaje_saldo":fila.porcentaje_saldo
                                }
                                periodo.componentes[periodo.componentes.length-1].partidas.push(partida)
                                

                            }
                                                     

                        }
                        lastIdPeriodo = fila.id_periodo
                        lastIdComponente = fila.id_componente
                        lastIdPartida = fila.lastIdPartida
                    }
                    periodos.push(periodo)
                    //operaciones de anterior total y saldo
                    for (let i = 0; i < periodos.length; i++) {
                        //variables de resumen
                        periodos[i].resumen = {
                            "presupuesto_total":0,
                            "avance_anterior":0,
                            "avance_actual":0,
                            "avance_acumulado":0,
                            "saldo":0,
                            "componentes":[]
                        }


                        const componentes = periodos[i].componentes;
                        
                        for (let j = 0; j < componentes.length; j++) {

                            const componente = componentes[j]        
                            

                                                
                            //comp valor total anterior
                            if(i > 0){
                                componente.valor_total_anterior = periodos[i-1].componentes[j].valor_total_actual                               
                            }
                            //comp valor total acumulado
                            componente.valor_suma_acumulado = componente.valor_total_anterior + componente.valor_total_actual
                            //comp valor saldo
                            componente.valor_total_saldo = componente.presupuesto - componente.valor_suma_acumulado

                            //datos de resumen
                            periodos[i].resumen.presupuesto_total += componente.presupuesto
                            periodos[i].resumen.avance_anterior += componente.valor_total_anterior
                            periodos[i].resumen.avance_actual += componente.valor_total_actual         
                            periodos[i].resumen.avance_acumulado += componente.valor_suma_acumulado    
                            periodos[i].resumen.saldo += componente.valor_total_saldo     

                             //datos de resumen componentes
                            periodos[i].resumen.componentes.push(
                                {
                                    "componente_numero": componente.componente_numero,
                                    "nombre": componente.nombre,
                                    "presupuesto": formatoPorcentaje(componente.presupuesto),
                                    "valor_total_anterior":formatoPorcentaje( componente.valor_total_anterior),
                                    "valor_total_anterior_porcentaje":formatoPorcentaje(componente.valor_total_anterior/componente.presupuesto * 100),
                                    "valor_total_actual":formatoPorcentaje( componente.valor_total_actual),
                                    "valor_total_actual_porcentaje":formatoPorcentaje(componente.valor_total_actual/componente.presupuesto * 100),
                                    "valor_suma_acumulado":formatoPorcentaje( componente.valor_suma_acumulado),
                                    "valor_suma_acumulado_porcentaje":formatoPorcentaje(componente.valor_suma_acumulado/componente.presupuesto * 100),
                                    "valor_total_saldo":formatoPorcentaje( componente.valor_total_saldo),
                                    "valor_total_saldo_porcentaje":formatoPorcentaje(componente.valor_total_saldo/componente.presupuesto * 100)
                                }
                            )

                            
                            const partidas = componente.partidas
                            for (let k = 0; k < partidas.length; k++) {
                                
                                var partida = partidas[k];
                                
                                // part valor total anterior
                                if(i > 0){
                                    //metrado anterior
                                    partida.metrado_anterior = periodos[i-1].componentes[j].partidas[k].metrado_actual
                                    //valor anterior
                                    partida.valor_anterior = periodos[i-1].componentes[j].partidas[k].valor_actual
                                    //porcentaje anterior
                                    partida.porcentaje_anterior = periodos[i-1].componentes[j].partidas[k].porcentaje_actual
                                }
                                //partida metrado acumulado
                                partida.metrado_total = partida.metrado_actual + partida.metrado_anterior
                                
                                
                                //partida valor acumulado
                                partida.valor_total = partida.valor_actual + partida.valor_anterior
                                //partida porcentaje acumuado
                                partida.porcentaje_total = partida.porcentaje_actual + partida.porcentaje_anterior

                                //partida metrado saldo
                                partida.metrado_saldo = partida.metrado - partida.metrado_total
                                console.log(partida.metrado,"-",partida.metrado_total,"=",partida.metrado_saldo);
                                //partida valor saldo
                                partida.valor_saldo = partida.parcial - partida.valor_total
                                console.log(partida.parcial,"-",partida.valor_total,"=",partida.valor_saldo);
                                //partida porcenjata saldo
                                partida.porcentaje_saldo = 100 - partida.porcentaje_total
                                

                               
                               
                            }
                            

                            
                        }                        

                        
                    }
                    //aplicando formatoPorcentaje en 2 decimales
                    for (let i = 0; i < periodos.length; i++) {
                        const componentes = periodos[i].componentes;


                        periodos[i].resumen.presupuesto_total=formatoPorcentaje(periodos[i].resumen.presupuesto_total)
                        periodos[i].resumen.avance_anterior =formatoPorcentaje(periodos[i].resumen.avance_anterior )
                        periodos[i].resumen.avance_actual =formatoPorcentaje(periodos[i].resumen.avance_actual )
                        periodos[i].resumen.avance_acumulado =formatoPorcentaje(periodos[i].resumen.avance_acumulado )
                        periodos[i].resumen.saldo =formatoPorcentaje(periodos[i].resumen.saldo )
                        for (let j = 0; j < componentes.length; j++) {
                            const componente = componentes[j];
                            //formatoPorcentaje 2 digitos
                            componente.presupuesto = formatoPorcentaje(componente.presupuesto)
                            componente.valor_total_anterior = formatoPorcentaje(componente.valor_total_anterior)
                            componente.valor_total_actual = formatoPorcentaje(componente.valor_total_actual)
                            componente.valor_suma_acumulado = formatoPorcentaje(componente.valor_suma_acumulado)
                            componente.valor_total_saldo = formatoPorcentaje(componente.valor_total_saldo)
                            const partidas = componente.partidas
                            for (let k = 0; k < partidas.length; k++) {
                                const partida = partidas[k];
                                 //formatoPorcentaje de dos digitos
                                partida.metrado = formatoPorcentaje(partida.metrado)
                                partida.costo_unitario = formatoPorcentaje(partida.costo_unitario)
                                partida.parcial = formatoPorcentaje(partida.parcial)

                                 partida.metrado_anterior = formatoPorcentaje(partida.metrado_anterior)
                                 partida.valor_anterior = formatoPorcentaje(partida.valor_anterior)
                                 partida.porcentaje_anterior = formatoPorcentaje(partida.porcentaje_anterior)
                                 partida.metrado_actual = formatoPorcentaje(partida.metrado_actual)
                                 partida.valor_actual = formatoPorcentaje(partida.valor_actual)
                                 partida.porcentaje_actual = formatoPorcentaje(partida.porcentaje_actual)
                                 partida.metrado_total = formatoPorcentaje(partida.metrado_total)
                                 partida.valor_total = formatoPorcentaje(partida.valor_total)
                                 partida.porcentaje_total = formatoPorcentaje(partida.porcentaje_total)
                                 partida.metrado_saldo = formatoPorcentaje(partida.metrado_saldo)
                                 partida.valor_saldo = formatoPorcentaje(partida.valor_saldo)
                                 partida.porcentaje_saldo = formatoPorcentaje(partida.porcentaje_saldo)
                                
                            }

                            
                        }
                        
                    }

                    callback(null,periodos);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
//val general principal
userModel.getValGeneralAnyos  = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT year(avanceactividades.fecha) anyo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado is null and fichas.id_ficha = ? GROUP BY year(avanceactividades.fecha)",id_ficha,(err,res)=>{ 
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
userModel.getValGeneralPeriodos  = (id_ficha,anyo,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT fichas.id_ficha, estados.codigo, MIN(avanceactividades.fecha) fecha_inicial, DATE_FORMAT(MAX(avanceactividades.fecha), ' %Y') anyo, DATE_FORMAT(MAX(avanceactividades.fecha), ' %b') mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? GROUP BY historialestados.id_historialEstado , DATE_FORMAT(avanceactividades.fecha, '%Y-%b') ORDER BY avanceactividades.fecha",[id_ficha,anyo],(err,res)=>{ 
                if(err){
                    console.log(err);                    
                    callback(err.code);                 
                }
                else if(res.length == 0){
                    callback(null,"vacio");    
                    conn.destroy()    
                }else{  
                    cont = 1
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if(fila.codigo=="E"){
                            fila.codigo = fila.mes+" "+rome(cont)+fila.anyo
                            cont++
                            
                        }else{
                            cont= 1
                        }
                        delete fila.mes
                        delete fila.anyo
                        delete fila.id_ficha
                        fila.fecha_inicial = fila.fecha_inicial.toLocaleString()
                        if(i< res.length-1){
                            fila.fecha_final = res[i+1].fecha_inicial.toLocaleString()
                        }else{
                            fila.fecha_final = new Date().toLocaleString();
                        }
                        
                        
                    }              
            
                  
                       
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getValGeneralComponentes = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT componentes.id_componente, componentes.numero, componentes.nombre, componentes.presupuesto FROM componentes left join historialcomponentes on historialcomponentes.componentes_id_componente = componentes.id_componente WHERE historialcomponentes.componentes_id_componente is null and componentes.fichas_id_ficha = ?",[id_ficha],(error,res)=>{ 
                if(error){
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
userModel.getValGeneralResumenPeriodo = (id_ficha,fecha_inicial,fecha_final,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT componentes.numero, componentes.nombre, componentes.presupuesto, periodo_anterior.valor valor_anterior, periodo_anterior.porcentaje porcentaje_anterior, periodo_actual.valor valor_actual, periodo_actual.porcentaje porcentaje_actual, COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0) valor_total, COALESCE(periodo_anterior.porcentaje, 0) + COALESCE(periodo_actual.porcentaje, 0) porcentaje_total, componentes.presupuesto - COALESCE(periodo_anterior.valor, 0) - COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - COALESCE(periodo_anterior.porcentaje, 0) - COALESCE(periodo_actual.porcentaje, 0) porcentaje_saldo FROM componentes LEFT JOIN (SELECT partidas.componentes_id_componente, SUM(avanceactividades.valor * costo_unitario) valor, SUM(avanceactividades.valor * costo_unitario)/componentes.presupuesto*100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.componentes_id_componente) periodo_anterior ON periodo_anterior.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.componentes_id_componente, SUM(avanceactividades.valor * costo_unitario) valor, SUM(avanceactividades.valor * costo_unitario)/componentes.presupuesto*100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.componentes_id_componente) periodo_actual ON periodo_actual.componentes_id_componente = componentes.id_componente where componentes.fichas_id_ficha = ? ",[fecha_inicial,fecha_inicial,fecha_final,id_ficha],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");
                    
                    callback(null,"vacio");
                    conn.destroy()
                
                }else{
                    var presupuesto = 0 
                    var valor_anterior = 0 
                    var valor_actual = 0 
                    var valor_total = 0 
                    var valor_saldo = 0 
                    
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        presupuesto +=  fila.presupuesto 
                        valor_anterior += fila.valor_anterior
                        valor_actual += fila.valor_actual
                        valor_total += fila.valor_total
                        valor_saldo += fila.valor_saldo
                        
                        fila.presupuesto = formato(fila.presupuesto)
                        fila.valor_anterior = formato(fila.valor_anterior)
                        fila.porcentaje_anterior = formato(fila.porcentaje_anterior)
                        fila.valor_actual = formato(fila.valor_actual)
                        fila.porcentaje_actual = formato(fila.porcentaje_actual)
                        fila.valor_total = formato(fila.valor_total)
                        fila.porcentaje_total = formato(fila.porcentaje_total)
                        fila.valor_saldo = formato(fila.valor_saldo)
                        fila.porcentaje_saldo = formato(fila.porcentaje_saldo)
                        
                    }
          
                    callback(null,
                        {
                            "presupuesto":formato(presupuesto),
                            "valor_anterior":formato( valor_anterior),
                            "valor_actual":formato(valor_actual),
                            "valor_total":formato( valor_total),
                            "valor_saldo":formato(valor_saldo),
                            "porcentaje_anterior":20,
                            "porcentaje_actual":20,
                            "porcentaje_total":20,
                            "porcentaje_saldo":20,
                            "componentes":res
                        }
                        );
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getValGeneralPartidas = (id_componente,fecha_inicial,fecha_final,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT partidas.tipo, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario precio_parcial, periodo_anterior.metrado metrado_anterior, periodo_anterior.valor valor_anterior, periodo_anterior.porcentaje porcentaje_anterior, periodo_actual.metrado metrado_actual, periodo_actual.valor valor_actual, periodo_actual.porcentaje porcentaje_actual, COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0) metrado_total, COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0) valor_total, (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) porcentaje_total, partidas.metrado - (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) metrado_saldo, partidas.metrado * costo_unitario - COALESCE(periodo_anterior.valor, 0) - COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - COALESCE(periodo_anterior.porcentaje, 0) - COALESCE(periodo_actual.porcentaje, 0) porcentaje_saldo FROM partidas LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, SUM(round(avanceactividades.valor * costo_unitario,2)) valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_anterior ON periodo_anterior.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, SUM(round(avanceactividades.valor * costo_unitario,2)) valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_actual ON periodo_actual.id_partida = partidas.id_partida WHERE partidas.componentes_id_componente = ? ORDER BY partidas.id_partida",[fecha_inicial,fecha_inicial,fecha_final,id_componente],(error,res)=>{ 
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
                        precio_parcial += fila.precio_parcial
                        valor_actual = Number(valor_actual.toFixed(2))
                    //    console.log(" fila.valor_actual %s valor_actual %s",fila.valor_actual,valor_actual );
                        

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

                        }else {
                            fila.metrado  = formatoValorizaciones( fila.metrado )
                            fila.costo_unitario  = formatoValorizaciones( fila.costo_unitario )
                            fila.precio_parcial  = formatoValorizaciones( fila.precio_parcial )
                            fila.metrado_anterior  = formatoValorizaciones( fila.metrado_anterior )
                            fila.valor_anterior  = formatoValorizaciones( fila.valor_anterior )
                            fila.porcentaje_anterior  = formatoValorizaciones( fila.porcentaje_anterior )
                            fila.metrado_actual  = formatoValorizaciones( fila.metrado_actual )
                            fila.valor_actual  = formatoValorizaciones( fila.valor_actual )
                            fila.porcentaje_actual  = formatoValorizaciones( fila.porcentaje_actual )
                            fila.metrado_total = formatoValorizaciones( fila.metrado_total)
                            fila.valor_total = formatoValorizaciones( fila.valor_total)
                            fila.porcentaje_total = formatoValorizaciones( fila.porcentaje_total)
                            fila.metrado_saldo  = formatoValorizaciones( fila.metrado_saldo )
                            fila.valor_saldo  = formatoValorizaciones( fila.valor_saldo )
                            fila.porcentaje_saldo = formatoValorizaciones( fila.porcentaje_saldo)
                        }
                        
                        
                    }
          
                    callback(null,
                        {
                            "valor_anterior":formatoValorizaciones(valor_anterior),
                            "valor_actual":formatoValorizaciones(valor_actual ),
                            "valor_total":formatoValorizaciones(valor_total ),
                            "valor_saldo":formatoValorizaciones(valor_saldo ),
                            "precio_parcial":formatoValorizaciones(precio_parcial),
                            "porcentaje_anterior":20,
                            "porcentaje_actual":20,
                            "porcentaje_total":20,
                            "porcentaje_saldo":20,
                            "partidas":res
                        }
                        );
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
//Mayores metrados
userModel.getValGeneraMayoresMetradoslAnyos  = (id_ficha,tipo,callback)=>{    
    pool.getConnection(function(err ,conn){
        // console.log("connection",id_ficha,tipo);
        if(err){ 
            // console.log("err1");
            callback(err);
        }        
        else{
            conn.query("SELECT YEAR(historialactividades.fecha) anyo FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida inner JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? AND componentes.fichas_id_ficha = ? GROUP BY YEAR(historialactividades.fecha) ORDER BY historialactividades.fecha",[tipo,id_ficha],(err,res)=>{ 
                if(err){
                    // console.log("err");
                    console.log(err);                    
                    callback(err.code);                 
                }
                else if(res.length == 0){
                    // console.log("vacio");
                    callback(null,"vacio");    
                    conn.destroy()    
                }else{   
                    // console.log("res");
                    
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getValGeneralMayoresMetradosPeriodos  = (id_ficha,anyo,tipo,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("/********** Consulta de periodos de una obra***************/SELECT * FROM ((SELECT fichas.id_ficha, estados.codigo, MIN(avanceactividades.fecha) fecha_inicial, DATE_FORMAT(MAX(avanceactividades.fecha), ' %Y') anyo, DATE_FORMAT(MAX(avanceactividades.fecha), ' %b') mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.id_historialEstado = avanceactividades.historialestados_id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? AND estados.nombre = 'Ejecucion' GROUP BY DATE_FORMAT(avanceactividades.fecha, ' %Y %b') , avanceactividades.historialEstados_id_historialEstado) UNION (SELECT fichas.id_ficha, estados.codigo, MIN(avanceactividades.fecha) fecha_inicial, DATE_FORMAT(MAX(avanceactividades.fecha), ' %Y') anyo, DATE_FORMAT(MAX(avanceactividades.fecha), ' %b') mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.id_historialEstado = avanceactividades.historialestados_id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? AND estados.nombre = 'Corte' GROUP BY avanceactividades.historialEstados_id_historialEstado)) periodos_obra WHERE periodos_obra.id_ficha = ? AND YEAR(periodos_obra.fecha_inicial) = ? ORDER BY periodos_obra.fecha_inicial",[tipo,tipo,id_ficha,anyo],(err,res)=>{ 
                if(err){
                    console.log(err);                    
                    callback(err.code);                 
                }
                else if(res.length == 0){
                    callback(null,"vacio");    
                    conn.destroy()    
                }else{  
                    cont = 1
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if(fila.codigo=="E"){
                            fila.codigo = fila.mes+" "+rome(cont)+fila.anyo
                            cont++
                        }else{
                            cont= 1
                        }
                        delete fila.mes
                        delete fila.anyo
                        delete fila.id_ficha
                        fila.fecha_inicial = fila.fecha_inicial.toLocaleString()
                        if(i< res.length-1){
                            fila.fecha_final = res[i+1].fecha_inicial.toLocaleString()
                        }else{
                            fila.fecha_final = new Date().toLocaleString();
                        }
                    }           
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getValGeneralMayoresMetradosComponentes = (fecha_inicial,fecha_final,id_ficha,tipo,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT componentes.id_componente, componentes.numero, componentes.nombre, componentes.presupuesto FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad where historialactividades.estado = ?  and avanceactividades.fecha>=? and avanceactividades.fecha < ? and componentes.fichas_id_ficha = ? group by componentes.id_componente",[tipo,fecha_inicial,fecha_final,id_ficha],(error,res)=>{ 
                if(error){
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
userModel.getValGeneralMayoresMetradosResumenPeriodo = (id_ficha,fecha_inicial,fecha_final,tipo,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT componentes.numero, componentes.nombre, componentes.presupuesto, periodo_anterior.valor valor_anterior, periodo_anterior.porcentaje porcentaje_anterior, periodo_actual.valor valor_actual, periodo_actual.porcentaje porcentaje_actual, COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0) valor_total, COALESCE(periodo_anterior.porcentaje, 0) + COALESCE(periodo_actual.porcentaje, 0) porcentaje_total, componentes.presupuesto - COALESCE(periodo_anterior.valor, 0) - COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - COALESCE(periodo_anterior.porcentaje, 0) - COALESCE(periodo_actual.porcentaje, 0) porcentaje_saldo FROM componentes LEFT JOIN (SELECT partidas.componentes_id_componente, SUM(avanceactividades.valor * costo_unitario) valor, SUM(avanceactividades.valor * costo_unitario) / componentes.presupuesto * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? and avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.componentes_id_componente) periodo_anterior ON periodo_anterior.componentes_id_componente = componentes.id_componente inner JOIN (SELECT partidas.componentes_id_componente, SUM(avanceactividades.valor * costo_unitario) valor, SUM(avanceactividades.valor * costo_unitario) / componentes.presupuesto * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? and avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado = ? GROUP BY partidas.componentes_id_componente) periodo_actual ON periodo_actual.componentes_id_componente = componentes.id_componente WHERE componentes.fichas_id_ficha = ?",[tipo,fecha_inicial,tipo,fecha_inicial,fecha_final,tipo,id_ficha],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");
                    
                    callback(null,"vacio");
                    conn.destroy()
                
                }else{
                    var presupuesto = 0 
                    var valor_anterior = 0 
                    var valor_actual = 0 
                    var valor_total = 0 
                    var valor_saldo = 0 
                    
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        presupuesto +=  fila.presupuesto 
                        valor_anterior += fila.valor_anterior
                        valor_actual += fila.valor_actual
                        valor_total += fila.valor_total
                        valor_saldo += fila.valor_saldo
                        
                        fila.presupuesto = formato(fila.presupuesto)
                        fila.valor_anterior = formato(fila.valor_anterior)
                        fila.porcentaje_anterior = formato(fila.porcentaje_anterior)
                        fila.valor_actual = formato(fila.valor_actual)
                        fila.porcentaje_actual = formato(fila.porcentaje_actual)
                        fila.valor_total = formato(fila.valor_total)
                        fila.porcentaje_total = formato(fila.porcentaje_total)
                        fila.valor_saldo = formato(fila.valor_saldo)
                        fila.porcentaje_saldo = formato(fila.porcentaje_saldo)
                        
                    }
          
                    callback(null,
                        {
                            "presupuesto":formato(presupuesto),
                            "valor_anterior":formato( valor_anterior),
                            "valor_actual":formato(valor_actual),
                            "valor_total":formato( valor_total),
                            "valor_saldo":formato(valor_saldo),
                            "componentes":res
                        }
                        );
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getValGeneralMayoresMetradosPartidas = (id_componente,fecha_inicial,fecha_final,tipo,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partidas.tipo, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.precio_parcial, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_anterior.metrado metrado_anterior, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_anterior.valor valor_anterior, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_anterior.metrado / partidas.metrado * 100 porcentaje_anterior, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_actual.metrado metrado_actual, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_actual.valor valor_actual, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_actual.metrado / partidas.metrado * 100 porcentaje_actual, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) metrado_total, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * (COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0)) valor_total, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * (COALESCE(periodo_anterior.metrado / partidas.metrado * 100, 0) + COALESCE(periodo_actual.metrado / partidas.metrado * 100, 0)) porcentaje_total, partidas.metrado - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_anterior.metrado, 0) - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_actual.metrado, 0) metrado_saldo, partidas.precio_parcial - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_anterior.valor, 0) - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_anterior.metrado / partidas.metrado * 100, 0) - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_actual.metrado / partidas.metrado * 100, 0) porcentaje_saldo FROM (SELECT partidas.componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, SUM(actividades.parcial) metrado, partidas.costo_unitario, SUM(actividades.parcial) * partidas.costo_unitario precio_parcial FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN (SELECT * FROM historialactividades WHERE historialactividades.id_historialActividades = (SELECT MAX(b2.id_historialActividades) FROM historialactividades b2 WHERE b2.actividades_id_actividad = historialactividades.actividades_id_actividad AND b2.fecha < ?)) historialactividad ON historialactividad.actividades_id_actividad = actividades.id_actividad WHERE historialactividad.estado = ? GROUP BY partidas.id_partida) partidas LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, SUM(avanceactividades.valor * costo_unitario) valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado = ? GROUP BY partidas.id_partida) periodo_anterior ON periodo_anterior.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, SUM(avanceactividades.valor * costo_unitario) valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado = ? GROUP BY partidas.id_partida) periodo_actual ON periodo_actual.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 AND historialactividades.estado =? GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0 AND historialactividades.estado =? GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida WHERE partidas.componentes_id_componente = ? ORDER BY partidas.id_partida",[fecha_final,tipo,fecha_inicial,tipo,fecha_inicial,fecha_final,tipo,tipo,tipo,id_componente],(error,res)=>{ 
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

                        }else {
                            fila.metrado  = formato( fila.metrado )
                            fila.costo_unitario  = formato( fila.costo_unitario )
                            fila.precio_parcial  = formato( fila.precio_parcial )
                            fila.metrado_anterior  = formato( fila.metrado_anterior )
                            fila.valor_anterior  = formato( fila.valor_anterior )
                            fila.porcentaje_anterior  = formato( fila.porcentaje_anterior )
                            fila.metrado_actual  = formato( fila.metrado_actual )
                            fila.valor_actual  = formato( fila.valor_actual )
                            fila.porcentaje_actual  = formato( fila.porcentaje_actual )
                            fila.metrado_total = formato( fila.metrado_total)
                            fila.valor_total = formato( fila.valor_total)
                            fila.porcentaje_total = formato( fila.porcentaje_total)
                            fila.metrado_saldo  = formato( fila.metrado_saldo )
                            fila.valor_saldo  = formato( fila.valor_saldo )
                            fila.porcentaje_saldo = formato( fila.porcentaje_saldo)
                        }
                        
                        
                    }
          
                    callback(null,
                        {
                            "valor_anterior":formato(valor_anterior),
                            "valor_actual":formato(valor_actual ),
                            "valor_total":formato(valor_total ),
                            "valor_saldo":formato(valor_saldo ),
                            "precio_parcial":formato(precio_parcial),
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
            conn.query('SELECT fichas.id_ficha, partidas.item, partidas.descripcion partida_descripcion, metrado, costo_unitario, (metrado * costo_unitario) costo_parcial, recursos.id_recurso, recursos.descripcion, recursos.unidad, SUM(cuadrilla) cuadrilla_total, SUM(cantidad) cantidad_total, SUM(precio) precio_total, SUM(recursos.parcial) parcial_total FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida WHERE id_ficha = ? GROUP BY descripcion ORDER BY recursos.descripcion',id_ficha,(err,res)=>{ 
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
                        fila.metrado = formato(fila.metrado)
                        fila.costo_unitario = formato(fila.costo_unitario)
                        fila.costo_parcial = formato(fila.costo_parcial)
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

//imagenes
userModel.getImagenesComponentes = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT id_componente,numero,componentes.nombre from componentes left join partidas on partidas.componentes_id_componente = componentes.id_componente left join actividades on actividades.Partidas_id_partida = partidas.id_partida left join avanceactividades on avanceactividades.Actividades_id_actividad = actividades.id_actividad where avanceactividades.imagen is not null and componentes.fichas_id_ficha= ? group by componentes.id_componente",id_ficha,(error,res)=>{ if(error){
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
userModel.getImagenesPartidas = (id_componente,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partida.id_partida, partida.tipo, partida.item, partida.descripcion, imagenes.numero_imagenes, partida.porcentaje * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_avance FROM (SELECT partidas.componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, SUM(avanceactividades.valor) / partidas.metrado * 100 porcentaje FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partida.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida LEFT JOIN (SELECT partidas.id_partida, COUNT(avanceactividades.fecha) numero_imagenes FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.imagen IS NOT NULL GROUP BY partidas.id_partida) imagenes ON imagenes.id_partida = partida.id_partida WHERE partida.componentes_id_componente = ?",id_componente,(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");                    
                    callback(null,"vacio");
                    conn.destroy()
                }else{      
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if(fila.tipo=="titulo"){
                            fila.numero_imagenes = ""
                            fila.porcentaje_avance = ""                                       
                        }else{
                            fila.numero_imagenes = formato(fila.numero_imagenes)
                            fila.porcentaje_avance = formato(fila.porcentaje_avance)
                            
                        }
                    }
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getImagenesListaPorPartida = (id_componente,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT avanceactividades.fecha, avanceactividades.valor, avanceactividades.imagen, avanceactividades.imagenAlt, avanceactividades.descripcion FROM actividades LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.imagen IS NOT NULL and actividades.Partidas_id_partida = ?",id_componente,(error,res)=>{ 
                if(error){
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
userModel.getmaterialescomponentes = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/**********Consulta materiales por componentes*************/ select id_componente,numero,nombre from componentes where componentes.fichas_id_ficha = ?",id_ficha,(error,res)=>{ if(error){
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

userModel.getmaterialespartidacomponente = (id_componente,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/**********Consulta de materiales de partidas por componente**********/ SELECT id_partida, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, metrado * costo_unitario precio_parcial, partidas.tipo FROM partidas WHERE partidas.componentes_id_componente = ?",id_componente,(error,res)=>{ 
                if(error){
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
userModel.getmaterialespartida = (id_partida,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*********Consulta de recursos por partida***********/ SELECT recursos.tipo, recursos.codigo, recursos.descripcion, recursos.unidad, recursos.cuadrilla, recursos.cantidad, recursos.precio, recursos.parcial FROM recursos WHERE recursos.Partidas_id_partida = ?",id_partida,(error,res)=>{ if(error){
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

module.exports = userModel;
