const pool = require('../../../../db/connection');
let userModel = {};
function formato(data){
    
    
    if(data == null){
        return 0
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
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
    }else{
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
    } 

    return data
}

userModel.getHistorialAnyos  = (id_ficha,callback)=>{    
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
userModel.getHistorialMeses  = (id_ficha,anyo,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') fecha, MONTHNAME(avanceactividades.fecha) mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND fichas.id_ficha = ? and year(avanceactividades.fecha)= ? GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%b') order by DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01')",[id_ficha,anyo],(err,res)=>{ 
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
userModel.getHistorialResumen = (id_ficha,fecha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT concat('C-',componentes.numero) nombre, day(avanceactividades.fecha) dia, SUM(avanceactividades.valor*partidas.costo_unitario) valor FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND fichas.id_ficha = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') = DATE_FORMAT(?, '%Y-%m-01') GROUP BY componentes.id_componente , DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') order by day(avanceactividades.fecha)",[id_ficha,fecha],(err,res)=>{ 
                if(err){ console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    console.log("vacio");
                    callback(null,"vacio");
                }else{ 
                    //calculando ultimo dia  
                    var fecha_array = fecha.split("-")
                    var month = fecha_array[1]-1;
                    var year = fecha_array[0];
                    var lastDate = (new Date(year, month + 1, 0)).getDate();

                    //creando data inicial
                    var series = []
                    var listaItems = []
                    for (let i = 0; i < res.length; i++) {
                        const avance = res[i];
                        if (listaItems.indexOf(avance.nombre) === -1){
                            series.push(
                                {
                                    name:avance.nombre,
                                    data:[]
                                }
                            );
                            listaItems.push(avance.nombre)
                        }
                        
                    }
                    //llenando de ceros
                    var categories = []
                    for (let i = 1; i <= lastDate; i++) {
                        categories.push(i)
                        for (let j = 0; j < series.length; j++) {
                            const componente = series[j];
                            componente.data.push(0)
                        }
                    }

                    //llenando datos de avance
                    
                    for (let i = 0; i < res.length; i++) {                       
                       const avance = res[i]
                       for (let j = 0; j < series.length; j++) {
                           const componente = series[j];
                           console.log("avance",avance.nombre,componente.name);
                           
                           if(avance.nombre == componente.name && avance.valor != null){
                                componente.data[avance.dia-1] = Number(avance.valor.toFixed(2))
                                break;
                           }
                       }
                    }
                    
                    callback(null,{
                        categories,
                        series

                    });                    
                    
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getHistorialComponentes = (id_ficha,fecha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*************** por componentes********************/ SELECT componentes.id_componente, componentes.numero, componentes.nombre nombre_componente, SUM(avanceactividades.valor * partidas.costo_unitario) componente_total_soles, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 componente_total_porcentaje FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND fichas.id_ficha = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') = DATE_FORMAT(?, '%Y-%m-01') GROUP BY componentes.id_componente",[id_ficha,fecha],(err,res)=>{ 
                if(err){ console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    console.log("vacio");
                    callback(null,"vacio");
                }else{    
                    for (let i = 0; i < res.length; i++) {
                        const componente = res[i];
                        componente.componente_total_soles = formato(componente.componente_total_soles)
                        componente.componente_total_porcentaje = formato(componente.componente_total_porcentaje)
                        
                    }                
                    
                    
                    
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getHistorialFechas = (id_componente,fecha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT DATE_FORMAT(avanceactividades.fecha, '%d de %M del %Y') fecha_larga, SUM(avanceactividades.valor * partidas.costo_unitario) fecha_total_soles, SUM(avanceactividades.valor * partidas.costo_unitario)/tb_presupuesto.presupuesto*100 fecha_total_porcentaje, DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') fecha FROM fichas LEFT JOIN (SELECT componentes.fichas_id_ficha id_ficha, SUM(presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND componentes.id_componente = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') = DATE_FORMAT(?, '%Y-%m-01') GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d')",[id_componente,fecha],(err,res)=>{ 
                if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    console.log("vacio");
                    callback(null,"vacio");
                }else{                
                    for (let i = 0; i < res.length; i++) {
                        const fecha = res[i];
                        fecha.fecha_total_soles = formato(fecha.fecha_total_soles)
                        fecha.fecha_total_porcentaje = formato(fecha.fecha_total_porcentaje)
                        
                    }
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getHistorialDias = (id_componente,fecha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partidas.item, partidas.descripcion descripcion_partida, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, actividades.nombre nombre_actividad, avanceactividades.descripcion descripcion_actividad, avanceactividades.observacion, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * avanceactividades.valor valor, partidas.costo_unitario, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * avanceactividades.valor * partidas.costo_unitario parcial FROM fichas LEFT JOIN (SELECT componentes.fichas_id_ficha id_ficha, SUM(presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND componentes.id_componente = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d')",[id_componente,fecha],(err,res)=>{
                if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    console.log("vacio");
                    callback(null,"vacio");
                }else{               
                    for (let i = 0; i < res.length; i++) {
                        const dia = res[i];
                        dia.valor = formato(dia.valor)
                        dia.parcial =  formato(dia.parcial)
                        
                    }     
                                    
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getHistorialComponenteChart = (id_componente,fecha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT CONCAT('C-', componentes.numero) nombre, DAY(avanceactividades.fecha) dia, SUM(avanceactividades.valor * partidas.costo_unitario) valor FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND componentes.id_componente = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') = DATE_FORMAT(?, '%Y-%m-01') GROUP BY componentes.id_componente , DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') ORDER BY DAY(avanceactividades.fecha)",[id_componente,fecha],(err,res)=>{ 
                if(err){ console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    console.log("vacio");
                    callback(null,"vacio");
                }else{ 
                    //calculando ultimo dia  
                    var fecha_array = fecha.split("-")
                    var month = fecha_array[1]-1;
                    var year = fecha_array[0];
                    var lastDate = (new Date(year, month + 1, 0)).getDate();

                    //creando data inicial
                    var series = []
                    var listaItems = []
                    for (let i = 0; i < res.length; i++) {
                        const avance = res[i];
                        if (listaItems.indexOf(avance.nombre) === -1){
                            series.push(
                                {
                                    name:avance.nombre,
                                    data:[]
                                }
                            );
                            listaItems.push(avance.nombre)
                        }
                        
                    }
                    //llenando de ceros
                    var categories = []
                    for (let i = 1; i <= lastDate; i++) {
                        categories.push(i)
                        for (let j = 0; j < series.length; j++) {
                            const componente = series[j];
                            componente.data.push(0)
                        }
                    }

                    //llenando datos de avance
                    
                    for (let i = 0; i < res.length; i++) {                       
                       const avance = res[i]
                       for (let j = 0; j < series.length; j++) {
                           const componente = series[j];
                           console.log("avance",avance.nombre,componente.name);
                           
                           if(avance.nombre == componente.name && avance.valor != null){
                                componente.data[avance.dia-1] = Number(avance.valor.toFixed(2))
                                break;
                           }
                       }
                    }
                    
                    callback(null,{
                        categories,
                        series

                    });                    
                    
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
module.exports = userModel;
