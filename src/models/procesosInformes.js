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
            conn.query("SELECT fichas.id_ficha, fichas.g_meta, fichas.g_total_presu presupuesto_general, MONTHNAME(NOW()) mes, fichas.tiempo_ejec plazo_de_ejecucion, tb_avance_actual.avance_actual, tb_avance_actual.avance_actual_valor, avance_acumulado.avance_acumulado, avance_acumulado.avance_acumulado_valor, fichas.g_local_reg region, fichas.g_local_prov provincia, fichas.g_local_dist distrito, tb_cargos.nombre_cargo, tb_cargos.nombre_personal FROM fichas LEFT JOIN (SELECT id_ficha, SUM(valor) avance_acumulado, SUM(valor * costo_unitario) avance_acumulado_valor FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = id_ficha GROUP BY fichas.id_ficha) avance_acumulado ON avance_acumulado.id_ficha = fichas.id_ficha LEFT JOIN (SELECT id_ficha, SUM(valor) avance_actual, SUM(valor * costo_unitario) avance_actual_valor FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE MONTH(NOW()) = MONTH(avanceactividades.fecha) GROUP BY fichas.id_ficha) tb_avance_actual ON tb_avance_actual.id_ficha = fichas.id_ficha LEFT JOIN (SELECT id_ficha, cargos.nombre nombre_cargo, CONCAT(usuarios.nombre, ' ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno) nombre_personal FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo INNER JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario) tb_cargos ON tb_cargos.id_ficha = fichas.id_ficha where fichas.id_ficha = ?",id_ficha,(err,res)=>{
                if(err){
                    console.log(err);                    
                    callback(err.code);                
                }
                else if(res.length == 0){
                    callback("vacio");        
                }else{     
                    var obra = {}
                    console.log(res);
                    obra.g_meta = res[0].g_meta
                    obra.presupuesto_general = res[0].presupuesto_general
                    obra.mes = res[0].mes
                    obra.plazo_de_ejecucion = res[0].plazo_de_ejecucion
                    obra.avance_actual = res[0].avance_actual
                    obra.avance_actual_valor = res[0].avance_actual_valor
                    obra.avance_acumulado = res[0].avance_acumulado
                    obra.avance_acumulado_valor = res[0].avance_acumulado_valor
                    obra.region = res[0].region
                    obra.provincia = res[0].provincia
                    obra.distrito = res[0].distrito
                    obra.personal = []
                    for (let i = 0; i < res.length; i++) {
                        
                        obra.personal.push(
                            {
                                "nombre_cargo":res[i].nombre_cargo,
                                "nombre_personal":res[i].nombre_personal
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
userModel.resumenValorizacionPrincipal  = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT componentes.numero, componentes.nombre, componentes.presupuesto,0 porcentaje, 0 anterior_valorizado, 0 anterior_porcentaj, ROUND(if (sum(avanceactividades.valor*partidas.costo_unitario) is null,0,sum(avanceactividades.valor*partidas.costo_unitario)),2) actual_valorizado, 0 actual_porcentaje, 0 acumulado_valorizado, 0 acumulado_porcentaje FROM presupuestos LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad INNER JOIN componentes ON componentes.id_componente = partidas.componentes_id_componente where presupuestos.Fichas_id_ficha = ? GROUP BY componentes.id_componente",id_ficha,(err,res)=>{
                if(err){
                    console.log(err);                    
                    callback(err.code);                
                }
                else if(res.length == 0){
                    callback("vacio");        
                }else{ 
                    var presupuesto = 0
                    var actual_valorizado = 0
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        presupuesto +=fila.presupuesto
                        actual_valorizado +=fila.actual_valorizado
                        
                    }
                    
                    res.push(
                        {
                            "numero": "",
                            "nombre": "COSTO DIRECTO",
                            "presupuesto": presupuesto,
                            "porcentaje": 100.00,
                            "anterior_valorizado": 0,
                            "anterior_porcentaj": 0,
                            "actual_valorizado": actual_valorizado,
                            "actual_porcentaje": "",
                            "acumulado_valorizado": 0,
                            "acumulado_porcentaje": 0
                        }
                    )
                    res.push(
                        {
                            "numero": "",
                            "nombre": "COSTO INDIRECTO",
                            "presupuesto": 196309,
                            "porcentaje": "",
                            "anterior_valorizado": 0,
                            "anterior_porcentaj": 0,
                            "actual_valorizado": 0,
                            "actual_porcentaje": 0,
                            "acumulado_valorizado": 0,
                            "acumulado_porcentaje": 0
                        }
                    )
                    res.push(
                        {
                            "numero": "",
                            "nombre": "GASTOS GENERALES",
                            "presupuesto": 155209,
                            "porcentaje": 79.06,
                            "anterior_valorizado": 0,
                            "anterior_porcentaj": 0,
                            "actual_valorizado": 0,
                            "actual_porcentaje": 0,
                            "acumulado_valorizado": 0,
                            "acumulado_porcentaje": 0
                        }
                    )
                    res.push(
                        {
                            "numero": "",
                            "nombre": "GASTOS DE GESTION DE PROYECTO",
                            "presupuesto": 3620,
                            "porcentaje": 1.84,
                            "anterior_valorizado": 0,
                            "anterior_porcentaj": 0,
                            "actual_valorizado": 0,
                            "actual_porcentaje": 0,
                            "acumulado_valorizado": 0,
                            "acumulado_porcentaje": 0
                        }
                    )
                    res.push(
                        {
                            "numero": "",
                            "nombre": "GASTOS DE GESTION DE PROYECTO",
                            "presupuesto": 37480,
                            "porcentaje": 19.09,
                            "anterior_valorizado": 0,
                            "anterior_porcentaj": 0,
                            "actual_valorizado": 0,
                            "actual_porcentaje": 0,
                            "acumulado_valorizado": 0,
                            "acumulado_porcentaje": 0
                        }
                    )
                    res.push(
                        {
                            "numero": "",
                            "nombre": "EJECUTADO DEL PRESUPUESTO TOTAL SEGUN EXP",
                            "presupuesto": presupuesto+196309,
                            "porcentaje": "100",
                            "anterior_valorizado": 0,
                            "anterior_porcentaj": 0,
                            "actual_valorizado": 0,
                            "actual_porcentaje": 0,
                            "acumulado_valorizado": 0,
                            "acumulado_porcentaje": 0
                        }
                    )
                    res.push(
                        {
                            "numero": "",
                            "nombre": "GASTOS DE GESTION DE PROYECTO",
                            "presupuesto": presupuesto,
                            "porcentaje": "",
                            "anterior_valorizado": 0,
                            "anterior_porcentaj": 0,
                            "actual_valorizado": 0,
                            "actual_porcentaje": 0,
                            "acumulado_valorizado": 0,
                            "acumulado_porcentaje": 0
                        }
                    )
             

                                      


                    
                    callback(null,res);
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
