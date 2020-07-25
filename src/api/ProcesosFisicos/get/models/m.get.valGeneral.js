const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')

let userModel = {};
//val general principal
userModel.getValGeneralAnyos  = (id_ficha)=>{    
    return new Promise((resolve, reject) => { 
        pool.query("SELECT year(avanceactividades.fecha) anyo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado is null and fichas.id_ficha = ? GROUP BY year(avanceactividades.fecha)",id_ficha,(err,res)=>{ 
            if (err) {
                return reject(err)
            }
            return resolve(res)   
        })
    })
}
userModel.getValGeneralPeriodos  = (id_ficha,anyo,ListarTodo)=>{    
    return new Promise((resolve, reject) => { 
        pool.query("SELECT fichas.id_ficha, estados.codigo, MIN(DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d')) fecha_inicial, DATE_FORMAT(MAX(avanceactividades.fecha), '%Y') anyo, DATE_FORMAT(MAX(avanceactividades.fecha), '%b') mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND fichas.id_ficha = ? AND (YEAR(avanceactividades.fecha) = ? OR "+ListarTodo+")  AND estados.codigo != 'A' GROUP BY historialestados.id_historialEstado , DATE_FORMAT(avanceactividades.fecha, '%Y-%b') ORDER BY avanceactividades.fecha",[id_ficha,anyo],(err,res)=>{ 
            if(err){
                return reject(err)                
            }
            else if(res.length == 0){
                return resolve("VACIO")   
            }else{  
                cont = 1
                for (let i = 0; i < res.length; i++) {
                    const fila = res[i];
                    if(fila.codigo=="E"){
                        fila.codigo = fila.mes+" "+tools.rome(cont)+fila.anyo
                        cont++
                    }else{
                        cont= 1
                    }
                    delete fila.id_ficha
                    fila.fecha_inicial = fila.fecha_inicial
                    if(i< res.length-1){
                        fila.fecha_final = res[i+1].fecha_inicial

                    }else{
                        Date.prototype.formatMMDDYYYY = function(){
                            return this.getFullYear() +
                            "-" +  (this.getMonth() + 1) +
                            "-" +  this.getDate();
                         }

                        fila.fecha_final = (new Date(parseInt(anyo) + 1, 0, 1)).formatMMDDYYYY()
                    }


                }   
                return resolve(res)
            }
        })
    })
}
userModel.getValGeneralComponentes = (id_ficha)=>{
    return new Promise((resolve, reject) => {
        pool.query("SELECT componentes.id_componente, componentes.numero, componentes.nombre, componentes.presupuesto FROM componentes left join historialcomponentes on historialcomponentes.componentes_id_componente = componentes.id_componente WHERE historialcomponentes.componentes_id_componente is null and componentes.fichas_id_ficha = ?",[id_ficha],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })    
}
userModel.getValGeneralResumenPeriodo = (id_ficha,fecha_inicial,fecha_final,formated)=>{
    console.log("FECHAS", fecha_inicial, fecha_final );
    
    return new Promise((resolve, reject) => {
        pool.query("SELECT componentes.numero, componentes.nombre, componentes.presupuesto, COALESCE(SUM(periodo_anterior.valor), 0) valor_anterior, COALESCE(SUM(periodo_anterior.valor), 0) / presupuesto * 100 porcentaje_anterior, COALESCE(SUM(periodo_actual.valor), 0) valor_actual, COALESCE(SUM(periodo_actual.valor), 0) / presupuesto * 100 porcentaje_actual, COALESCE(SUM(periodo_anterior.valor), 0) + COALESCE(SUM(periodo_actual.valor), 0) valor_total, (COALESCE(SUM(periodo_anterior.valor), 0) + COALESCE(SUM(periodo_actual.valor), 0)) / presupuesto * 100 porcentaje_total, componentes.presupuesto - COALESCE(SUM(periodo_anterior.valor), 0) - COALESCE(SUM(periodo_actual.valor), 0) valor_saldo, 100 - ((COALESCE(SUM(periodo_anterior.valor), 0) + COALESCE(SUM(periodo_actual.valor), 0)) / presupuesto * 100) porcentaje_saldo FROM componentes  LEFT JOIN historialcomponentes ON historialcomponentes.componentes_id_componente = componentes.id_componente LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, CAST(SUM(avanceactividades.valor) AS DECIMAL (20 , 10 )) * costo_unitario valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_anterior ON periodo_anterior.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, CAST(SUM(avanceactividades.valor) AS DECIMAL (20 ,10 )) * costo_unitario valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_actual ON periodo_actual.id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? and historialcomponentes.estado is null GROUP BY componentes.id_componente ",[fecha_inicial,fecha_inicial,fecha_final,id_ficha],(err,res)=>{ 
            if(err){
                return reject(err)
            }else if(res.length == 0){
                return resolve("VACIO")   
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
                    
                    fila.presupuesto = tools.formatoSoles(fila.presupuesto)
                    fila.valor_anterior = tools.formatoSoles(fila.valor_anterior)
                    fila.porcentaje_anterior = tools.formatoSoles(fila.porcentaje_anterior)
                    fila.valor_actual = tools.formatoSoles(fila.valor_actual)
                    fila.porcentaje_actual = tools.formatoSoles(fila.porcentaje_actual)
                    fila.valor_total = tools.formatoSoles(fila.valor_total)
                    fila.porcentaje_total = tools.formatoSoles(fila.porcentaje_total)
                    fila.valor_saldo = tools.formatoSoles(fila.valor_saldo)
                    fila.porcentaje_saldo = tools.formatoSoles(fila.porcentaje_saldo)
                }
                var data = {}
                if(formated){
                    data = {
                        "presupuesto":tools.formatoSoles(presupuesto),
                        "valor_anterior":tools.formatoSoles( valor_anterior),
                        "valor_actual":tools.formatoSoles(valor_actual),
                        "valor_total":tools.formatoSoles( valor_total),
                        "valor_saldo":tools.formatoSoles(valor_saldo),
                        "porcentaje_anterior":tools.formatoSoles(valor_anterior/presupuesto*100),
                        "porcentaje_actual":tools.formatoSoles(valor_actual/presupuesto*100),
                        "porcentaje_total":tools.formatoSoles(valor_total/presupuesto*100),
                        "porcentaje_saldo":tools.formatoSoles(valor_saldo/presupuesto*100),
                        "componentes":res
                    }
                }else{
                    data = {
                        "presupuesto":presupuesto,
                        "valor_anterior": valor_anterior,
                        "valor_actual":valor_actual,
                        "valor_total": valor_total,
                        "valor_saldo":valor_saldo,
                        "porcentaje_anterior":valor_anterior/presupuesto*100,
                        "porcentaje_actual":valor_actual/presupuesto*100,
                        "porcentaje_total":valor_total/presupuesto*100,
                        "porcentaje_saldo":valor_saldo/presupuesto*100,
                        "componentes":res
                    }
                }
                
                return resolve(data);
            }
            
            
        })
        
        
                
    })
}
// SELECT partidas.tipo, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario precio_parcial, periodo_anterior.metrado metrado_anterior, periodo_anterior.valor valor_anterior, periodo_anterior.porcentaje porcentaje_anterior, periodo_actual.metrado metrado_actual, periodo_actual.valor valor_actual, periodo_actual.porcentaje porcentaje_actual, COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0) metrado_total, COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0) valor_total, (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) porcentaje_total, partidas.metrado - (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) metrado_saldo, partidas.metrado * costo_unitario - COALESCE(periodo_anterior.valor, 0) - COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - COALESCE(periodo_anterior.porcentaje, 0) - COALESCE(periodo_actual.porcentaje, 0) porcentaje_saldo FROM partidas LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, CAST(SUM(avanceactividades.valor) AS DECIMAL (25 , 20 )) * costo_unitario valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_anterior ON periodo_anterior.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, CAST(SUM(avanceactividades.valor) AS DECIMAL (25 , 20 )) * costo_unitario valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_actual ON periodo_actual.id_partida = partidas.id_partida WHERE partidas.componentes_id_componente = ? ORDER BY partidas.id_partida"
userModel.getValGeneralPartidas = (id_componente,fecha_inicial,fecha_final)=>{
    return new Promise((resolve, reject) => {
        pool.query("SELECT partidas.tipo, partidas.item, partidas.descripcion, partidas.metrado,partidas.unidad_medida, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario precio_parcial, periodo_anterior.metrado metrado_anterior, periodo_anterior.valor valor_anterior, periodo_anterior.porcentaje porcentaje_anterior, periodo_actual.metrado metrado_actual, periodo_actual.valor valor_actual, periodo_actual.porcentaje porcentaje_actual, COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0) metrado_total, COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0) valor_total, (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) porcentaje_total, partidas.metrado - (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) metrado_saldo, partidas.metrado * costo_unitario - COALESCE(periodo_anterior.valor, 0) - COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - COALESCE(periodo_anterior.porcentaje, 0) - COALESCE(periodo_actual.porcentaje, 0) porcentaje_saldo FROM partidas LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, CAST(SUM(avanceactividades.valor) AS DECIMAL (25 , 10 )) * costo_unitario valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_anterior ON periodo_anterior.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, CAST(SUM(avanceactividades.valor) AS DECIMAL (25 , 10 )) * costo_unitario valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_actual ON periodo_actual.id_partida = partidas.id_partida WHERE partidas.componentes_id_componente = ? ORDER BY partidas.id_partida",[fecha_inicial,fecha_inicial,fecha_final,id_componente],(err,res)=>{ 
            if(err){
                return reject(err)
            }else if(res.length == 0){
                return resolve("VACIO")
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
                        fila.metrado  = tools.formatoSoles( fila.metrado )
                        fila.costo_unitario  = tools.formatoSoles( fila.costo_unitario )
                        fila.precio_parcial  = tools.formatoSoles( fila.precio_parcial )
                        fila.metrado_anterior  = tools.formatoSoles( fila.metrado_anterior )
                        fila.valor_anterior  = tools.formatoSoles( fila.valor_anterior )
                        fila.porcentaje_anterior  = tools.formatoSoles( fila.porcentaje_anterior )
                        fila.metrado_actual  = tools.formatoSoles( fila.metrado_actual )
                        fila.valor_actual  = tools.formatoSoles( fila.valor_actual )
                        fila.porcentaje_actual  = tools.formatoSoles( fila.porcentaje_actual )
                        fila.metrado_total = tools.formatoSoles( fila.metrado_total)
                        fila.valor_total = tools.formatoSoles( fila.valor_total)
                        fila.porcentaje_total = tools.formatoSoles( fila.porcentaje_total)
                        fila.metrado_saldo  = tools.formatoSoles( fila.metrado_saldo )
                        fila.valor_saldo  = tools.formatoSoles( fila.valor_saldo )
                        fila.porcentaje_saldo = tools.formatoSoles( fila.porcentaje_saldo)
                    }
                    
                }
                return resolve(                    
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
            }                              
        })                   
    })
}

