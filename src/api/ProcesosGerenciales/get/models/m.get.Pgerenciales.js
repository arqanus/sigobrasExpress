const pool = require('../../../../db/connection');
function formato(data){
    
        console.log("antes",data);
        
        data = Number(data)
        console.log("number",data);
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
        console.log("despues",data);
    
        return data
}
let userModel = {};
userModel.getObras = (id_acceso,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        
        else{
            conn.query("SELECT costo_directo.presupuesto costo_directo,fichas.id_ficha, fichas.g_meta, fichas.g_total_presu, SUM(avanceactividades.valor * partidas.costo_unitario) presu_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / costo_directo.presupuesto * 100 porcentaje_avance, fichas.codigo, estado.nombre estado_nombre FROM fichas left join(select componentes.fichas_id_ficha,sum(componentes.presupuesto)presupuesto from componentes group by componentes.fichas_id_ficha) costo_directo on costo_directo.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE fichas_has_accesos.Accesos_id_acceso = ? and historialactividades.estado is null GROUP BY fichas.id_ficha",id_acceso,(err,res)=>{
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
                        conn.query("SELECT accesos.id_acceso,cargos.nombre cargo_nombre, CONCAT(usuarios.apellido_paterno, ' ', usuarios.apellido_materno, ' ', usuarios.nombre) nombre_usuario, usuarios.celular, usuarios.direccion, usuarios.dni, usuarios.email FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario where fichas_has_accesos.Fichas_id_ficha = ? order by cargos.id_Cargo",id_ficha,(err,res)=>{
                                if(err){
                                        callback(err);                
                                }
                                else if(res.length == 0){
                                        callback("vacio"); 
                                        conn.destroy()       
                                }else{
                                        console.log(res);
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
                                                                        "email": fila.email
                                                                }
                                                        ]                   
                                                        
                                                }else{
                                                        cargos.data.push(
                                                                {
                                                                        "nombre_usuario": fila.nombre_usuario,
                                                                        "celular": fila.celular,
                                                                        "direccion": fila.direccion,
                                                                        "dni": fila.dni,                      
                                                                        "email": fila.email
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

module.exports = userModel;