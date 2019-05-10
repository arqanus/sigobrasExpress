const pool = require('../../../../db/connection');
let userModel = {};
function rome(N,s,b,a,o,t){
    t=N/1e3|0;N%=1e3;
    for(s=b='',a=5;N;b++,a^=7)
      for(o=N%a,N=N/a^0;o--;)
        s='IVXLCDM'.charAt(o>2?b+N-(N&=~1)+(o=1):b)+s;
    return Array(t+1).join('M')+s;
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
function formatoPorcentaje(data){
    
    // data = parseFloat(data)
    data = Number(data)
    if(isNaN(data)){
        
        data=0
    }
    
    
    if(data ==100){
        return data
    }else if(Math.floor(data)==99){
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        })
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
function formatoFecha(fecha){
	var currentDate = new Date(fecha);

	var date = currentDate.getDate();
	var month = currentDate.getMonth(); //Be careful! January is 0 not 1
	var year = currentDate.getFullYear();
    // return "2"
	return date + "-" +(month + 1) + "-" + year;

}
function formatoNumero(data){
    
    // data = parseFloat(data)
    data = Number(data)
    if(isNaN(data)){
        
        data=0
    }    
    
    else if(data < 1){
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        })
    }else{
        data = data.toFixed(4)
    } 

    return data
}
//data cabecera
userModel.getInformeDataGeneral  = (id_ficha,fecha_inicial)=>{    
    return new Promise((resolve, reject) => {
        pool.query("SELECT fichas.id_ficha, UPPER(fichas.g_meta) g_meta, fichas.g_total_presu presupuesto_general, UPPER(MONTHNAME(?)) mes, UPPER(fichas.tiempo_ejec) plazo_de_ejecucion, UPPER(fichas.g_local_reg) region, UPPER(fichas.g_local_prov) provincia, UPPER(fichas.g_local_dist) distrito, UPPER(COALESCE(fichas.lugar, '')) lugar FROM fichas WHERE fichas.id_ficha = ?",[fecha_inicial,id_ficha],(err,res)=>{ 
            if(err){
                reject(err.code);                 
            }
            else if(res.length == 0){
                resolve("vacio");    
            }else{     
                resolve(res[0]);
            }
        })
    })
}
//6.1 cuadro demetradosEJECUTADOS
//6.2 VALORIZACION PRINCIPALDELAOBRA-PRESUPUESTO-BASE
//6.3 resumen delavalorizacion principaldelaobrapresupuestobase
userModel.getCostosIndirectos  = (id_ficha,fecha_inicial,fecha_final,callback)=>{    
    return new Promise((resolve, reject) => {
        pool.query("SELECT costosindirectos.nombre, costosindirectos.presupuesto, historial_anterior.valor anterior, historial_anterior.porcentaje porcentaje_anterior, historial_actual.valor actual, historial_actual.porcentaje porcentaje_actual, coalesce(historial_anterior.valor,0)+coalesce(historial_actual.valor,0) acumulado, coalesce(historial_anterior.porcentaje,0)+coalesce(historial_actual.porcentaje,0) porcentaje_acumulado, costosindirectos.presupuesto-coalesce(historial_anterior.valor,0)-coalesce(historial_actual.valor,0) saldo, 100-coalesce(historial_anterior.porcentaje,0)-coalesce(historial_actual.porcentaje,0) porcentaje_saldo FROM costosindirectos LEFT JOIN (SELECT costosindirectos.id_CostoIndirecto, historialcostosindirectos.monto valor, historialcostosindirectos.monto/costosindirectos.presupuesto*100 porcentaje FROM costosindirectos LEFT JOIN historialcostosindirectos ON historialcostosindirectos.CostosIndirectos_id_CostoIndirecto = costosindirectos.id_CostoIndirecto WHERE historialcostosindirectos.fecha < ? GROUP BY costosindirectos.id_CostoIndirecto) historial_anterior ON historial_anterior.id_CostoIndirecto = costosindirectos.id_CostoIndirecto LEFT JOIN (SELECT costosindirectos.id_CostoIndirecto, historialcostosindirectos.monto valor, historialcostosindirectos.monto/costosindirectos.presupuesto*100 porcentaje FROM costosindirectos LEFT JOIN historialcostosindirectos ON historialcostosindirectos.CostosIndirectos_id_CostoIndirecto = costosindirectos.id_CostoIndirecto WHERE historialcostosindirectos.fecha >= ? AND historialcostosindirectos.fecha <= ? GROUP BY costosindirectos.id_CostoIndirecto) historial_actual ON historial_actual.id_CostoIndirecto = costosindirectos.id_CostoIndirecto where costosindirectos.fichas_id_ficha = ?",[fecha_inicial,fecha_inicial,fecha_final,id_ficha],(err,res)=>{
            if(err){
                reject(err.code);                
            }
            else{    
                resolve(res);
            }
        })
    })
}
userModel.resumenValorizacionPrincipal  = (id_ficha,fecha_inicial,fecha_final,costosIndirectos,callback)=>{    
    return new Promise((resolve, reject) => {
        pool.query("SELECT componentes.numero, componentes.nombre, componentes.presupuesto, componentes_anterior.valor anterior, componentes_anterior.porcentaje porcentaje_anterior, componentes_actual.valor actual, componentes_actual.porcentaje porcentaje_actual, coalesce(componentes_anterior.valor,0)+coalesce(componentes_actual.valor,0) acumulado, coalesce(componentes_anterior.porcentaje,0)+coalesce(componentes_actual.porcentaje,0) porcentaje_acumulado, componentes.presupuesto-coalesce(componentes_anterior.valor,0)-coalesce(componentes_actual.valor,0) saldo, 100-coalesce(componentes_anterior.porcentaje,0)-coalesce(componentes_actual.porcentaje,0) porcentaje_saldo FROM componentes LEFT JOIN (SELECT componentes.id_componente, SUM(avanceactividades.valor * partidas.costo_unitario) valor, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE  avanceactividades.fecha < ? GROUP BY componentes.id_componente) componentes_anterior ON componentes_anterior.id_componente = componentes.id_componente LEFT JOIN (SELECT componentes.id_componente, SUM(avanceactividades.valor * partidas.costo_unitario) valor, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE  avanceactividades.fecha >= ? AND avanceactividades.fecha <= ? GROUP BY componentes.id_componente) componentes_actual ON componentes_actual.id_componente = componentes.id_componente where componentes.fichas_id_ficha = ?",[fecha_inicial,fecha_inicial,fecha_final,id_ficha],(err,res)=>{
            if(err){
                reject(err.code);                
            }
            else if(res.length == 0){
                reject("vacio");        
            }else{ 
                var presupuesto = 0
                var anterior = 0
                var porcentaje_anterior = 0
                var actual = 0
                var porcentaje_actual = 0
                var acumulado = 0
                var porcentaje_acumulado = 0
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
                    porcentaje_acumulado+=fila.porcentaje_acumulado
                    saldo+=fila.saldo
                    porcentaje_saldo+=fila.porcentaje_saldo

                    fila.presupuesto = formato(fila.presupuesto)
                    fila.anterior = formato(fila.anterior)
                    fila.porcentaje_anterior = formatoPorcentaje(fila.porcentaje_anterior)
                    fila.actual = formato(fila.actual)
                    fila.porcentaje_actual = formatoPorcentaje(fila.porcentaje_actual)
                    fila.acumulado = formato(fila.acumulado)
                    fila.porcentaje_acumulado = formatoPorcentaje(fila.porcentaje_acumulado)
                    fila.saldo = formato(fila.saldo)
                    fila.porcentaje_saldo = formatoPorcentaje(fila.porcentaje_saldo)
                }
                //calculo de costo Indirecto
                var presupuesto2 = 0
                var anterior2 = 0
                var porcentaje_anterior2 = 0
                var actual2 = 0
                var porcentaje_actual2 = 0
                var acumulado2 = 0
                var porcentaje_acumulado2 = 0
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
                    porcentaje_acumulado2+=fila.porcentaje_acumulado
                    saldo2+=fila.saldo
                    porcentaje_saldo2+=fila.porcentaje_saldo

                    fila.presupuesto = formato(fila.presupuesto)
                    fila.anterior = formato(fila.anterior)
                    fila.porcentaje_anterior = formatoPorcentaje(fila.porcentaje_anterior)
                    fila.actual = formato(fila.actual)
                    fila.porcentaje_actual = formatoPorcentaje(fila.porcentaje_actual)
                    fila.acumulado = formato(fila.acumulado)
                    fila.porcentaje_acumulado = formatoPorcentaje(fila.porcentaje_acumulado)
                    fila.saldo = formato(fila.saldo)
                    fila.porcentaje_saldo = formatoPorcentaje(fila.porcentaje_saldo)
                }
                
                
                var datatemp = 
                {
                    
                    componentes:res,
                    costosDirecto:[
                        {
                            "numero":"",
                            "nombre":"COSTO DIRECTO",
                            "presupuesto":formato( presupuesto),
                            "anterior":formato( anterior),
                            "porcentaje_anterior":formatoPorcentaje( porcentaje_anterior),
                            "actual":formato( actual),
                            "porcentaje_actual":formatoPorcentaje( porcentaje_actual),
                            "acumulado":formato( acumulado),
                            "porcentaje_acumulado":formatoPorcentaje( porcentaje_acumulado),
                            "saldo":formato( saldo),
                            "porcentaje_saldo":formatoPorcentaje( porcentaje_saldo)
                        }
                        

                    ],

                    costosindirectos:costosIndirectos,
                    costoIndirectoTotal:[
                        {
                            "numero": "",
                            "nombre": "COSTO INDIRECTO TOTAL",
                            "presupuesto":formato( presupuesto2),
                            "anterior":formato( anterior2),
                            "porcentaje_anterior":formatoPorcentaje( porcentaje_anterior2),
                            "actual":formato( actual2),
                            "porcentaje_actual":formatoPorcentaje( porcentaje_actual2),
                            "acumulado":formato( acumulado2),
                            "porcentaje_acumulado":formatoPorcentaje( porcentaje_acumulado2),
                            "saldo":formato( saldo2),
                            "porcentaje_saldo":formatoPorcentaje( porcentaje_saldo2)
                        }                            

                    ],
                    ejecutadoTotalExpediente:[
                        {
                            "numero": "",
                            "nombre": "EJECUTADO DEL PRESUPUESTO SEGUN EXP.",
                            "presupuesto":formato(presupuesto+presupuesto2),
                            "anterior":formato(anterior+anterior2),
                            "porcentaje_anterior":formatoPorcentaje(porcentaje_anterior+porcentaje_anterior2),
                            "actual":formato(actual+actual2),
                            "porcentaje_actual":formatoPorcentaje(porcentaje_actual+porcentaje_actual2),
                            "acumulado":formato(acumulado+acumulado2),
                            "porcentaje_acumulado":formatoPorcentaje(porcentaje_acumulado+porcentaje_acumulado2),
                            "saldo":formato(saldo+saldo2),
                            "porcentaje_saldo":formatoPorcentaje(porcentaje_saldo+porcentaje_saldo2)
                        }                            

                    ]
                    
                    
                }
            

                                    


                
                resolve(datatemp);
            }
            
            
        })
        
                
    })
}
//6.4 vaorizacion pormayores metrados
userModel.getValGeneralExtras = (id_ficha,fecha_inicial,fecha_final,tipo,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT componentes.id_componente, componentes.numero, componentes.nombre, componentes.presupuesto, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario precio_parcial, periodo_anterior.metrado metrado_anterior, periodo_anterior.valor valor_anterior, periodo_anterior.porcentaje porcentaje_anterior, periodo_actual.metrado metrado_actual, periodo_actual.valor valor_actual, periodo_actual.porcentaje porcentaje_actual, COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0) metrado_total, COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0) valor_total, (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) porcentaje_total, partidas.metrado - (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) metrado_saldo, partidas.metrado * costo_unitario - COALESCE(periodo_anterior.valor, 0) - COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - COALESCE(periodo_anterior.porcentaje, 0) - COALESCE(periodo_actual.porcentaje, 0) porcentaje_saldo FROM componentes INNER JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, SUM(avanceactividades.valor * costo_unitario) valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado =? GROUP BY partidas.id_partida) periodo_anterior ON periodo_anterior.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, SUM(avanceactividades.valor * costo_unitario) valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha <= ? AND historialactividades.estado =? GROUP BY partidas.id_partida) periodo_actual ON periodo_actual.id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? ORDER BY componentes.id_componente , partidas.id_partida",[fecha_inicial,tipo,fecha_inicial,fecha_final,tipo,id_ficha],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");
                    
                    callback(null,"vacio");
                    conn.destroy()
                
                }else{
                    var componentes = []
                    var componente = {}                                        
                    var id_componente = -1                   
                    
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];                        

                        if(fila.id_componente != id_componente){
                            if(i != 0){
                                componentes.push(componente)
                                componente = {}
                                
                            }
                            
                            componente.id_componente = fila.id_componente
                            componente.numero = fila.numero
                            componente.nombre = fila.nombre
                            componente.presupuesto = fila.presupuesto
                            componente.partidas = [ 
                                {
                                    "item":fila.item,                                    "descripcion":fila.descripcion,
                                    "metrado":fila.metrado,                                    "costo_unitario":fila.costo_unitario,                                    "precio_parcial":fila.precio_parcial,                                    "metrado_anterior":fila.metrado_anterior,                                    "valor_anterior":fila.valor_anterior,                                    "porcentaje_anterior":fila.porcentaje_anterior,                                "metrado_actual":fila.metrado_actual,                                    "valor_actual":fila.valor_actual,                                    "porcentaje_actual":fila.porcentaje_actual,                                    "metrado_total":fila.metrado_total,                                    "valor_total":fila.valor_total,                                    "porcentaje_total":fila.porcentaje_total,                                    "metrado_saldo":fila.metrado_saldo,                                    "valor_saldo":fila.valor_saldo,                                    "porcentaje_saldo":fila.porcentaje_saldo
                                }
                            ]                            
                         
                        }else{
                            componente.partidas.push( 
                                {
                                    "item":fila.item,                                    "descripcion":fila.descripcion,
                                    "metrado":fila.metrado,                                    "costo_unitario":fila.costo_unitario,                                    "precio_parcial":fila.precio_parcial,                                    "metrado_anterior":fila.metrado_anterior,                                    "valor_anterior":fila.valor_anterior,                                    "porcentaje_anterior":fila.porcentaje_anterior,                                "metrado_actual":fila.metrado_actual,                                    "valor_actual":fila.valor_actual,                                    "porcentaje_actual":fila.porcentaje_actual,                                    "metrado_total":fila.metrado_total,                                    "valor_total":fila.valor_total,                                    "porcentaje_total":fila.porcentaje_total,                                    "metrado_saldo":fila.metrado_saldo,                                    "valor_saldo":fila.valor_saldo,                                    "porcentaje_saldo":fila.porcentaje_saldo
                                }
                            )                 
                        
                        }
                        id_componente = fila.id_componente
                    }
                    componentes.push(componente)
             

                    callback(null,componentes);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
