const pool = require('./connection');
let userModel = {};
function formato(data){
    data = parseFloat(Math.round(data * 100) / 100).toFixed(2);
    // data = parseFloat(data)
    return data
}

userModel.getPartidas = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT componentes.id_componente, componentes.numero, componentes.nombre, partida.id_partida, partida.tipo, partida.item, partida.descripcion, partida.unidad_medida, partida.metrado, partida.costo_unitario, partida.parcial, partida.avance_metrado, partida.avance_costo, partida.metrados_saldo, partida.metrados_costo_saldo, partida.porcentaje, actividad.id_actividad, actividad.nombre actividad_nombre, actividad.veces, actividad.largo, actividad.ancho, actividad.alto, actividad.metrado_actividad, partida.costo_unitario, actividad.metrado_actividad * partida.costo_unitario parcial_actividad, actividad.actividad_avance_metrado, actividad.actividad_avance_metrado * partida.costo_unitario actividad_avance_costo, actividad.metrado_actividad - actividad.actividad_avance_metrado actividad_metrados_saldo, (actividad.metrado_actividad - actividad.actividad_avance_metrado) * partida.costo_unitario actividad_metrados_costo_saldo, (actividad.actividad_avance_metrado / actividad.metrado_actividad) * 100 actividad_porcentaje FROM presupuestos LEFT JOIN (SELECT partidas.Componentes_id_componente, partidas.presupuestos_id_Presupuesto, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor) * partidas.costo_unitario avance_costo, partidas.metrado - SUM(avanceactividades.valor) metrados_saldo, (partidas.metrado - SUM(avanceactividades.valor)) * partidas.costo_unitario metrados_costo_saldo, (SUM(avanceactividades.valor) / partidas.metrado) * 100 porcentaje FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY partidas.id_partida) partida ON partida.presupuestos_id_Presupuesto = presupuestos.id_presupuesto LEFT JOIN (SELECT Partidas_id_partida, id_actividad, nombre, veces, largo, ancho, alto, parcial metrado_actividad, SUM(avanceactividades.valor) actividad_avance_metrado FROM actividades LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY actividades.id_actividad) actividad ON actividad.Partidas_id_partida = partida.id_partida LEFT JOIN componentes ON componentes.id_componente = partida.componentes_id_componente WHERE presupuestos.Fichas_id_ficha = ?",id_ficha,(error,res)=>{
                if(error){
                    callback(error);
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
                    
                    
                    callback(null,componentes);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}