userModel.getValGeneraMayoresMetradoslAnyos  = (id_ficha,tipo)=>{    
    console.log(id_ficha,tipo);
    return new Promise((resolve, reject) => {
        pool.query("SELECT YEAR(avanceactividades.fecha) anyo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? AND fichas.id_ficha = ? AND estados.codigo != 'A' GROUP BY YEAR(avanceactividades.fecha)",[tipo,id_ficha],(err,res)=>{ 
            if(err){
                reject(err.code);                 
            }
            else if(res.length == 0){
                resolve("vacio");    
            }else{   
                resolve(res);
            }
        })
    })
}
userModel.getValGeneralMayoresMetradosPeriodos  = (id_ficha,anyo,tipo)=>{    
    return new Promise((resolve, reject) => {
        pool.query("SELECT fichas.id_ficha, estados.codigo, MIN(DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d')) fecha_inicial, DATE_FORMAT(MAX(avanceactividades.fecha), ' %Y') anyo, DATE_FORMAT(MAX(avanceactividades.fecha), ' %b') mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND estados.codigo != 'A' GROUP BY historialestados.id_historialEstado , DATE_FORMAT(avanceactividades.fecha, '%Y-%b') ORDER BY avanceactividades.fecha",[tipo,id_ficha,anyo],(err,res)=>{ 
            if(err){
                reject(err.code);                 
            }
            else if(res.length == 0){
                resolve("vacio");
            }else{  
                cont = 1
                for (let i = 0; i < res.length; i++) {
                    const fila = res[i];
                    if(fila.codigo=="E"){
                        fila.codigo = fila.mes+" "+tools.rome(cont)+fila.anyo
                        cont++
                    }else{
                        cont= 1
                    }
                    delete fila.id_ficha
                    fila.fecha_inicial = fila.fecha_inicial
                    if(i< res.length-1){
                        fila.fecha_final = res[i+1].fecha_inicial
                    }else{
                        fila.fecha_final = (new Date(anyo, 11, 31))
                    }
                }       
                resolve(res);
            }
        })
    })
}
userModel.getValGeneralMayoresMetradosComponentes = (fecha_inicial,fecha_final,id_ficha,tipo)=>{
    return new Promise((resolve, reject) => {
        pool.query("SELECT componentes.id_componente, componentes.numero, componentes.nombre, componentes.presupuesto FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad INNER JOIN avanceactividades ON avanceactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? AND avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND componentes.fichas_id_ficha = ? GROUP BY componentes.id_componente",[tipo,fecha_inicial,fecha_final,id_ficha],(error,res)=>{ 
            if(error){
                reject(error);
            }else if(res.length == 0){
                resolve("vacio");
            }else{    
                resolve(res);
            }
        })
    })
}
userModel.getValGeneralMayoresMetradosResumenPeriodo = (id_ficha,fecha_inicial,fecha_final,tipo)=>{
    return new Promise((resolve, reject) => {
        var query = 
        pool.query("SELECT componentes.numero, componentes.nombre, componentes.presupuesto, periodo_anterior.valor valor_anterior, periodo_anterior.porcentaje porcentaje_anterior, periodo_actual.valor valor_actual, periodo_actual.porcentaje porcentaje_actual, COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0) valor_total, COALESCE(periodo_anterior.porcentaje, 0) + COALESCE(periodo_actual.porcentaje, 0) porcentaje_total, componentes.presupuesto - COALESCE(periodo_anterior.valor, 0) - COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - COALESCE(periodo_anterior.porcentaje, 0) - COALESCE(periodo_actual.porcentaje, 0) porcentaje_saldo FROM componentes LEFT JOIN (SELECT partidas.componentes_id_componente, SUM(avanceactividades.valor * costo_unitario) valor, SUM(avanceactividades.valor * costo_unitario) / componentes.presupuesto * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? and avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.componentes_id_componente) periodo_anterior ON periodo_anterior.componentes_id_componente = componentes.id_componente inner JOIN (SELECT partidas.componentes_id_componente, SUM(avanceactividades.valor * costo_unitario) valor, SUM(avanceactividades.valor * costo_unitario) / componentes.presupuesto * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? and avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado = ? GROUP BY partidas.componentes_id_componente) periodo_actual ON periodo_actual.componentes_id_componente = componentes.id_componente WHERE componentes.fichas_id_ficha = ?",[tipo,fecha_inicial,tipo,fecha_inicial,fecha_final,tipo,id_ficha],(error,res)=>{ 
            if(error){
                reject(error);
            }else if(res.length == 0){
                resolve("vacio");
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
                    
                    fila.presupuesto = tools.formatoSoles(fila.presupuesto)
                    fila.valor_anterior = tools.formatoSoles(fila.valor_anterior)
                    fila.porcentaje_anterior = tools.formatoSoles(fila.porcentaje_anterior)
                    fila.valor_actual = tools.formatoSoles(fila.valor_actual)
                    fila.porcentaje_actual = tools.formatoSoles(fila.porcentaje_actual)
                    fila.valor_total = tools.formatoSoles(fila.valor_total)
                    fila.porcentaje_total = tools.formatoSoles(fila.porcentaje_total)
                    fila.valor_saldo = tools.formatoSoles(fila.valor_saldo)
                    fila.porcentaje_saldo = tools.formatoSoles(fila.porcentaje_saldo)
                }
                resolve(
                    {
                        "presupuesto":tools.formatoSoles(presupuesto),
                        "valor_anterior":tools.formatoSoles( valor_anterior),
                        "valor_actual":tools.formatoSoles(valor_actual),
                        "valor_total":tools.formatoSoles( valor_total),
                        "valor_saldo":tools.formatoSoles(valor_saldo),
                        "componentes":res
                    }
                );
            }
        })
    })
}
userModel.getValGeneralMayoresMetradosPartidas = (id_componente,fecha_inicial,fecha_final,tipo)=>{
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partidas.tipo, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.precio_parcial, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_anterior.metrado metrado_anterior, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_anterior.valor valor_anterior, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_anterior.metrado / partidas.metrado * 100 porcentaje_anterior, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_actual.metrado metrado_actual, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_actual.valor valor_actual, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * periodo_actual.metrado / partidas.metrado * 100 porcentaje_actual, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) metrado_total, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * (COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0)) valor_total, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * (COALESCE(periodo_anterior.metrado / partidas.metrado * 100, 0) + COALESCE(periodo_actual.metrado / partidas.metrado * 100, 0)) porcentaje_total, partidas.metrado - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_anterior.metrado, 0) - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_actual.metrado, 0) metrado_saldo, partidas.precio_parcial - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_anterior.valor, 0) - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_anterior.metrado / partidas.metrado * 100, 0) - (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * COALESCE(periodo_actual.metrado / partidas.metrado * 100, 0) porcentaje_saldo FROM (SELECT partidas.componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, SUM(actividades.parcial) metrado, partidas.costo_unitario, SUM(actividades.parcial) * partidas.costo_unitario precio_parcial FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN (SELECT * FROM historialactividades WHERE historialactividades.id_historialActividades = (SELECT MAX(b2.id_historialActividades) FROM historialactividades b2 WHERE b2.actividades_id_actividad = historialactividades.actividades_id_actividad AND b2.fecha < ?)) historialactividad ON historialactividad.actividades_id_actividad = actividades.id_actividad WHERE historialactividad.estado = ? GROUP BY partidas.id_partida) partidas LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, SUM(avanceactividades.valor * costo_unitario) valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado = ? GROUP BY partidas.id_partida) periodo_anterior ON periodo_anterior.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, SUM(avanceactividades.valor * costo_unitario) valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado = ? GROUP BY partidas.id_partida) periodo_actual ON periodo_actual.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 AND historialactividades.estado =? GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0 AND historialactividades.estado =? GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida WHERE partidas.componentes_id_componente = ? ORDER BY partidas.id_partida",[fecha_final,tipo,fecha_inicial,tipo,fecha_inicial,fecha_final,tipo,tipo,tipo,id_componente],(error,res)=>{ 
            if(error){
                reject(error);
            }else if(res.length == 0){
                resolve("vacio");
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
                        fila.metrado  = tools.formatoSoles( fila.metrado )
                        fila.costo_unitario  = tools.formatoSoles( fila.costo_unitario )
                        fila.precio_parcial  = tools.formatoSoles( fila.precio_parcial )
                        fila.metrado_anterior  = tools.formatoSoles( fila.metrado_anterior )
                        fila.valor_anterior  = tools.formatoSoles( fila.valor_anterior )
                        fila.porcentaje_anterior  = tools.formatoSoles( fila.porcentaje_anterior )
                        fila.metrado_actual  = tools.formatoSoles( fila.metrado_actual )
                        fila.valor_actual  = tools.formatoSoles( fila.valor_actual )
                        fila.porcentaje_actual  = tools.formatoSoles( fila.porcentaje_actual )
                        fila.metrado_total = tools.formatoSoles( fila.metrado_total)
                        fila.valor_total = tools.formatoSoles( fila.valor_total)
                        fila.porcentaje_total = tools.formatoSoles( fila.porcentaje_total)
                        fila.metrado_saldo  = tools.formatoSoles( fila.metrado_saldo )
                        fila.valor_saldo  = tools.formatoSoles( fila.valor_saldo )
                        fila.porcentaje_saldo = tools.formatoSoles( fila.porcentaje_saldo)
                    }
                }
                
                resolve(
                    {
                        "valor_anterior":tools.formatoSoles(valor_anterior),
                        "valor_actual":tools.formatoSoles(valor_actual ),
                        "valor_total":tools.formatoSoles(valor_total ),
                        "valor_saldo":tools.formatoSoles(valor_saldo ),
                        "precio_parcial":tools.formatoSoles(precio_parcial),
                        "partidas":res
                    }
                );
            }
        })
    })
}
module.exports = userModel;