//6.5 valorizacion de partidas nuevas
//getvalgeneralExtras
//6.6 consolidado general de las valorizacines

//6.7 resumen de avance fisico de las partidas de obra por mes 
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
                    callback(null,"vacio");        
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
            query = query.concat("WHERE fichas.id_ficha = ? GROUP BY partidas.id_partida ORDER BY componentes.id_componente,partidas.id_partida")
            
            
            conn.query(query,id_ficha,(err,res)=>{
                if(err){
                    console.log(err);                    
                    callback(err.code);                
                }
                else if(res.length == 0){
                    callback(null,"vacio");   
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
                            

                            var temp =[
                                fila.item,
                                fila.descripcion,
                                fila.unidad_medida,
                                fila.metrado
                            ]
                            for (let j = 0; j < cabeceras.length-6; j++) {
                                temp.push(j+1)                                
                            }
                            temp.push(
                                fila.avance_acumulado,            
                                fila.saldo
                            )
                            componente.partidas = [                                
                                temp                            
                            ]
                         
                        }else{
                            var temp =[
                                fila.item,
                                fila.descripcion,
                                fila.unidad_medida,
                                fila.metrado
                            ]
                            for (let j = 0; j < cabeceras.length-6; j++) {
                                temp.push(j+1)                                
                            }
                            temp.push(
                                fila.avance_acumulado,            
                                fila.saldo
                            )
                            componente.partidas.push(
                                temp                            
                            )
                        }
                        lastIdComponente = fila.id_componente
                        
                        
                          
                        
                    }
                    componentes.push(componente)
                    callback(null,{
                        "cabecereras":cabeceras,
                        "componentes":componentes
                    });
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
//6.8 avance mensual comparativos de acuerdo al presupuesto delaobra y mesavance comparativos
userModel.avanceMensualComparativoPresupuesto = (id_ficha,fecha_inicial,fecha_final,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{conn.query("/*************** D+ = MB-MA D- = MB-MA   MA>M P+ = D+/MB P- = D-/MB Consulta Consolidado de valorizacion *************/ SELECT componentes.id_componente,componentes.numero,componentes.nombre, item, tipo, descripcion, unidad_medida, partidas.metrado, costo_unitario, COALESCE(tb_avance_anterior.metrado, 0) Metrado_Ejecutado_Anterior, COALESCE(tb_avance_anterior.valor, 0) Valorizado_Anterior, COALESCE(tb_avance_actual.metrado, 0) Metrado_Ejecutado_Actual, COALESCE(tb_avance_actual.valor, 0) Valorizado_actual, COALESCE(tb_avance_anterior.metrado, 0) + COALESCE(tb_avance_actual.metrado, 0) Metrado_Ejecutado_Acumulado, COALESCE(tb_avance_anterior.valor, 0) + COALESCE(tb_avance_actual.valor, 0) Valorizado_Acumulado, partidas.metrado - COALESCE(tb_avance_anterior.metrado, 0) - COALESCE(tb_avance_actual.metrado, 0) Diferencia_Mas, IF((COALESCE(tb_avance_anterior.metrado, 0) + COALESCE(tb_avance_actual.metrado, 0)) > partidas.metrado, COALESCE(partidas.metrado, 0) - (COALESCE(tb_avance_anterior.metrado, 0) + COALESCE(tb_avance_actual.metrado, 0)), 0) Diferencia_Menos, (partidas.metrado - (COALESCE(tb_avance_anterior.metrado, 0) + COALESCE(tb_avance_actual.metrado, 0))) / partidas.metrado * 100 Porcentaje_Mas, IF((COALESCE(tb_avance_anterior.metrado, 0) + COALESCE(tb_avance_actual.metrado, 0)) > partidas.metrado, partidas.metrado - (COALESCE(tb_avance_anterior.metrado, 0) + COALESCE(tb_avance_actual.metrado, 0)), 0) / partidas.metrado * 100 Porcentaje_Menos FROM componentes INNER JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT id_partida, SUM(valor) metrado, SUM(valor * costo_unitario) valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? GROUP BY partidas.id_partida) tb_avance_anterior ON tb_avance_anterior.id_partida = partidas.id_partida LEFT JOIN (SELECT id_partida, SUM(valor) metrado, SUM(valor * costo_unitario) valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha <= ? GROUP BY partidas.id_partida) tb_avance_actual ON tb_avance_actual.id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ?",[fecha_inicial,fecha_inicial,fecha_final,id_ficha],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");
                    
                    callback(null,"vacio");
                    conn.destroy()
                
                }else{
                    var componentes=[]
                    var componente ={}
                    var id_componente = -1

                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if (id_componente -=fila.id_componente) {
                            if(i!=0){
                                componentes.push(componente)
                                componente = {}
                            }
                            componente.numero = fila.numero
                            componente.nombre = fila.nombre
                            componente.partidas = [
                                {
                                    "item":fila.item,
                                    "tipo":fila.tipo,
                                    "descripcion":fila.descripcion,
                                    "unidad_medida":fila.unidad_medida,
                                    "metrado":fila.metrado,
                                    "costo_unitario":fila.costo_unitario,
                                    "Metrado_Ejecutado_Anterior":fila.Metrado_Ejecutado_Anterior,
                                    "Valorizado_Anterior":fila.Valorizado_Anterior,
                                    "Metrado_Ejecutado_Actual":fila.Metrado_Ejecutado_Actual,
                                    "Valorizado_actual":fila.Valorizado_actual,
                                    "Metrado_Ejecutado_Acumulado":fila.Metrado_Ejecutado_Acumulado,
                                    "Valorizado_Acumulado":fila.Valorizado_Acumulado,
                                    "Diferencia_Mas":fila.Diferencia_Mas,
                                    "Diferencia_Menos":fila.Diferencia_Menos,
                                    "Porcentaje_Mas":fila.Porcentaje_Mas,
                                    "Porcentaje_Menos":fila.Porcentaje_Menos
                                }
                            ]
                        }else{
                            componente.partidas.push(
                                {
                                    "item":fila.item,
                                    "tipo":fila.tipo,
                                    "descripcion":fila.descripcion,
                                    "unidad_medida":fila.unidad_medida,
                                    "metrado":fila.metrado,
                                    "costo_unitario":fila.costo_unitario,
                                    "Metrado_Ejecutado_Anterior":fila.Metrado_Ejecutado_Anterior,
                                    "Valorizado_Anterior":fila.Valorizado_Anterior,
                                    "Metrado_Ejecutado_Actual":fila.Metrado_Ejecutado_Actual,
                                    "Valorizado_actual":fila.Valorizado_actual,
                                    "Metrado_Ejecutado_Acumulado":fila.Metrado_Ejecutado_Acumulado,
                                    "Valorizado_Acumulado":fila.Valorizado_Acumulado,
                                    "Diferencia_Mas":fila.Diferencia_Mas,
                                    "Diferencia_Menos":fila.Diferencia_Menos,
                                    "Porcentaje_Mas":fila.Porcentaje_Mas,
                                    "Porcentaje_Menos":fila.Porcentaje_Menos
                                }
                            )

                        }
                        id_componente = fila.id_componente
                    }

                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if(fila.tipo =="titulo"){
                            fila.unidad_medida = ""
                            fila.metrado = ""
                            fila.costo_unitario = ""
                            fila.Metrado_Ejecutado_Anterior = ""
                            fila.Valorizado_Anterior = ""
                            fila.Metrado_Ejecutado_Actual = ""
                            fila.Valorizado_actual = ""
                            fila.Metrado_Ejecutado_Acumulado = ""
                            fila.Valorizado_Acumulado = ""
                            fila.Diferencia_Mas = ""
                            fila.Diferencia_Menos = ""
                            fila.Porcentaje_Mas = ""
                            fila.Porcentaje_Menos = ""
                        }                
                        
                    }
                    componentes.push(componente)
                    callback(null,componentes);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
//6.9 avance comparativ diagraa degantt
userModel.getCortes = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{conn.query(" SELECT tb.fecha_inicial FROM ((SELECT fichas.id_ficha, fichas.fecha_inicial_real fecha_inicial FROM fichas) UNION (SELECT historialestados.Fichas_id_ficha id_ficha, historialestados.fecha fecha_inicial FROM avanceactividades LEFT JOIN historialestados ON historialestados.id_historialEstado = avanceactividades.historialestados_id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE estados.codigo = 'C' GROUP BY avanceactividades.historialEstados_id_historialEstado)) tb WHERE tb.id_ficha = ? order by fecha_inicial",[id_ficha],(error,res)=>{ 
                if(error){
                    callback(error);
                }else if(res.length == 0){
        
                    callback(null,"vacio");
                    conn.destroy()            
                }else{
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if(i+1<res.length){
                            res[i].fecha_final = res[i+1].fecha_inicial
                        }else{
                            res[i].fecha_final = new Date();
                        }
                        if(i==0){
                            res[i].codigo = "INICIO"
                        }else{
                            res[i].codigo = "CORTE "+i
                        }
                    }
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.histogramaAvanceObra = (id_ficha,fecha_inicial,fecha_final,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{conn.query("SELECT tb_fisico.codigo, DATE_FORMAT(cronogramamensual.mes, '%M') mes, DATE_FORMAT(cronogramamensual.mes, '%Y') anyo, programado programado_monto, programado / tb_presupuesto.presupuesto * 100 programado_porcentaje, COALESCE(tb_fisico.fisico_monto, 0) fisico_monto, COALESCE(tb_fisico.fisico_monto, 0) / tb_presupuesto.presupuesto * 100 fisico_porcentaje, COALESCE(financieroEjecutado, 0) financiero_monto, COALESCE(financieroEjecutado, 0) / tb_presupuesto.presupuesto * 100 financiero_porcentaje FROM cronogramamensual LEFT JOIN (SELECT componentes.fichas_id_ficha, min(estados.codigo) codigo, DATE_FORMAT(avanceactividades.fecha, '%m ') mes, DATE_FORMAT(avanceactividades.fecha, '%Y ') anyo, SUM(avanceactividades.valor) fisico_monto FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.id_historialEstado = avanceactividades.historialEstados_id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE componentes.fichas_id_ficha = 92 GROUP BY DATE_FORMAT(avanceactividades.fecha, '%m %Y') ORDER BY avanceactividades.fecha) tb_fisico ON tb_fisico.fichas_id_ficha = cronogramamensual.fichas_id_ficha AND tb_fisico.anyo = DATE_FORMAT(cronogramamensual.mes, '%Y') AND tb_fisico.mes = DATE_FORMAT(cronogramamensual.mes, '%m') LEFT JOIN (SELECT componentes.fichas_id_ficha, SUM(componentes.presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.fichas_id_ficha = cronogramamensual.fichas_id_ficha WHERE DATE_FORMAT(?, '%Y-%m-01 ') <= DATE_FORMAT(cronogramamensual.mes, '%Y-%m-01') AND DATE_FORMAT(?, '%Y-%m-01 ') > DATE_FORMAT(cronogramamensual.mes, '%Y-%m-01') AND cronogramamensual.fichas_id_ficha = ?",[fecha_inicial,fecha_final,id_ficha],(error,res)=>{ 
            if(error){
                    callback(error);
                }else if(res.length == 0){
                    console.log("vacio");
                    
                    callback(null,"vacio");
                    conn.destroy()
                
                }else{
                    var programado_acumulado = 0
                    var fisico_acumulado = 0
                    var financiero_acumulado = 0

                    var programado_monto = 0
                    var fisico_monto = 0
                    var financiero_monto = 0

                    var grafico_programado = []
                    var grafico_fisico = []
                    var grafico_financiero = []
                    var periodos = []

                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];

                        programado_acumulado+= fila.programado_porcentaje
                        fisico_acumulado+= fila.fisico_porcentaje
                        financiero_acumulado+= fila.financiero_porcentaje
                        programado_monto+= fila.programado_monto
                        fisico_monto+= fila.fisico_monto
                        financiero_monto+= fila.financiero_monto

                        fila.programado_acumulado = programado_acumulado
                        fila.fisico_acumulado = fisico_acumulado
                        fila.financiero_acumulado = financiero_acumulado

                        
                        
                        if(i==0 && fila.codigo == null){
                            fila.periodo = "INICIO "+ fila.mes+" "+fila.anyo
                        }else if(fila.codigo == "C"){
                            fila.periodo = "CORTE "+ fila.mes+" "+fila.anyo
                        }else{
                            fila.periodo = fila.mes+" "+fila.anyo
                        }
                        delete fila.codigo
                        delete fila.mes
                        delete fila.anyo

                        grafico_programado.push(programado_acumulado)
                        grafico_fisico.push(fisico_acumulado)
                        grafico_financiero.push(financiero_acumulado)
                        periodos.push(fila.periodo)
                        
                    }

                    callback(null,{
                        
                        "programado_monto_total":programado_monto,
                        "programado_porcentaje_total":programado_acumulado,
                        "fisico_monto_total":fisico_monto,
                        "fisico_porcentaje_total":fisico_acumulado,
                        "financiero_monto_total":financiero_monto,
                        "financiero_porcentaje_total":financiero_acumulado,
                        "grafico_programado":grafico_programado,
                        "grafico_fisico":grafico_fisico,
                        "grafico_financiero":grafico_financiero,
                        "grafico_periodos":periodos,
                        "data":res
                    });
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
//6.10 histograma del avance de obras curva s
//se usa el histogramaAvanceObra del 6.9
//6.11 proyeccion de trabajos prosxioms mes cronograma
//6.12 informe
userModel.getInformeImagen = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("(SELECT avanceactividades.imagen, avanceactividades.imagenAlt FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.imagen IS NOT NULL AND componentes.fichas_id_ficha = ? ORDER BY avanceactividades.id_AvanceActividades DESC LIMIT 1) UNION (SELECT avanceactividades.imagen, avanceactividades.imagenAlt FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.imagen IS NOT NULL AND componentes.fichas_id_ficha = ? AND avanceactividades.id_AvanceActividades != (SELECT avanceactividades.id_AvanceActividades FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.imagen IS NOT NULL AND componentes.fichas_id_ficha = ? ORDER BY avanceactividades.id_AvanceActividades DESC LIMIT 1) ORDER BY RAND() LIMIT 1)",[id_ficha,id_ficha,id_ficha],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{                   
                   
                    callback(null,res);
                    conn.destroy()
                }
                
                
                
            })
        }                
    })
}
userModel.getcronograma = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("SELECT cronogramamensual.fichas_id_ficha, DATE_FORMAT(cronogramamensual.mes, '%M %Y') Anyo_Mes, cronogramamensual.programado/costo_directo.presupuesto*100 porcentaje_programado, cronogramamensual.financieroEjecutado/costo_directo.presupuesto*100 porcentaje_financiero, fisico.avance/costo_directo.presupuesto*100 porcentaje_fisico FROM cronogramamensual LEFT JOIN (SELECT componentes.fichas_id_ficha, DATE_FORMAT(avanceactividades.fecha, '%M %Y ') Anyo_Mes, SUM(valor * costo_unitario) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY fichas_id_ficha , DATE_FORMAT(avanceactividades.fecha, '%M %Y ')) fisico ON fisico.fichas_id_ficha = cronogramamensual.fichas_id_ficha AND DATE_FORMAT(cronogramamensual.mes, '%M %Y') = fisico.Anyo_Mes left join(select componentes.fichas_id_ficha,sum(componentes.presupuesto) presupuesto from componentes group by componentes.fichas_id_ficha) costo_directo on costo_directo.fichas_id_ficha = cronogramamensual.fichas_id_ficha WHERE cronogramamensual.fichas_id_ficha = ?",[id_ficha,id_ficha],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    var listaMes = []
                    var porcentaje_programado = []
                    var porcentaje_financiero = []
                    var porcentaje_fisico = []
                    var porcentaje_programado_acumulado = 0
                    var porcentaje_financiero_acumulado = 0
                    var porcentaje_fisico_acumulado = 0
                    ///ac tres arrays de la consulta
                    var actual = false
                    var d = new Date();
                    var mes = month[d.getMonth()];
                    var anyo = d.getFullYear()
                    var Anyo_Mes = mes+" "+anyo
                    console.log(Anyo_Mes);
                    
                    for (let i = 0; i < res.length; i++) {
                        const element = res[i];
                        
                        porcentaje_programado_acumulado += element.porcentaje_programado
                        porcentaje_financiero_acumulado += element.porcentaje_financiero
                        porcentaje_fisico_acumulado += element.porcentaje_fisico
                        
                        listaMes.push(element.Anyo_Mes)

                       
                        
                        
                        
                        porcentaje_programado.push(Number(formatoNumero(porcentaje_programado_acumulado)))
                        if(!actual){
                            
                            
                            porcentaje_financiero.push(Number(formatoNumero(porcentaje_financiero_acumulado)))
                            porcentaje_fisico.push(Number(formatoNumero(porcentaje_fisico_acumulado)))
                        }
                        if(Anyo_Mes.toUpperCase() == element.Anyo_Mes.toUpperCase()){
                            actual = true
                        }
                ;
                        
                    }

                    var cronogramamensual = {
                        "mes":listaMes,
                        "porcentaje_programado":porcentaje_programado,
                        "porcentaje_financiero":porcentaje_financiero,
                        "porcentaje_fisico":porcentaje_fisico
                    }

                   
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
                    callback(null,"vacio");
        
                }else{ 
                    fila = res[0];
                    var obra = {}
                    
                    obra.entidad_financiera =fila.entidad_financiera
                    obra.modalidad_ejecucion =fila.modalidad_ejecucion
                    obra.fuente_informacion =fila.fuente_informacion
                    obra.fecha_actual =formatoFecha(fila.fecha_actual)
                    obra.presupuesto =formato(fila.presupuesto)
                    obra.ampliacion_presupuestal =fila.ampliacion_presupuestal
                    obra.plazo_ejecucion_inicial =fila.plazo_ejecucion_inicial
                    obra.ampliacion_plazo_n =fila.ampliacion_plazo_n
                    obra.codigo =fila.codigo
                    obra.g_meta =fila.g_meta
                    obra.g_total_presu =formato(fila.g_total_presu)
                    obra.plazo_ejecucion =fila.plazo_ejecucion
                    obra.fecha_inicial =formatoFecha(fila.fecha_inicial)
                    obra.fechaEjecucion =formatoFecha(fila.fechaEjecucion)
                    obra.dias_ampliados =fila.dias_ampliados
                    obra.fecha_termino =fila.fecha_termino
                    obra.financiero_acumulado = formato(fila.financiero_acumulado)
                    obra.financiero_porcentaje_acumulado = formato(fila.financiero_porcentaje_acumulado)
                    obra.fisico_acumulado = formato(fila.fisico_acumulado)
                    obra.fisico_porcentaje_acumulado = formato(fila.fisico_porcentaje_acumulado)
                    obra.ampliacion_acumulado = formato(fila.ampliacion_acumulado)
                    obra.ampliacion_porcentaje_acumulado = formato(fila.ampliacion_porcentaje_acumulado)
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

