const pool = require('../../../../db/connection');
let userModel = {};

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
function formatoFecha(fecha){
	var currentDate = new Date(fecha);

	var date = currentDate.getDate();
	var month = currentDate.getMonth(); //Be careful! January is 0 not 1
	var year = currentDate.getFullYear();
    // return "2"
	return date + "-" +(month + 1) + "-" + year;

}
//data cabecera
userModel.getInformeDataGeneral  = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT fichas.id_ficha, fichas.g_meta, fichas.g_total_presu presupuesto_general, MONTHNAME(NOW()) mes, fichas.tiempo_ejec plazo_de_ejecucion, tb_avance_actual.avance_actual, tb_avance_actual.avance_actual_valor, avance_acumulado.avance_acumulado, avance_acumulado.avance_acumulado_valor, fichas.g_local_reg region, fichas.g_local_prov provincia, fichas.g_local_dist distrito, fichas.lugar, residente.usuario residente, supervisor.usuario supervisor, tb_avance_actual.avance_actual_valor/fichas.g_total_presu*100 porcentaje_avance_fisico, avance_acumulado.avance_acumulado_valor/fichas.g_total_presu*100 porcentaje_avance_acumulado FROM fichas LEFT JOIN (SELECT id_ficha, SUM(valor) avance_acumulado, SUM(valor * costo_unitario) avance_acumulado_valor FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = id_ficha GROUP BY fichas.id_ficha) avance_acumulado ON avance_acumulado.id_ficha = fichas.id_ficha LEFT JOIN (SELECT id_ficha, SUM(valor) avance_actual, SUM(valor * costo_unitario) avance_actual_valor FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE MONTH(NOW()) = MONTH(avanceactividades.fecha) GROUP BY fichas.id_ficha) tb_avance_actual ON tb_avance_actual.id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas_has_accesos.Fichas_id_ficha, CONCAT(usuarios.nombre, ' ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno) usuario FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE cargos.nombre = 'residente' GROUP BY fichas_has_accesos.Fichas_id_ficha) residente ON residente.Fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas_has_accesos.Fichas_id_ficha, CONCAT(usuarios.nombre, ' ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno) usuario FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE cargos.nombre = 'supervisor' GROUP BY fichas_has_accesos.Fichas_id_ficha) supervisor ON supervisor.Fichas_id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ?",id_ficha,(err,res)=>{ 
                if(err){
                    console.log(err);                    
                    callback(err.code);                 
                }
                else if(res.length == 0){
                    callback("vacio");    
                    conn.destroy()    
                }else{     
                    res[0].porcentaje_avance_fisico = formatoPorcentaje(res[0].porcentaje_avance_fisico)
                    res[0].porcentaje_avance_acumulado = formatoPorcentaje(res[0].porcentaje_avance_acumulado)

                    res[0].avance_actual = formatoPorcentaje(res[0].avance_actual)
                    res[0].avance_actual_valor = formatoPorcentaje(res[0].avance_actual_valor)
                    res[0].avance_acumulado = formatoPorcentaje(res[0].avance_acumulado)
                    res[0].avance_actual = formatoPorcentaje(res[0].avance_actual)
                    res[0].avance_acumulado_valor = formatoPorcentaje(res[0].avance_acumulado_valor)
                    res[0].presupuesto_general = formatoPorcentaje(res[0].presupuesto_general)                 
                    
                   


                    
                    callback(null,res[0]);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
//6.1 cuadro demetradosEJECUTADOS
userModel.CuadroMetradosEjecutados = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('SELECT componentes.id_componente, componentes.numero, componentes.nombre nombre_componente, partidas.item, partidas.descripcion descripcion_partida, actividades.nombre nombre_actividad, avanceactividades.descripcion descripcion_actividad, avanceactividades.observacion, DATE(avanceactividades.fecha) fecha, avanceactividades.valor, partidas.costo_unitario, avanceactividades.valor * partidas.costo_unitario parcial FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida RIGHT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE componentes.Fichas_id_ficha = ? ORDER BY componentes.id_componente , avanceactividades.fecha DESC , partidas.id_partida',id_ficha,(err,res)=>{
                if(err){
                    console.log(err);
                    callback(err.code);
                }else if(res.length==0){
                    console.log("vacio");
                    callback("vacio");
                }else{                    
                    // console.log("res",res); 
                    var lastIdComponente = -1
                    var componentes = []
                    var componente = {}
                    var componente_avance_valor = 0
                    var fecha_avance_valor = 0
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        console.log("fila",fila.id_componente)
                        fila.fecha = fila.fecha.getDate()+" de "+month[fila.fecha.getMonth()]+" del "+fila.fecha.getFullYear()
                        //calculo delavance por componente y fecha
                        componente_avance_valor +=fila.parcial
                        fecha_avance_valor +=fila.parcial

                        if(fila.id_componente != lastIdComponente){
                            if(i != 0 ){
                                componente.componente_avance_valor = formatoPorcentaje(componente_avance_valor)
                                componente.fechas[componente.fechas.length-1].fecha_avance_valor = formatoPorcentaje(fecha_avance_valor)
                                componentes.push(componente);
                                componente = {}
                                componente_avance_valor = 0
                                fecha_avance_valor = 0
                            }   

                            
                            componente.id_componente = fila.id_componente
                            componente.numero = fila.numero
                            componente.nombre_componente = fila.nombre_componente
                            componente.componente_avance_valor = 0
                            componente.fechas = [
                                {
                                    "fecha": fila.fecha,
                                    
                                    "fecha_avance_valor":0,
                                    "historial":[
                                        {
                                            "item" : fila.item,
                                            "descripcion_partida" : fila.descripcion_partida,
                                            "nombre_actividad" : fila.nombre_actividad,
                                            "descripcion_actividad" : fila.descripcion_actividad,
                                            "observacion":fila.observacion,                 
                                            "valor":fila.valor,
                                            "costo_unitario":fila.costo_unitario,
                                            "parcial":formatoPorcentaje( fila.parcial)
                                        }
                                    ]
                                }
                                
                            ]                         
                            
                        }
                        else{
                            if(fila.fecha != lastFecha){
                                componente.fechas[componente.fechas.length-1].fecha_avance_valor = fecha_avance_valor
                                componente.fechas.push(
                                    {
                                        "fecha": fila.fecha,
                                        
                                        "fecha_avance_valor":0,
                                        "historial":[
                                            {
                                                "item" : fila.item,
                                                "descripcion_partida" : fila.descripcion_partida,
                                                "nombre_actividad" : fila.nombre_actividad,
                                                "descripcion_actividad" : fila.descripcion_actividad,
                                                "observacion":fila.observacion,                 
                                                "valor":fila.valor,
                                                "costo_unitario":fila.costo_unitario,
                                                "parcial":formatoPorcentaje( fila.parcial)
                                            }
                                        ]
                                    }
                                    
                                )   
                            }else{
                                componente.fechas[componente.fechas.length-1].historial.push(
                                    {
                                        "item" : fila.item,
                                        "descripcion_partida" : fila.descripcion_partida,
                                        "nombre_actividad" : fila.nombre_actividad,
                                        "descripcion_actividad" : fila.descripcion_actividad,
                                        "observacion":fila.observacion,                 
                                        "valor":fila.valor,
                                        "costo_unitario":fila.costo_unitario,
                                        "parcial":formatoPorcentaje( fila.parcial)
                                    }
                                )
                            }

                            

                        }
                        lastIdComponente = fila.id_componente
                        lastFecha = fila.fecha

                        
                    }

                    componente.componente_avance_valor = formatoPorcentaje(componente_avance_valor)
                    componente.fechas[componente.fechas.length-1].fecha_avance_valor = formatoPorcentaje(fecha_avance_valor)
                    componentes.push(componente);
                    
                    callback(null,componentes);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}

//6.2 VAORIZACION PRINCIPALDELAOBRA-PRESUPUESTO-BASE
userModel.valorizacionPrincipal = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT t1.Fichas_id_ficha, t1.id_historialEstado, t1.id_periodo, t1.numero_periodo, t1.numero, t1.id_componente, t1.nombre, t1.presupuesto, 0 valor_total_anterior, 0 valor_total_actual, 0 valor_suma_acumulado, 0 valor_total_saldo, t1.id_partida, t1.tipo, t1.item, t1.descripcion, t1.unidad_medida, t1.metrado, t1.costo_unitario, t1.costo_unitario * t1.metrado parcial, 0 metrado_anterior, 0 valor_anterior, 0 porcentaje_anterior, t2.metrado_actual, t2.valor_actual, t2.porcentaje_actual, 0 metrado_total, 0 valor_total, 0 porcentaje_total, 0 metrado_saldo, 0 valor_saldo, 0 porcentaje_saldo FROM (SELECT periodo.id_periodo, periodo.id_historialEstado, (CONCAT(periodo.codigo, periodo.numero)) numero_periodo, componentes.fichas_id_ficha, componentes.numero, componentes.id_componente, componentes.nombre, componentes.presupuesto, partida.id_partida, partida.tipo, partida.item, partida.unidad_medida, partida.descripcion, partida.metrado, partida.costo_unitario, partida.metrado * partida.costo_unitario parcial FROM componentes INNER JOIN (SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.unidad_medida, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.componentes_id_componente FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL GROUP BY partidas.id_partida) partida ON partida.componentes_id_componente = componentes.id_componente CROSS JOIN (SELECT TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1 numero, estados.codigo codigo, historialestados.id_historialEstado, CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE historialestados.Fichas_id_ficha = ?) periodo) t1 LEFT JOIN (SELECT periodo.id_periodo, componentes.id_componente, partidas.id_partida, SUM(avanceactividades.valor) metrado_actual, SUM(avanceactividades.valor * partidas.costo_unitario) valor_actual, (SUM(avanceactividades.valor) / partidas.metrado) * 100 porcentaje_actual FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad INNER JOIN (SELECT CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo, historialestados.id_historialestado FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) periodo ON periodo.id_historialEstado = avanceactividades.historialEstados_id_historialEstado GROUP BY periodo.id_periodo , partidas.id_partida) t2 ON t1.id_periodo = t2.id_periodo AND t1.id_componente = t2.id_componente AND t1.id_partida = t2.id_partida WHERE t1.numero IS NOT NULL AND t1.Fichas_id_ficha = ? ORDER BY t1.id_historialEstado , t1.id_partida",[id_ficha,id_ficha],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");
                    
                    callback("vacio");
                
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
                                
                                //partida valor saldo
                                partida.valor_saldo = partida.parcial - partida.valor_total
                                
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
                                if(partida.tipo =="titulo"){
                                    partida.unidad_medida = ""
                                    partida.metrado = ""
                                    partida.costo_unitario = ""
                                    partida.parcial = ""
    
                                    partida.metrado_anterior = ""
                                    partida.valor_anterior = ""
                                    partida.porcentaje_anterior = ""
                                    partida.metrado_actual = ""
                                    partida.valor_actual = ""
                                    partida.porcentaje_actual = ""
                                    partida.metrado_total = ""
                                    partida.valor_total = ""
                                    partida.porcentaje_total = ""
                                    partida.metrado_saldo = ""
                                    partida.valor_saldo = ""
                                    partida.porcentaje_saldo = ""
                                }else{
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
                        
                    }

                    callback(null,periodos);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
//6.3 resumen delavalorizacion principaldelaobrapresupuestobase
userModel.getCostosIndirectos  = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT t1.nombre, t1.presupuesto, COALESCE(t2.anterior, 0) anterior, COALESCE(t2.anterior / t1.presupuesto * 100, 0) porcentaje_anterior, COALESCE(t1.actual, 0) actual, COALESCE(t1.actual / t1.presupuesto * 100, 0) porcentaje_actual, COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0) acumulado, (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0)) / COALESCE(t1.presupuesto, 0) * 100 porcentaje_acumuado, COALESCE(t1.presupuesto, 0) - (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0)) saldo, (COALESCE(t1.presupuesto, 0) - (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0))) / COALESCE(t1.presupuesto, 0) * 100 porcentaje_saldo FROM (SELECT costosindirectos.fichas_id_ficha, costosindirectos.id_CostoIndirecto, costosindirectos.nombre, costosindirectos.presupuesto, historialcostosindirectos.monto actual FROM costosindirectos LEFT JOIN historialcostosindirectos ON historialcostosindirectos.CostosIndirectos_id_CostoIndirecto = costosindirectos.id_CostoIndirecto WHERE MONTH(NOW()) = MONTH(historialcostosindirectos.fecha) GROUP BY costosindirectos.id_CostoIndirecto) t1 LEFT JOIN (SELECT costosindirectos.id_CostoIndirecto, historialcostosindirectos.monto anterior FROM costosindirectos LEFT JOIN historialcostosindirectos ON historialcostosindirectos.CostosIndirectos_id_CostoIndirecto = costosindirectos.id_CostoIndirecto WHERE MONTH(NOW()) > MONTH(historialcostosindirectos.fecha) GROUP BY costosindirectos.id_CostoIndirecto) t2 ON t1.id_CostoIndirecto = t2.id_CostoIndirecto WHERE t1.fichas_id_ficha = ?",id_ficha,(err,res)=>{
                if(err){
                    console.log(err);                    
                    callback(err.code);                
                }
                else{    
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
            conn.query("SELECT t1.numero, t1.nombre, t1.presupuesto, COALESCE(t2.anterior, 0) anterior, COALESCE(t2.anterior / t1.presupuesto * 100, 0) porcentaje_anterior, COALESCE(t1.actual, 0) actual, COALESCE(t1.actual / t1.presupuesto * 100, 0) porcentaje_actual, COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0) acumulado, (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0)) / COALESCE(t1.presupuesto, 0) * 100 porcentaje_acumuado, COALESCE(t1.presupuesto, 0) - (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0)) saldo, (COALESCE(t1.presupuesto, 0) - (COALESCE(t2.anterior, 0) + COALESCE(t1.actual, 0))) / COALESCE(t1.presupuesto, 0) * 100 porcentaje_saldo FROM (SELECT componentes.Fichas_id_ficha, componentes.id_componente, componentes.numero, componentes.nombre, componentes.presupuesto, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) actual FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE MONTH(NOW()) = MONTH(avanceactividades.fecha) GROUP BY componentes.id_componente) t1 LEFT JOIN (SELECT componentes.id_componente, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) anterior FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE MONTH(NOW()) > MONTH(avanceactividades.fecha) GROUP BY componentes.id_componente) t2 ON t2.id_componente = t1.id_componente WHERE t1.fichas_id_ficha = ?",id_ficha,(err,res)=>{
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
                        mes:month[new Date().getMonth()],
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
//6.4 vaorizacion pormayores metrados
userModel.getValGeneralExtras = (id_ficha,tipo,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query(" SELECT t1.Fichas_id_ficha, t1.id_historialEstado, t1.id_periodo, t1.numero_periodo, t1.numero, t1.id_componente, t1.nombre, t1.presupuesto, 0 valor_total_anterior, 0 valor_total_actual, 0 valor_suma_acumulado, 0 valor_total_saldo, t1.id_partida, t1.tipo, t1.item, t1.descripcion, t1.unidad_medida, t1.metrado, t1.costo_unitario, t1.costo_unitario * t1.metrado parcial, 0 metrado_anterior, 0 valor_anterior, 0 porcentaje_anterior, t2.metrado_actual, t2.valor_actual, t2.porcentaje_actual, 0 metrado_total, 0 valor_total, 0 porcentaje_total, 0 metrado_saldo, 0 valor_saldo, 0 porcentaje_saldo FROM (SELECT periodo.id_periodo, periodo.id_historialEstado, (CONCAT(periodo.codigo, periodo.numero)) numero_periodo, componentes.Fichas_id_ficha, componentes.numero, componentes.id_componente, componentes.nombre, componentes.presupuesto, partida.id_partida, partida.tipo, partida.item, partida.unidad_medida, partida.descripcion, partida.metrado, partida.costo_unitario, partida.metrado * partida.costo_unitario parcial FROM componentes INNER JOIN (SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.unidad_medida, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.componentes_id_componente FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = ? GROUP BY partidas.id_partida) partida ON partida.componentes_id_componente = componentes.id_componente CROSS JOIN (SELECT TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1 numero, estados.codigo codigo, historialestados.id_historialEstado, CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE historialestados.Fichas_id_ficha = ?) periodo) t1 LEFT JOIN (SELECT periodo.id_periodo, componentes.id_componente, partidas.id_partida, SUM(avanceactividades.valor) metrado_actual, SUM(avanceactividades.valor * partidas.costo_unitario) valor_actual, (SUM(avanceactividades.valor) / partidas.metrado) * 100 porcentaje_actual FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad INNER JOIN (SELECT CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo, historialestados.id_historialestado FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) periodo ON periodo.id_historialEstado = avanceactividades.historialEstados_id_historialEstado GROUP BY periodo.id_periodo , partidas.id_partida) t2 ON t1.id_periodo = t2.id_periodo AND t1.id_componente = t2.id_componente AND t1.id_partida = t2.id_partida WHERE t1.numero IS NOT NULL AND t1.Fichas_id_ficha = ? ORDER BY t1.id_historialEstado , t1.id_partida",[tipo,id_ficha,id_ficha],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");
                    
                    callback("vacio");
                
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
//6.5 valorizacion de partidas nuevas
//getvalgeneralExtras
//6.6 consolidado general de las valorizacines

//6.7 resumen de avan ce fisico de las partidas de obra por mes 
userModel.getMonthsByFicha = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT IF(estados.codigo != 'C', CONCAT('METRADO ',UPPER(MONTHNAME(historialestados.fecha))), 'METRADO CORTE') mes, CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial_real, historialestados.fecha) + 1, '.', historialestados.id_historialestado) id_periodo FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE historialestados.Fichas_id_ficha = ? AND estados.codigo != 'P' AND estados.codigo != 'A' ORDER BY historialestados.id_historialEstado",id_ficha,(err,res)=>{ if(err){
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
            
            query = query.concat("SUM(avanceactividades.valor) avance_acumulado, SUM(metrado - valor) saldo FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad ")

            for (let i = 0; i < meses.length; i++) {
                const mes = meses[i];
                console.log(mes);
                query = query.concat(" LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) avance_acumulado FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE CONCAT(TIMESTAMPDIFF(MONTH, fichas.fecha_inicial_real, avanceactividades.fecha) + 1, '.', avanceactividades.historialEstados_id_historialEstado) = "+mes.id_periodo+" GROUP BY partidas.id_partida) r"+i+" ON r"+i+".id_partida = partidas.id_partida ")
                
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
//6.8 avance mensual comparativos de acuerdo al presupuesto delaobra y mesavance comparativos
//6.9 avance comparativ diagraa degantt
//6.10 histograma del avance de obras curva s
//6.11 proyeccion de trabajos prosxioms mes cronograma
//6.12 informe
userModel.getcronograma = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("SELECT fichas_id_ficha, porcentaje_programado, porcentaje_financiero, t1.fecha, t1.Anyo_Mes, porcentaje_fisico FROM (SELECT fichas_id_ficha, programado porcentaje_programado, financieroEjecutado porcentaje_financiero, DATE_ADD(fichas.fecha_inicial_real, INTERVAL (mes - 1) MONTH) Fecha, DATE_FORMAT(DATE_ADD(fichas.fecha_inicial_real, INTERVAL mes - 1 MONTH), '%M %Y ') Anyo_Mes FROM cronogramamensual LEFT JOIN fichas ON fichas.id_ficha = cronogramamensual.fichas_id_ficha WHERE fichas_id_ficha = ?) t1 LEFT JOIN (SELECT id_ficha, SUM(valor * costo_unitario) / fichas.g_total_presu * 100 porcentaje_fisico, avanceactividades.fecha, DATE_FORMAT(avanceactividades.fecha, '%M %Y ') Anyo_Mes FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ? GROUP BY MONTH(avanceactividades.fecha)) t2 ON t1.Anyo_Mes = t2.Anyo_Mes",[id_ficha,id_ficha],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    var listaMes = []
                    var porcentaje_programado = []
                    var porcentaje_financiero = []
                    var porcentaje_fisico = []
                    ///ac tres arrays de la consulta
                    for (let i = 0; i < res.length; i++) {
                        const element = res[i];
                        
                        listaMes.push(element.Anyo_Mes)
                        porcentaje_programado.push(element.porcentaje_programado)
                        porcentaje_financiero.push(element.porcentaje_financiero)
                        if(element.porcentaje_fisico != null){
                            porcentaje_fisico.push(Number(formatoPorcentaje(element.porcentaje_fisico)))
                        }
                        
                    }

                    var cronogramamensual = {
                        "mes":listaMes,
                        "porcentaje_programado":porcentaje_programado,
                        "porcentaje_financiero":porcentaje_financiero,
                        "porcentaje_fisico":porcentaje_fisico
                    }

                   /* console.log()*/
                    //hasta aqui
                   
                    // console.log("res",listaMes); 
                    callback(null,cronogramamensual);
                    conn.destroy()
                }
                
                
                
            })
        }                
    })
} 
userModel.getinformeControlEjecucionObras = (id_ficha,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }        
        else{
            conn.query("SELECT fichas.id_ficha, fichas.f_entidad_finan entidad_financiera, fichas.modalidad_ejec modalidad_ejecucion, 'SIGOBRAS - subgerencia de obras' fuente_informacion, CURDATE() fecha_actual, fichas.g_total_presu presupuesto, 0 ampliacion_presupuestal, TIMESTAMPDIFF(DAY, fichas.fecha_inicial, plazoejecucion.fechaEjecucion) plazo_ejecucion_inicial, 0 ampliacion_plazo_n, fichas.codigo, fichas.g_meta, fichas.g_total_presu, residente.usuario residente, supervisor.usuario supervisor, TIMESTAMPDIFF(DAY, fichas.fecha_inicial, plazoejecucion.fechaEjecucion) plazo_ejecucion, fichas.fecha_inicial, plazoejecucion.fechaEjecucion, 0 dias_ampliados, 0 fecha_termino, 0 financiero_acumulado, 0 financiero_porcentaje_acumulado, Fisico.avance fisico_acumulado, Fisico.avance / fichas.g_total_presu * 100 fisico_porcentaje_acumulado, 0 ampliacion_acumulado, 0 ampliacion_porcentaje_acumulado, CONCAT(MONTHNAME(CURDATE()), ' ', YEAR(CURDATE())) mes_reportado, estados.nombre estado_obra, 0 metas_programadas, 0 mets_ejecutadas, 0 comentario FROM fichas LEFT JOIN plazoejecucion ON plazoejecucion.fichas_id_ficha = fichas.id_ficha LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.id_historialEstado = (SELECT MAX(id_historialEstado) FROM historialestados) LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN (SELECT fichas_has_accesos.Fichas_id_ficha id_ficha, cargos.nombre nobre_cargo, CONCAT(usuarios.nombre, ' ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno) nombre_personal FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo) personal ON personal.id_ficha = fichas.id_ficha LEFT JOIN (SELECT componentes.Fichas_id_ficha id_ficha, SUM(avanceactividades.valor) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY componentes.Fichas_id_ficha) Fisico ON Fisico.id_ficha = fichas.id_ficha left join (SELECT fichas_has_accesos.Fichas_id_ficha, CONCAT(usuarios.nombre, ' ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno) usuario FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE cargos.nombre = 'residente' GROUP BY fichas_has_accesos.Fichas_id_ficha) residente ON residente.Fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas_has_accesos.Fichas_id_ficha, CONCAT(usuarios.nombre, ' ', usuarios.apellido_paterno, ' ', usuarios.apellido_materno) usuario FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE cargos.nombre = 'supervisor' GROUP BY fichas_has_accesos.Fichas_id_ficha) supervisor ON supervisor.Fichas_id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ?",id_ficha,(err,res)=>{
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
                    obra.fecha_actual =formatoFecha(fila.fecha_actual)
                    obra.presupuesto =formatoPorcentaje(fila.presupuesto)
                    obra.ampliacion_presupuestal =fila.ampliacion_presupuestal
                    obra.plazo_ejecucion_inicial =fila.plazo_ejecucion_inicial
                    obra.ampliacion_plazo_n =fila.ampliacion_plazo_n
                    obra.codigo =fila.codigo
                    obra.g_meta =fila.g_meta
                    obra.g_total_presu =formatoPorcentaje(fila.g_total_presu)
                    obra.plazo_ejecucion =fila.plazo_ejecucion
                    obra.fecha_inicial =formatoFecha(fila.fecha_inicial)
                    obra.fechaEjecucion =formatoFecha(fila.fechaEjecucion)
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
                    obra.residente = fila.residente              
                    obra.supervisor = fila.supervisor
                    
                    callback(null,obra);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}





module.exports = userModel;

