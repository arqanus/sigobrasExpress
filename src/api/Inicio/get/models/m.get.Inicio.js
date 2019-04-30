const pool = require('../../../../db/connection');
function add_years(dt,n) 
 {
        return new Date(dt.setFullYear(dt.getFullYear() + n));      
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
    
        
        data = Number(data)
        if(isNaN(data)){
            
            data=0
        }
        // if(data ==0){
        //         return 0
        // }
        if(data < 1){
            data = data.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
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
let userModel = {};
userModel.getObras = (id_acceso,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        
        else{
            conn.query("SELECT costo_directo.presupuesto costo_directo, fichas.id_ficha, fichas.g_meta, fichas.g_total_presu, SUM(avanceactividades.valor * partidas.costo_unitario) presu_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / costo_directo.presupuesto * 100 porcentaje_avance, fichas.codigo, estado.nombre estado_nombre, tipoobras.nombre tipo_obra, financiero.avance avance_financiero, financiero.avance/ costo_directo.presupuesto * 100 porcentaje_financiero FROM fichas LEFT JOIN tipoobras ON tipoobras.id_tipoObra = fichas.tipoObras_id_tipoObra LEFT JOIN (SELECT cronogramamensual.fichas_id_ficha, SUM(financieroEjecutado) avance FROM cronogramamensual GROUP BY cronogramamensual.fichas_id_ficha) financiero ON financiero.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT componentes.fichas_id_ficha, SUM(componentes.presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) costo_directo ON costo_directo.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE fichas_has_accesos.Accesos_id_acceso = ? AND historialactividades.estado IS NULL GROUP BY fichas.id_ficha",id_acceso,(err,res)=>{
                if(err){
                    callback(err);                
                }
                else if(res.length == 0){
                    callback("vacio");
                    conn.destroy()
        
                }else{      
                        for (let i = 0; i < res.length; i++) {
                                const fila = res[i];
                                fila.g_total_presu = formato(fila.g_total_presu)
                                fila.presu_avance = formato(fila.presu_avance)
                                fila.porcentaje_avance = formato(fila.porcentaje_avance)
                                fila.costo_directo = formato(fila.costo_directo)
                                fila.avance_financiero = formato(fila.avance_financiero)
                                fila.porcentaje_financiero = formato(fila.porcentaje_financiero)
                                
                        }  
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getComponentesPgerenciales = (id_ficha,callback)=>{    
        pool.getConnection(function(err ,conn){
                if(err){ callback(err);}
                
                else{
                        conn.query("SELECT fichas.id_ficha, componentes.numero, componentes.nombre, componentes.presupuesto, SUM(avanceactividades.valor * partidas.costo_unitario) comp_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 porcentaje_avance_componentes FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ? and historialactividades.estado is null GROUP BY componentes.id_componente",id_ficha,(err,res)=>{
                                if(err){
                                        callback(err);     
                                        conn.destroy()   
                                }
                                else if(res.length == 0){
                                        callback("vacio"); 
                                        conn.destroy() 
                                }else{      
                                        var costo_directo={
                                                "numero": "",
                                                "nombre": "COSTO DIRECTO",
                                                "presupuesto": 0,
                                                "comp_avance": 0,
                                                "porcentaje_avance_componentes": 0
                                        }
                                        for (let i = 0; i < res.length; i++) {
                                                const fila = res[i];

                                                //calculo de costo directo
                                                costo_directo.presupuesto+=fila.presupuesto
                                                costo_directo.comp_avance+=fila.comp_avance
                                                costo_directo.porcentaje_avance_componentes+=fila.porcentaje_avance_componentes

                                                //formateo
                                                fila.presupuesto = formato(fila.presupuesto)         
                                                fila.comp_avance = formato(fila.comp_avance)   
                                                fila.porcentaje_avance_componentes = formato(fila.porcentaje_avance_componentes)
                                                
                                                
                                        }
                                        costo_directo.porcentaje_avance_componentes = costo_directo.comp_avance/costo_directo.presupuesto *100
                                        costo_directo.presupuesto = formato(costo_directo.presupuesto)
                                        costo_directo.comp_avance = formato(costo_directo.comp_avance)
                                        costo_directo.porcentaje_avance_componentes = formato(costo_directo.porcentaje_avance_componentes)
                                   
                                        res.push(
                                                costo_directo
                                        )
                                        callback(null,res);
                                        conn.destroy()
                                }
                        })
                }
                
                                
        })
}
userModel.getCargosById = (id_ficha,callback)=>{    
        pool.getConnection(function(err ,conn){
                if(err){ callback(err);}        
                else{
                        conn.query("SELECT accesos.id_acceso, cargos.nombre cargo_nombre, CONCAT(usuarios.apellido_paterno, ' ', usuarios.apellido_materno, ' ', usuarios.nombre) nombre_usuario, usuarios.celular, usuarios.direccion, usuarios.dni, usuarios.email, profesiones.nombre nombre_profesion, usuarios.imagen, usuarios.imagenAlt FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo INNER JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN usuarios_has_profesiones ON usuarios_has_profesiones.Usuarios_id_usuario = Usuarios.id_usuario LEFT JOIN profesiones ON profesiones.id_profesion = usuarios_has_profesiones.profesiones_id_profesion WHERE fichas_has_accesos.Fichas_id_ficha = ? ORDER BY cargos.id_Cargo",id_ficha,(err,res)=>{
                                if(err){
                                        callback(err);                
                                }
                                else if(res.length == 0){
                                        callback("vacio"); 
                                        conn.destroy()       
                                }else{
                                        // console.log(res);
                                        var lastcargo_nombre = -1 
                                        var cargos = {}
                                        var data = []
                                        
                                        for (let i = 0; i < res.length; i++) {
                                                const fila = res[i];
                                                

                                                if (fila.cargo_nombre !== lastcargo_nombre) {
                                                        if(i != 0){
                                                                data.push(cargos)
                                                                cargos = {}
                                                        }
                                                        
                                                        cargos.cargo_nombre = fila.cargo_nombre
                                                        cargos.data=[
                                                                {
                                                                        "nombre_usuario": fila.nombre_usuario,
                                                                        "celular": fila.celular,
                                                                        "direccion": fila.direccion,
                                                                        "dni": fila.dni,                      
                                                                        "email": fila.email,
                                                                        "profesion":fila.nombre_profesion,
                                                                        "imagen":fila.imagen,
                                                                        "imagenAlt":fila.imagenAlt,

                                                                }
                                                        ]                   
                                                        
                                                }else{
                                                        cargos.data.push(
                                                                {
                                                                        "nombre_usuario": fila.nombre_usuario,
                                                                        "celular": fila.celular,
                                                                        "direccion": fila.direccion,
                                                                        "dni": fila.dni,                      
                                                                        "email": fila.email,
                                                                        "profesion":fila.nombre_profesion,
                                                                        "imagen":fila.imagen,
                                                                        "imagenAlt":fila.imagenAlt
                                                                }
                                                        ) 

                                                }
                                                lastcargo_nombre = fila.cargo_nombre
                                                        
                                                
                                        }
                                        data.push(cargos)
                                        callback(null,data);
                                        conn.destroy()
                                
                                }   
                        })
                }
                
                                
        })
}
userModel.getImagenesPorObra = (id_ficha,callback)=>{    
        pool.getConnection(function(err ,conn){
                if(err){ callback(err);}        
                else{
                        conn.query("/*********Consulta Imagenes por Obra************/ SELECT componentes.fichas_id_ficha, partidas.id_partida, partidas.item Item_Partida, partidas.descripcion descripcion_Partida, imagen, imagenAlt, avanceactividades.fecha, avanceactividades.descripcion Desripcion_Imagen FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE imagen IS NOT NULL and componentes.fichas_id_ficha = ?",id_ficha,(err,res)=>{
                                if(err){
                                        callback(err);                
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
userModel.getFechaInicioCronograma = (id_ficha,callback)=>{
    
        pool.getConnection(function(err ,conn){
            if(err){                        
                callback(err);
            }
            else{     
                //insertar datos query
                conn.query("SELECT DATE_FORMAT(coalesce(fecha_corte.fecha_inicial,fichas.fecha_inicial_real), '%Y-%m-%d') fecha_inicial FROM fichas LEFT JOIN (SELECT componentes.fichas_id_ficha, MIN(avanceactividades.fecha) fecha_inicial FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.id_historialEstado = avanceactividades.historialestados_id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE estados.nombre = 'Corte' GROUP BY avanceactividades.historialEstados_id_historialEstado ORDER BY historialestados.id_historialEstado DESC LIMIT 1) fecha_corte ON fecha_corte.fichas_id_ficha = fichas.id_ficha where fichas.id_ficha = ? ",[id_ficha],(error,res)=>{ 
                    if(error){
                        console.log(error);                    
                        callback(error.code);
                    }
                    else if(res.length == 0){
                        console.log("vacio");                    
                        callback("vacio","Fecha Real No ingresada");
                        conn.destroy()
                    
                    }else{    
                        callback(null,res[0]);
                        conn.destroy()
                    }
                    
                    
                    
                })
            }                
        })
} 
userModel.getAcumuladoFisicoAnterior = (id_ficha,fecha_inicial,callback)=>{

pool.getConnection(function(err ,conn){
        if(err){                        
        callback(err);
        }
        else{     
        //insertar datos query
        conn.query("SELECT coalesce(SUM(avanceactividades.valor), 0) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad where componentes.fichas_id_ficha = ? and avanceactividades.fecha < ?",[id_ficha,fecha_inicial],(error,res)=>{ 
                if(error){
                console.log(error);                    
                callback(error.code);
                conn.destroy()                
                }else{    
                callback(null,res[0]);
                conn.destroy()
                }
                
                
                
        })
        }                
})
}
userModel.getcronogramadinero = (id_ficha,fecha_inicio,callback)=>{

pool.getConnection(function(err ,conn){
        if(err){                        
        callback(err);
        }
        else{     
        //insertar datos query
        conn.query("SELECT cronogramamensual.fichas_id_ficha, DATE_FORMAT(cronogramamensual.mes, '%b. %Y') Anyo_Mes, cronogramamensual.programado programado_dinero, cronogramamensual.financieroEjecutado financiero_dinero, fisico.avance fisico_dinero,DATE_FORMAT(cronogramamensual.mes, '%Y-%m-%d') fecha FROM cronogramamensual LEFT JOIN (SELECT componentes.fichas_id_ficha, DATE_FORMAT(avanceactividades.fecha, '%M %Y ') Anyo_Mes, SUM(valor * costo_unitario) avance FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY fichas_id_ficha , DATE_FORMAT(avanceactividades.fecha, '%M %Y ')) fisico ON fisico.fichas_id_ficha = cronogramamensual.fichas_id_ficha AND DATE_FORMAT(cronogramamensual.mes, '%M %Y') = fisico.Anyo_Mes where cronogramamensual.fichas_id_ficha = ? and month(cronogramamensual.mes) >= month(?)",[id_ficha,fecha_inicio],(error,res)=>{ 
                if(error){
                console.log(error);                    
                callback(error.code);
                }else{
                var listaMes = []
                var programado_dinero = []
                var financiero_dinero = []
                var fisico_dinero = []
                
                ///ac tres arrays de la consulta
                for (let i = 0; i < res.length; i++) {
                        const element = res[i]; 
                        listaMes.push(element.Anyo_Mes)
                        element.programado_dinero= formato(element.programado_dinero)
                        element.financiero_dinero= formato(element.financiero_dinero)
                        element.fisico_dinero= formato(element.fisico_dinero)
                }
                callback(null,res);
                conn.destroy()
                }
                
                
                
        })
        }                
})
}
userModel.getUltimoCorte = (id_ficha,callback)=>{
    
        pool.getConnection(function(err ,conn){
            if(err){ callback(err);}
            else{conn.query("(SELECT 'C' codigo, DATE_FORMAT(historialestados.fecha_inicial, '%Y-%m-%d') fecha, DATE_FORMAT(historialestados.fecha_inicial, '%b.') mes, DATE_FORMAT(historialestados.fecha_inicial, '%Y') anyo, 0 programado_monto, 0 programado_porcentaje, 0 fisico_monto, 0 fisico_porcentaje, historialestados.monto financiero_monto, 0 financiero_porcentaje, historialestados.id_historialEstado, historialestados.fecha_inicial, historialestados.fecha_final FROM historialestados LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE estados.codigo = 'C' AND historialestados.Fichas_id_ficha = ? ORDER BY historialestados.id_historialEstado DESC LIMIT 1) UNION (SELECT 'I' codigo, 0 fecha, 0 mes, 0 anyo, 0 programado_monto, 0 programado_porcentaje, 0 fisico_monto, 0 fisico_porcentaje, 0 financiero_monto, 0 financiero_porcentaje, 0 id_historialEstado, fichas.fecha_inicial_real fecha_inicial, fichas.fecha_inicial_real fecha_final FROM fichas WHERE fichas.id_ficha = ?)",[id_ficha,id_ficha],(error,res)=>{ 
                    if(error){
                        callback(error);
                        conn.destroy()            
                    }else if(res.length == 0){            
                        callback(null,"vacio");
                        conn.destroy()            
                    }else{                        
                        for (let i = 0; i < res.length; i++) {
                                const fila = res[i];
                                // console.log("fila",fila);
                                
                                fila.fecha_inicial = fila.fecha_inicial.toLocaleString()
                                fila.fecha_final = fila.fecha_final.toLocaleString()
                                
                        }
                        callback(null,res[0]);
                        conn.destroy()
                    }
                    
                    
                })
            }
            
                    
        })
}
userModel.getAvanceGestionAnterior = (id_ficha,fecha_final,callback)=>{
    
        pool.getConnection(function(err ,conn){
            if(err){ 
                callback(err);
        }
            else{
                    conn.query("SELECT COALESCE(SUM(periodo_actual.valor), 0) valor_total, COALESCE(SUM(periodo_actual.valor), 0) / tb_costo_directo.costo_directo * 100 porcentaje, tb_costo_directo.costo_directo FROM componentes LEFT JOIN (SELECT componentes.fichas_id_ficha, SUM(componentes.presupuesto) costo_directo FROM componentes GROUP BY componentes.fichas_id_ficha) tb_costo_directo ON tb_costo_directo.fichas_id_ficha = componentes.fichas_id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, CAST(SUM(avanceactividades.valor) AS DECIMAL (20 , 2 )) * costo_unitario valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_actual ON periodo_actual.id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? GROUP BY componentes.fichas_id_ficha",[fecha_final,id_ficha],(error,res)=>{ 
                    if(error){
                        callback(error);
                        conn.destroy()            
                    }else if(res.length == 0){            
                        callback(null,"vacio");
                        conn.destroy()            
                    }else{                                               
                        callback(null,res[0]);
                        conn.destroy()
                    }
                    
                    
                })
            }
            
                    
        })
}
userModel.getcronogramaInicio = (corte,id_ficha,fecha_inicial,callback)=>{
  
        pool.query("SELECT 'E' codigo, DATE_FORMAT(cronogramamensual.mes, '%Y-%m-%d') fecha, DATE_FORMAT(cronogramamensual.mes, '%b.') mes, DATE_FORMAT(cronogramamensual.mes, '%Y') anyo, programado programado_monto, programado / tb_presupuesto.presupuesto * 100 programado_porcentaje, COALESCE(tb_fisico.fisico_monto, 0) fisico_monto, COALESCE(tb_fisico.fisico_monto, 0) / tb_presupuesto.presupuesto * 100 fisico_porcentaje, COALESCE(financieroEjecutado, 0) financiero_monto, COALESCE(financieroEjecutado, 0) / fichas.g_total_presu * 100 financiero_porcentaje FROM cronogramamensual LEFT JOIN (SELECT componentes.fichas_id_ficha, avanceactividades.fecha, DATE_FORMAT(avanceactividades.fecha, '%m ') mes, DATE_FORMAT(avanceactividades.fecha, '%Y ') anyo, SUM(avanceactividades.valor * partidas.costo_unitario) fisico_monto FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND avanceactividades.fecha >= ? GROUP BY componentes.fichas_id_ficha , DATE_FORMAT(avanceactividades.fecha, '%m %Y') ORDER BY avanceactividades.fecha) tb_fisico ON tb_fisico.fichas_id_ficha = cronogramamensual.fichas_id_ficha AND DATE_FORMAT(tb_fisico.fecha, '%m %Y') = DATE_FORMAT(cronogramamensual.mes, '%m %Y') LEFT JOIN (SELECT componentes.fichas_id_ficha, SUM(componentes.presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.fichas_id_ficha = cronogramamensual.fichas_id_ficha left join fichas on fichas.id_ficha = cronogramamensual.fichas_id_ficha WHERE cronogramamensual.fichas_id_ficha = ? AND DATE_FORMAT(cronogramamensual.mes, '%Y-%m-01') >= DATE_FORMAT(?, '%Y-%m-01') AND cronogramamensual.programado != 0",[fecha_inicial,id_ficha,fecha_inicial],(error,res)=>{ if(error){
                        callback(error);
                }else if(res.length == 0){
                        console.log("vacio");
                        callback(null,"vacio");
                }else{
                                
                        if(corte!="vacio"&&corte.codigo!="I"){
                                delete corte.fecha_inicial
                                delete corte.fecha_final
                                res.unshift(corte)
                        }
                        
                        // callback(null,res)
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

                                
                                fila.periodo = fila.mes+" "+fila.anyo
                                // delete fila.codigo
                                delete fila.mes
                                delete fila.anyo

                                grafico_programado.push(Number(formato(programado_acumulado)))
                                grafico_fisico.push(Number(formato(fisico_acumulado)))
                                grafico_financiero.push(Number(formato(financiero_acumulado)))
                                periodos.push(fila.periodo)

                                //format
                                fila.programado_monto = formato(fila.programado_monto)
                                fila.programado_porcentaje = formato(fila.programado_porcentaje)
                                fila.fisico_monto = formato(fila.fisico_monto)
                                fila.fisico_porcentaje = formato(fila.fisico_porcentaje)
                                fila.financiero_monto = formato(fila.financiero_monto)
                                fila.financiero_porcentaje = formato(fila.financiero_porcentaje)
                                fila.programado_acumulado = formato(fila.programado_acumulado)
                                fila.fisico_acumulado = formato(fila.fisico_acumulado)
                                fila.financiero_acumulado = formato(fila.financiero_acumulado)
                                
                        }

                        callback(null,{
                                
                                "programado_monto_total":formato(programado_monto),
                                "programado_porcentaje_total":formato(programado_acumulado),
                                "fisico_monto_total":formato(fisico_monto),
                                "fisico_porcentaje_total":formato(fisico_acumulado),
                                "financiero_monto_total":formato(financiero_monto),
                                "financiero_porcentaje_total":formato(financiero_acumulado),
                                "grafico_programado":grafico_programado,
                                "grafico_fisico":grafico_fisico,
                                "grafico_financiero":grafico_financiero,
                                "grafico_periodos":periodos,
                                "data":res
                        });
                }
                        
                        
        })               
        
}


module.exports = userModel;