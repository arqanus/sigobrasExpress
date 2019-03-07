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
            conn.query("SELECT fichas.id_ficha, fichas.f_entidad_finan entidad_financiera, fichas.modalidad_ejec modalidad_ejecucion, 'SIGOBRAS' fuente_informacion, CURDATE() fecha_actual, fichas.g_total_presu presupuesto, 0 ampliacion_presupuestal, TIMESTAMPDIFF(DAY, fichas.fecha_inicial, plazoejecucion.fechaEjecucion) plazo_ejecucion_inicial, 0 ampliacion_plazo_n, fichas.codigo, fichas.g_meta, fichas.g_total_presu, personal.nobre_cargo, personal.nombre_personal, TIMESTAMPDIFF(DAY, fichas.fecha_inicial, plazoejecucion.fechaEjecucion) plazo_ejecucion, fichas.fecha_inicial, plazoejecucion.fechaEjecucion, 0 dias_ampliados, 0 fecha_termino, 0 financiero_acumulado, 0 financiero_porcentaje_acumulado, Fisico.avance fisico_acumulado, Fisico.avance / fichas.g_total_presu * 100 fisico_porcentaje_acumulado, 0 ampliacion_acumulado, 0 ampliacion_porcentaje_acumulado, CONCAT(MONTHNAME(CURDATE()), ' ', YEAR(CURDATE())) mes_reportado, estados.nombre estado_obra, 0 metas_programadas, 0 mets_ejecutadas, 0 comentario FROM fichas LEFT JOIN plazoejecucion ON plazoejecucion.fichas_id_ficha = fichas.id_ficha LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.id_historialEstado = (SELECT MAX(id_historialEstado) FROM historialestados) LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN (SELECT fichas_has_accesos.Fichas_id_ficha id_ficha, cargos.nombre nobre_cargo, CONCAT(usuarios.nombre, ' ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno) nombre_personal FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN profesiones_has_usuarios ON profesiones_has_usuarios.usuarios_id_usuario = usuarios.id_usuario LEFT JOIN profesiones ON profesiones.id_profesion = profesiones_has_usuarios.Profesiones_id_profesion LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo) personal ON personal.id_ficha = fichas.id_ficha LEFT JOIN (SELECT presupuestos.Fichas_id_ficha id_ficha, SUM(avanceactividades.valor) avance FROM presupuestos LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY presupuestos.Fichas_id_ficha) Fisico ON Fisico.id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ?",id_ficha,(err,res)=>{
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






module.exports = userModel;
