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
userModel.getinformeControlEjecucionObras = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT fichas.id_ficha, fichas.f_entidad_finan entidad_financiera, fichas.modalidad_ejec modalidad_ejecucion, 'SIGOBRAS - subgerencia de obras' fuente_informacion, CURDATE() fecha_actual, fichas.g_total_presu presupuesto, 0 ampliacion_presupuestal, TIMESTAMPDIFF(DAY, fichas.fecha_inicial, plazoejecucion.fechaEjecucion) plazo_ejecucion_inicial, 0 ampliacion_plazo_n, fichas.codigo, fichas.g_meta, fichas.g_total_presu, personal.nobre_cargo, personal.nombre_personal, TIMESTAMPDIFF(DAY, fichas.fecha_inicial, plazoejecucion.fechaEjecucion) plazo_ejecucion, fichas.fecha_inicial, plazoejecucion.fechaEjecucion, 0 dias_ampliados, 0 fecha_termino, 0 financiero_acumulado, 0 financiero_porcentaje_acumulado, Fisico.avance fisico_acumulado, Fisico.avance / fichas.g_total_presu * 100 fisico_porcentaje_acumulado, 0 ampliacion_acumulado, 0 ampliacion_porcentaje_acumulado, CONCAT(MONTHNAME(CURDATE()), ' ', YEAR(CURDATE())) mes_reportado, estados.nombre estado_obra, 0 metas_programadas, 0 mets_ejecutadas, 0 comentario FROM fichas LEFT JOIN plazoejecucion ON plazoejecucion.fichas_id_ficha = fichas.id_ficha LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.id_historialEstado = (SELECT MAX(id_historialEstado) FROM historialestados) LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN (SELECT fichas_has_accesos.Fichas_id_ficha id_ficha, cargos.nombre nobre_cargo, CONCAT(usuarios.nombre, ' ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno) nombre_personal FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN profesiones_has_usuarios ON profesiones_has_usuarios.usuarios_id_usuario = usuarios.id_usuario LEFT JOIN profesiones ON profesiones.id_profesion = profesiones_has_usuarios.Profesiones_id_profesion LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo) personal ON personal.id_ficha = fichas.id_ficha LEFT JOIN (SELECT presupuestos.Fichas_id_ficha id_ficha, SUM(avanceactividades.valor) avance FROM presupuestos LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY presupuestos.Fichas_id_ficha) Fisico ON Fisico.id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ?",id_ficha,(err,res)=>{
                if(err){
                    console.log(err);
                    
                    callback(err.code);
                
                }
                else if(res.length == 0){
                    callback("vacio");
        
                }else{ 
                    fila = res[0];
                    var obra = {}
                    
                    obra.entidad_financiera =fila.entidad_financiera
                    obra.modalidad_ejecucion =fila.modalidad_ejecucion
                    obra.fuente_informacion =fila.fuente_informacion
                    obra.fecha_actual =fila.fecha_actual
                    obra.presupuesto =fila.presupuesto
                    obra.ampliacion_presupuestal =fila.ampliacion_presupuestal
                    obra.plazo_ejecucion_inicial =fila.plazo_ejecucion_inicial
                    obra.ampliacion_plazo_n =fila.ampliacion_plazo_n
                    obra.codigo =fila.codigo
                    obra.g_meta =fila.g_meta
                    obra.g_total_presu =fila.g_total_presu                    
                    obra.plazo_ejecucion =fila.plazo_ejecucion
                    obra.fecha_inicial =fila.fecha_inicial
                    obra.fechaEjecucion =fila.fechaEjecucion
                    obra.dias_ampliados =fila.dias_ampliados
                    obra.fecha_termino =fila.fecha_termino
                    obra.financiero_acumulado = formatoPorcentaje(fila.financiero_acumulado)
                    obra.financiero_porcentaje_acumulado = formatoPorcentaje(fila.financiero_porcentaje_acumulado)
                    obra.fisico_acumulado = formatoPorcentaje(fila.fisico_acumulado)
                    obra.fisico_porcentaje_acumulado = formatoPorcentaje(fila.fisico_porcentaje_acumulado)
                    obra.ampliacion_acumulado = formatoPorcentaje(fila.ampliacion_acumulado)
                    obra.ampliacion_porcentaje_acumulado = formatoPorcentaje(fila.ampliacion_porcentaje_acumulado)
                    obra.mes_reportado =fila.mes_reportado
                    obra.estado_obra =fila.estado_obra
                    obra.metas_programadas =fila.metas_programadas
                    obra.mets_ejecutadas =fila.mets_ejecutadas
                    obra.comentario =fila.comentario
                    obra.personal=[]

                    for (let i = 0; i < res.length; i++) {                        
                        obra.personal.push(
                            {
                                "nobre_cargo" :res[i].nobre_cargo,
                                "nombre_personal" :res[i].nombre_personal
                            }
                        )            
                    }
                    
                    callback(null,obra);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getInformeDataGeneral  = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT fichas.id_ficha, fichas.g_meta, fichas.g_total_presu presupuesto_general, MONTHNAME(NOW()) mes, fichas.tiempo_ejec plazo_de_ejecucion, tb_avance_actual.avance_actual, tb_avance_actual.avance_actual_valor, avance_acumulado.avance_acumulado, avance_acumulado.avance_acumulado_valor, fichas.g_local_reg region, fichas.g_local_prov provincia, fichas.g_local_dist distrito, residente.usuario residente, supervisor.usuario supervisor FROM fichas LEFT JOIN (SELECT id_ficha, SUM(valor) avance_acumulado, SUM(valor * costo_unitario) avance_acumulado_valor FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = id_ficha GROUP BY fichas.id_ficha) avance_acumulado ON avance_acumulado.id_ficha = fichas.id_ficha LEFT JOIN (SELECT id_ficha, SUM(valor) avance_actual, SUM(valor * costo_unitario) avance_actual_valor FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE MONTH(NOW()) = MONTH(avanceactividades.fecha) GROUP BY fichas.id_ficha) tb_avance_actual ON tb_avance_actual.id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas_has_accesos.Fichas_id_ficha, CONCAT(usuarios.nombre, ' ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno) usuario FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE cargos.nombre = 'residente' GROUP BY fichas_has_accesos.Fichas_id_ficha) residente ON residente.Fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas_has_accesos.Fichas_id_ficha, CONCAT(usuarios.nombre, ' ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno) usuario FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE cargos.nombre = 'supervisor' GROUP BY fichas_has_accesos.Fichas_id_ficha) supervisor ON supervisor.Fichas_id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ?",id_ficha,(err,res)=>{ if(err){
                    console.log(err);                    
                    callback(err.code);                
                }
                else if(res.length == 0){
                    callback("vacio");        
                }else{     
                    res[0].avance_actual = formatoPorcentaje(res[0].avance_actual)
                    res[0].avance_actual_valor = formatoPorcentaje(res[0].avance_actual_valor)
                    res[0].avance_acumulado = formatoPorcentaje(res[0].avance_acumulado)
                    res[0].avance_actual = formatoPorcentaje(res[0].avance_actual)
                    res[0].avance_acumulado_valor = formatoPorcentaje(res[0].avance_acumulado_valor)

                   


                    
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getCostosIndirectos  = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT  t1.nombre, t1.presupuesto, COALESCE(t2.anterior, 0) anterior, COALESCE(t2.anterior / t1.presupuesto * 100, 0) porcentaje_anterior, COALESCE(t1.actual, 0) actual, COALESCE(t1.actual / t1.presupuesto * 100, 0) porcentaje_actual, COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0) acumulado, (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0)) / COALESCE(t1.presupuesto, 0) * 100 porcentaje_acumuado, COALESCE(t1.presupuesto, 0) - (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0)) saldo, (COALESCE(t1.presupuesto, 0) - (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0))) / COALESCE(t1.presupuesto, 0) * 100 porcentaje_saldo FROM (SELECT costosyganancias.fichas_id_ficha, costosyganancias.id_costosyganancias, costosyganancias.nombre, costosyganancias.presupuesto, historialcyg.monto actual FROM costosyganancias LEFT JOIN historialcyg ON historialcyg.costosyganancias_id_costosyganancias = costosyganancias.id_costosyganancias WHERE MONTH(NOW()) = MONTH(historialcyg.fecha) GROUP BY costosyganancias.id_costosyganancias) t1 LEFT JOIN (SELECT costosyganancias.id_costosyganancias, historialcyg.monto anterior FROM costosyganancias LEFT JOIN historialcyg ON historialcyg.costosyganancias_id_costosyganancias = costosyganancias.id_costosyganancias WHERE MONTH(NOW()) > MONTH(historialcyg.fecha) GROUP BY costosyganancias.id_costosyganancias) t2 ON t1.id_costosyganancias = t2.id_costosyganancias where  t1.fichas_id_ficha =?",id_ficha,(err,res)=>{
                if(err){
                    console.log(err);                    
                    callback(err.code);                
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
userModel.resumenValorizacionPrincipal  = (id_ficha,costosIndirectos,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT  t1.numero, t1.nombre, t1.presupuesto, COALESCE(t2.anterior, 0) anterior, COALESCE(t2.anterior / t1.presupuesto * 100, 0) porcentaje_anterior, COALESCE(t1.actual, 0) actual, COALESCE(t1.actual / t1.presupuesto * 100, 0) porcentaje_actual, COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0) acumulado, (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0)) / COALESCE(t1.presupuesto, 0) * 100 porcentaje_acumuado, COALESCE(t1.presupuesto, 0) - (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0)) saldo, (COALESCE(t1.presupuesto, 0) - (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0))) / COALESCE(t1.presupuesto, 0) * 100 porcentaje_saldo FROM (SELECT presupuestos.Fichas_id_ficha, componentes.id_componente, componentes.numero, componentes.nombre, componentes.presupuesto, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) actual FROM presupuestos LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad INNER JOIN componentes ON componentes.id_componente = partidas.componentes_id_componente WHERE MONTH(NOW()) = MONTH(avanceactividades.fecha) GROUP BY componentes.id_componente) t1 LEFT JOIN (SELECT componentes.id_componente, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) anterior FROM presupuestos LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad INNER JOIN componentes ON componentes.id_componente = partidas.componentes_id_componente WHERE MONTH(NOW()) > MONTH(avanceactividades.fecha) GROUP BY componentes.id_componente) t2 ON t2.id_componente = t1.id_componente where  t1.fichas_id_ficha =?",id_ficha,(err,res)=>{
                if(err){
                    console.log(err);                    
                    callback(err.code);                
                }
                else if(res.length == 0){
                    callback("vacio");        
                }else{ 
                    var presupuesto = 0
                    var anterior = 0
                    var porcentaje_anterior = 0
                    var actual = 0
                    var porcentaje_actual = 0
                    var acumulado = 0
                    var porcentaje_acumuado = 0
                    var saldo = 0
                    var porcentaje_saldo = 0
                    //calculo de costo directo
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        presupuesto+=fila.presupuesto
                        anterior+=fila.anterior
                        porcentaje_anterior+=fila.porcentaje_anterior
                        actual+=fila.actual
                        porcentaje_actual+=fila.porcentaje_actual
                        acumulado+=fila.acumulado
                        porcentaje_acumuado+=fila.porcentaje_acumuado
                        saldo+=fila.saldo
                        porcentaje_saldo+=fila.porcentaje_saldo

                        fila.presupuesto = formatoPorcentaje(fila.presupuesto)
                        fila.anterior = formatoPorcentaje(fila.anterior)
                        fila.porcentaje_anterior = formatoPorcentaje(fila.porcentaje_anterior)
                        fila.actual = formatoPorcentaje(fila.actual)
                        fila.porcentaje_actual = formatoPorcentaje(fila.porcentaje_actual)
                        fila.acumulado = formatoPorcentaje(fila.acumulado)
                        fila.porcentaje_acumuado = formatoPorcentaje(fila.porcentaje_acumuado)
                        fila.saldo = formatoPorcentaje(fila.saldo)
                        fila.porcentaje_saldo = formatoPorcentaje(fila.porcentaje_saldo)
                    }
                    //calculo de costo Indirecto
                    var presupuesto2 = 0
                    var anterior2 = 0
                    var porcentaje_anterior2 = 0
                    var actual2 = 0
                    var porcentaje_actual2 = 0
                    var acumulado2 = 0
                    var porcentaje_acumuado2 = 0
                    var saldo2 = 0
                    var porcentaje_saldo2 = 0
                    for (let i = 0; i < costosIndirectos.length; i++) {
                        const fila = costosIndirectos[i];
                        presupuesto2+=fila.presupuesto
                        anterior2+=fila.anterior
                        porcentaje_anterior2+=fila.porcentaje_anterior
                        actual2+=fila.actual
                        porcentaje_actual2+=fila.porcentaje_actual
                        acumulado2+=fila.acumulado
                        porcentaje_acumuado2+=fila.porcentaje_acumuado
                        saldo2+=fila.saldo
                        porcentaje_saldo2+=fila.porcentaje_saldo

                        fila.presupuesto = formatoPorcentaje(fila.presupuesto)
                        fila.anterior = formatoPorcentaje(fila.anterior)
                        fila.porcentaje_anterior = formatoPorcentaje(fila.porcentaje_anterior)
                        fila.actual = formatoPorcentaje(fila.actual)
                        fila.porcentaje_actual = formatoPorcentaje(fila.porcentaje_actual)
                        fila.acumulado = formatoPorcentaje(fila.acumulado)
                        fila.porcentaje_acumuado = formatoPorcentaje(fila.porcentaje_acumuado)
                        fila.saldo = formatoPorcentaje(fila.saldo)
                        fila.porcentaje_saldo = formatoPorcentaje(fila.porcentaje_saldo)
                    }
                    var datatemp = 
                    {
                        componentes:res,
                        costosDirecto:[
                            {
                                "numero":"",
                                "nombre":"COSTO DIRECTO",
                                "presupuesto":formatoPorcentaje( presupuesto),
                                "anterior":formatoPorcentaje( anterior),
                                "porcentaje_anterior":formatoPorcentaje( porcentaje_anterior),
                                "actual":formatoPorcentaje( actual),
                                "porcentaje_actual":formatoPorcentaje( porcentaje_actual),
                                "acumulado":formatoPorcentaje( acumulado),
                                "porcentaje_acumuado":formatoPorcentaje( porcentaje_acumuado),
                                "saldo":formatoPorcentaje( saldo),
                                "porcentaje_saldo":formatoPorcentaje( porcentaje_saldo)
                            }
                            

                        ],

                        costosindirectos:costosIndirectos,
                        costoIndirectoTotal:[
                            {
                                "numero": "",
                                "nombre": "COSTO INDIRECTO TOTAL",
                                "presupuesto":formatoPorcentaje( presupuesto2),
                                "anterior":formatoPorcentaje( anterior2),
                                "porcentaje_anterior":formatoPorcentaje( porcentaje_anterior2),
                                "actual":formatoPorcentaje( actual2),
                                "porcentaje_actual":formatoPorcentaje( porcentaje_actual2),
                                "acumulado":formatoPorcentaje( acumulado2),
                                "porcentaje_acumuado":formatoPorcentaje( porcentaje_acumuado2),
                                "saldo":formatoPorcentaje( saldo2),
                                "porcentaje_saldo":formatoPorcentaje( porcentaje_saldo2)
                            }                            

                        ],
                        ejecutadoTotalExpediente:[
                            {
                                "numero": "",
                                "nombre": "COSTO INDIRECTO TOTAL",
                                "presupuesto":formatoPorcentaje(presupuesto+presupuesto2),
                                "anterior":formatoPorcentaje(anterior+anterior2),
                                "porcentaje_anterior":formatoPorcentaje(porcentaje_anterior+porcentaje_anterior2),
                                "actual":formatoPorcentaje(actual+actual2),
                                "porcentaje_actual":formatoPorcentaje(porcentaje_actual+porcentaje_actual2),
                                "acumulado":formatoPorcentaje(acumulado+acumulado2),
                                "porcentaje_acumuado":formatoPorcentaje(porcentaje_acumuado+porcentaje_acumuado2),
                                "saldo":formatoPorcentaje(saldo+saldo2),
                                "porcentaje_saldo":formatoPorcentaje(porcentaje_saldo+porcentaje_saldo2)
                            }                            

                        ]
                       
                        
                    }
             

                                      


                    
                    callback(null,datatemp);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}