userModel.getIdHistorial = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('select id_historialEstado from fichas left join historialestados on historialestados.Fichas_id_ficha = fichas.id_ficha where id_ficha = ? ORDER BY historialestados.id_historialEstado DESC LIMIT 1',id_ficha,(error,res)=>{
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
userModel.getHistorial = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('SELECT componentes.id_componente, componentes.numero, componentes.nombre nombre_componente, partidas.item, partidas.descripcion descripcion_partida, actividades.nombre nombre_actividad, avanceactividades.descripcion descripcion_actividad, avanceactividades.observacion, avanceactividades.fecha, avanceactividades.valor, partidas.costo_unitario, avanceactividades.valor * partidas.costo_unitario parcial FROM presupuestos LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida RIGHT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad left join componentes on componentes.id_componente = partidas.componentes_id_componente WHERE presupuestos.Fichas_id_ficha = ?',id_ficha,(err,res)=>{
                if(err){
                    console.log(err);
                    callback(err.code);
                }else{                    
                    // console.log("res",res); 
                    var lastIdComponente = -1
                    var componentes = []
                    var componente = {}
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        console.log("fila",fila.id_componente)
                        if(fila.id_componente != lastIdComponente){
                            if(i != 0 ){
                                componentes.push(componente);
                                componente = {}
                            }
                            
                            componente.id_componente = fila.id_componente
                            componente.numero = fila.numero
                            componente.nombre_componente = fila.nombre_componente
                            componente.historial=[
                                {
                                    "item" : fila.item,
                                    "descripcion_partida" : fila.descripcion_partida,
                                    "nombre_actividad" : fila.nombre_actividad,
                                    "descripcion_actividad" : fila.descripcion_actividad,
                                    "observacion":fila.observacion,
                                    "fecha":fila.fecha,
                                    "valor":fila.valor,
                                    "costo_unitario":fila.costo_unitario,
                                    "parcial":fila.parcial
                                }
                            ]
                            
                        }else{
                            var historial = {
                                "item" : fila.item,
                                "descripcion_partida" : fila.descripcion_partida,
                                "nombre_actividad" : fila.nombre_actividad,
                                "descripcion_actividad" : fila.descripcion_actividad,
                                "observacion":fila.observacion,
                                "fecha":fila.fecha,
                                "valor":fila.valor,
                                "costo_unitario":fila.costo_unitario,
                                "parcial":fila.parcial
                            }
                            componente.historial.push(historial)

                        }
                        lastIdComponente = fila.id_componente

                        
                    }
                    componentes.push(componente);
                    callback(null,componentes);
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
            conn.query("SELECT t1.id_periodo, t1.numero_periodo, t1.numero, t1.id_componente, t1.nombre, t1.presupuesto, t1.valor_total_anterior, t1.valor_total_actual, t1.valor_suma_acumulado, t1.valor_total_saldo, t1.id_partida, t1.item, t1.descripcion, t1.metrado, t1.costo_unitario, t1.costo_unitario parcial, t1.metrado_anterior, t1.valor_anterior, t1.porcentaje_anterior, t2.metrado_actual, t2.valor_actual, t2.porcentaje_actual, t1.metrado_total, t1.valor_total, t1.porcentaje_total, t1.metrado_saldo, t1.valor_saldo, t1.porcentaje_saldo FROM (SELECT periodo.id_periodo, periodo.numero_periodo, componentes.numero, componentes.id_componente, componentes.nombre, componentes.presupuesto, 0 valor_total_anterior, 0 valor_total_actual, 0 valor_suma_acumulado, 0 valor_total_saldo, partidas.id_partida, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, 0 metrado_anterior, 0 valor_anterior, 0 porcentaje_anterior, 0 metrado_total, 0 valor_total, 0 porcentaje_total, 0 metrado_saldo, 0 valor_saldo, 0 porcentaje_saldo FROM presupuestos LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad CROSS JOIN (SELECT TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1 numero_periodo, historialestados.id_historialEstado, CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha) periodo LEFT JOIN componentes ON componentes.id_componente = partidas.componentes_id_componente GROUP BY periodo.id_periodo , partidas.id_partida) t1 LEFT JOIN (SELECT periodo.id_periodo, componentes.id_componente, partidas.id_partida, SUM(avanceactividades.valor) metrado_actual, SUM(avanceactividades.valor * partidas.costo_unitario) valor_actual, (SUM(avanceactividades.valor) / partidas.metrado) * 100 porcentaje_actual FROM presupuestos LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN componentes ON componentes.id_componente = partidas.componentes_id_componente INNER JOIN (SELECT TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1 numero_periodo, historialestados.id_historialEstado, CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha) periodo ON periodo.id_historialEstado = avanceactividades.historialEstados_id_historialEstado WHERE presupuestos.Fichas_id_ficha = ? GROUP BY periodo.id_periodo , partidas.id_partida) t2 ON t1.id_periodo = t2.id_periodo AND t1.id_componente = t2.id_componente AND t1.id_partida = t2.id_partida",id_ficha,(error,res)=>{
                if(error){
                    callback(error);
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
                        console.log("valor_actual",valor_total_actual);
                        

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
                                            "item":fila.item,
                                            "descripcion":fila.descripcion,
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
                                            "item":fila.item,
                                            "descripcion":fila.descripcion,
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
                            }else{
                                periodo.componentes[periodo.componentes.length-1].valor_total_actual =valor_total_actual
                                var partida = {
                                        "item":fila.item,
                                        "descripcion":fila.descripcion,
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
                                const partida = partidas[k];
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
                                

                                //formato de dos digitos
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

                            
                        }
                        
                    }

                    callback(null,periodos);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getAvanceById = (id_actividad,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('SELECT partida.id_partida, partida.tipo, partida.item, partida.descripcion, partida.unidad_medida, partida.metrado, partida.costo_unitario, partida.parcial, partida.avance_metrado, partida.avance_costo, partida.metrados_saldo, partida.metrados_costo_saldo, partida.porcentaje, actividades.id_actividad, actividades.nombre actividad_nombre, actividades.veces, actividades.largo, actividades.ancho, actividades.alto, actividades.parcial metrado_actividad, partida.costo_unitario, actividades.parcial * partida.costo_unitario parcial_actividad, SUM(avanceactividades.valor) actividad_avancce_metrado, SUM(avanceactividades.valor) * partida.costo_unitario actividad_avance_costo, actividades.parcial - SUM(avanceactividades.valor) actividad_metrados_saldo, (actividades.parcial - SUM(avanceactividades.valor)) * partida.costo_unitario actividad_metrados_costo_saldo, (SUM(avanceactividades.valor) / actividades.parcial) * 100 actividad_porcentaje FROM (SELECT partidas.Componentes_id_componente, partidas.presupuestos_id_Presupuesto, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor) * partidas.costo_unitario avance_costo, partidas.metrado - SUM(avanceactividades.valor) metrados_saldo, (partidas.metrado - SUM(avanceactividades.valor)) * partidas.costo_unitario metrados_costo_saldo, (SUM(avanceactividades.valor) / partidas.metrado) * 100 porcentaje FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY partidas.id_partida) partida LEFT JOIN actividades ON actividades.Partidas_id_partida = partida.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE partida.id_partida = (select actividades.Partidas_id_partida from actividades where actividades.id_actividad = ? limit 1) GROUP BY actividades.id_actividad',id_actividad,(err,res)=>{
                if(err){
                    console.log(err);
                    callback(err.code);
                }else{
                    var partida = {}
                    id_partida = -1
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if(fila.id_partida !=id_partida){                            
                            partida.id_partida = fila.id_partida
                            partida.tipo = fila.tipo
                            partida.item = fila.item
                            partida.descripcion = fila.descripcion
                            partida.unidad_medida = fila.unidad_medida
                            partida.metrado = fila.metrado
                            partida.costo_unitario = fila.costo_unitario
                            partida.parcial = fila.parcial
                            partida.avance_metrado = fila.avance_metrado
                            partida.avance_costo = fila.avance_costo
                            partida.metrados_saldo = fila.metrados_saldo
                            partida.metrados_costo_saldo = fila.metrados_costo_saldo
                            partida.porcentaje = fila.porcentaje
                            partida.actividades=[
                                {
                                    "id_actividad":fila.id_actividad,                       "actividad_nombre":fila.actividad_nombre,
                                    "veces":fila.veces,
                                    "largo":fila.largo,
                                    "ancho":fila.ancho,
                                    "alto":fila.alto,
                                    "metrado_actividad":fila.metrado_actividad,
                                    "parcial_actividad":fila.parcial_actividad,
                                    "actividad_avancce_metrado":fila.actividad_avancce_metrado,
                                    "actividad_avance_costo":fila.actividad_avance_costo,
                                    "actividad_metrados_saldo":fila.actividad_metrados_saldo,
                                    "actividad_metrados_costo_saldo":fila.actividad_metrados_costo_saldo,
                                    "actividad_porcentaje":fila.actividad_porcentaje
                                }
                            ]
                        }else{
                            partida.actividades.push(
                                {
                                    "id_actividad":fila.id_actividad,                       "actividad_nombre":fila.actividad_nombre,
                                    "veces":fila.veces,
                                    "largo":fila.largo,
                                    "ancho":fila.ancho,
                                    "alto":fila.alto,
                                    "metrado_actividad":fila.metrado_actividad,
                                    "parcial_actividad":fila.parcial_actividad,
                                    "actividad_avancce_metrado":fila.actividad_avancce_metrado,
                                    "actividad_avance_costo":fila.actividad_avance_costo,
                                    "actividad_metrados_saldo":fila.actividad_metrados_saldo,
                                    "actividad_metrados_costo_saldo":fila.actividad_metrados_costo_saldo,
                                    "actividad_porcentaje":fila.actividad_porcentaje
                                }
                            )

                        }
                        id_partida = fila.id_partida
                        console.log("idactividad",id_partida);
                        
                        
                    }
                  
                    
                    callback(null,partida);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}

module.exports = userModel;