userModel.getMonthsByFicha = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT IF(estados.codigo != 'C', CONCAT('METRADO ',UPPER(MONTHNAME(historialestados.fecha))), 'METRADO CORTE') mes, CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial_real, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE historialestados.Fichas_id_ficha = 77 AND estados.codigo != 'P' AND estados.codigo != 'A' ORDER BY historialestados.id_historialEstado",id_ficha,(err,res)=>{ if(err){
                    console.log(err);                    
                    callback(err.code);                
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
userModel.resumenAvanceFisicoPartidasObraMes = (meses,id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            //creaciion de query

            var cabeceras = [
                "ITEM",
                "PARTIDAS",
                "UND",
                "METRADO BASE",
                "METRADO ACUMULADO",
                "METRADO SALDO",    
            ]
            

            var query= "SELECT componentes.id_componente, componentes.numero, componentes.nombre, componentes.presupuesto, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado,"
            for (let i = 0; i < meses.length; i++) {
                const mes = meses[i];
                console.log(mes);
                query = query.concat("r"+i+".avance_acumulado r"+i+",")

                //cabeceras                
                cabeceras.splice(i+4,0,mes.mes)

                
            }
            console.log("cabeceras",cabeceras);
            
            query = query.concat("SUM(avanceactividades.valor) avance_acumulado, SUM(metrado - valor) saldo FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad left join componentes on componentes.id_componente = partidas.componentes_id_componente ")

            for (let i = 0; i < meses.length; i++) {
                const mes = meses[i];
                console.log(mes);
                query = query.concat("LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) avance_acumulado FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial_real, avanceactividades.fecha) + 1, '.', avanceactividades.historialEstados_id_historialEstado) = "+mes.id_periodo+" GROUP BY partidas.id_partida) r"+i+" ON r"+i+".id_partida = partidas.id_partida ")
                
            }
            query = query.concat("WHERE fichas.id_ficha = ? GROUP BY partidas.id_partida order by componentes.id_componente")
            
                       
            conn.query(query,id_ficha,(err,res)=>{
                if(err){
                    console.log(err);                    
                    callback(err.code);                
                }
                else if(res.length == 0){
                    callback("vacio");   
                }else{  
                    // var dataTotal = [
                    //     cabeceras
                    // ]    
                    var componentes = []  
                    var componente = {}
                    var lastIdComponente = -1
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if(lastIdComponente != fila.id_componente){
                            if(i >0){
                                componentes.push(componente)
                                componente = {}
                                console.log("idcomponente",componente.numero);
                                console.log("numero",componentes[0].numero);
                                // callback(null,componentes);s
                                
                            }
                            componente.numero =  fila.numero
                            componente.nombre =  fila.nombre
                            componente.presupuesto =  fila.presupuesto
                            componente.partidas = [
                                cabeceras,
                                [
                                    fila.item,
                                    fila.descripcion,
                                    fila.unidad_medida,
                                    fila.metrado,
                                    fila.r0,
                                    fila.r1,
                                    fila.avance_acumulado,            
                                    fila.saldo
                                ]                                
                            ]
                         
                        }else{
                            componente.partidas.push(
                                [
                                    fila.item,
                                    fila.descripcion,
                                    fila.unidad_medida,
                                    fila.metrado,
                                    fila.r0,
                                    fila.r1,
                                    fila.avance_acumulado,            
                                    fila.saldo
                                ]                                
                            )
                        }
                        lastIdComponente = fila.id_componente
                        
                        
                          
                        
                    }
                    componentes.push(componente)
                    callback(null,componentes);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}




module.exports = userModel;

