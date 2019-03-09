const pool = require('./connection');
let userModel = {};
function formatoPorcentaje(data){
    
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
userModel.postObra = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO fichas SET ?', data,(error,res)=>{
                if(error){
                    console.log(error);
                    
                    callback(error.code);
                }else{
                    // console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.getCodigo = (id_TipoObra,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO fichas SET ?', data,(error,res)=>{
                if(error){
                    console.log(error);
                    
                    callback(error.code);
                }else{
                    // console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}

userModel.getObras = (callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}       
        conn.query('select *from fichas left join (SELECT historialestados.Fichas_id_ficha, estados.nombre estado_nombre FROM historialestados INNER JOIN (SELECT MAX(historialestados.id_historialEstado) id_historialEstado FROM historialestados LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado GROUP BY historialestados.Fichas_id_ficha) he ON he.id_historialEstado = historialestados.id_historialEstado INNER JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha', (error,res)=>{
            if(error) callback(error);            
            callback(null,res);
            conn.destroy()
        })        
    })
}
userModel.postPersonalTecnico = (data,callback)=>{
    console.log(data);
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}       
        conn.query('INSERT INTO usuarios SET ?', data,(error,res)=>{
            if(error) callback(error);
            console.log("affectedRows",res.affectedRows);
            callback(null,res.insertId);
            conn.destroy()
        })        
    })
}
userModel.getPersonalTecnico = (callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}       
        conn.query('select *from usuarios', (error,res)=>{
            if(error){
                callback(error);
            }else{
                callback(null,res);
                conn.destroy()
            }             
            
        })        
    })
}
userModel.postCargo = (data,callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{     
            conn.query('INSERT INTO cargos SET ?', data,(error,res)=>{
                if(error) callback(error);
                console.log("affectedRows",res.affectedRows); 
                callback(null,res.affectedRows);
                conn.destroy()
            })  
        }      
    })
}
userModel.getCargos = (callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}  
        conn.query('select *from cargos', (error,res)=>{
            if(error){ callback(error);  }
            else{
                callback(null,res);
                conn.destroy()
            }
            
        })        
    })
}
userModel.postPrivilegios = (data,callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{     
            conn.query('INSERT INTO privilegios SET ?', data,(error,res)=>{
                if(error) {callback(error);}
                else{
                    console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
            })  
        }      
    })
}
userModel.getPrivilegios = (callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}       
        conn.query('select *from privilegios', (error,res)=>{
            if(error) callback(error);            
            callback(null,res);
            conn.destroy()
        })        
    })
}
userModel.postAcceso = (data,callback)=>{
    
    pool.getConnection(function(err,conn){
        console.log("data",data);
        if(err){ callback(err);}
        else{     
            conn.query('INSERT INTO accesos SET ?', data,(error,res)=>{
                if(error){ 
                    callback(error.code);
                    console.log("error",error);
                    

                }
                else{
                    console.log("affectedRows",res.affectedRows); 
                    callback(null,res);
                    conn.destroy()
                }
                
            })  
        }      
    })
}
userModel.getIdAcceso = (data,callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{     
            conn.query('select id_acceso from accesos where usuarios_id_usuario = ?', data,(error,res)=>{
                if(error) {
                    callback(error.code);
                }else{
                    console.log("res ",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
            })  
        }      
    })
}
userModel.postObraUsuario = (data,callback)=>{
    console.log("postobrausuario");
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{     
            conn.query('INSERT INTO fichas_has_accesos SET ?', data,(error,res)=>{
                if(error){ 
                    console.log(error);
                    
                    callback(error.code);
                }else{
                    console.log("affectedRows",res); 
                    callback(null,res.affectedRows);
                
                }
                conn.destroy()             
                
            })  
        }      
    })
}
userModel.postComponentes = (data,callback)=>{
    console.log("postcomponentes");
     
    pool.getConnection(function(err,conn){
        if(err){ 
            callback(err);
        }
        else{     
            conn.query('INSERT INTO componentes (numero,nombre,presupuesto) values ?',[data],(error,res)=>{
                if(error) {
                    callback(error.code);
                    console.log(error);            
                }
                else{
                    // console.log("affectedRowsa",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
            })  
        }      
    })
}
userModel.getComponentesById = (id_ficha,callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}       
        conn.query('SELECT presupuestos.Fichas_id_ficha, componente.numero, componente.nombre, componente.id_componente, presupuestos.id_Presupuesto FROM presupuestos INNER JOIN (SELECT componentes.numero, componentes.nombre, componentes.id_componente, partidas.presupuestos_id_Presupuesto id_presupuesto FROM componentes INNER JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente GROUP BY componentes.id_componente) componente ON componente.id_presupuesto = presupuestos.id_Presupuesto where presupuestos.Fichas_id_ficha = ?',id_ficha, (error,res)=>{
            if(error) callback(error);            
            callback(null,res);
            conn.destroy()
        })        
    })
}
userModel.postPartidas = (data,callback)=>{
    // console.log("postPartidas");
    console.log("partidaData",data);
    if(data.length == 0){
        callback("partidadata vacia");
    }else{
         pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{     
            conn.query('INSERT INTO partidas (tipo,item,descripcion,unidad_medida,metrado,costo_unitario,equipo,rendimiento,Componentes_id_componente,presupuestos_id_presupuesto) VALUES ?',[data],(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    // console.log("res",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                } 
                
            })  
            }      
        })
    }
   
}
userModel.postActividades = (data,callback)=>{
    console.log("postactividadaes");
    pool.getConnection(function(err,conn){
        // console.log(data)
        if(err){ callback(err);}
        else{       
            conn.query('INSERT INTO actividades (tipo,nombre,veces,largo,ancho,alto,parcial,Partidas_id_partida) VALUES ?',[data],(error,res)=>{
                if(error){
                    console.log("error",error); 
                    callback(error.code);
                }else{
                    // console.log("res",res); 
                    callback(null,res.affectedRows);
                    conn.destroy()
                }
            })
        }
    })
}
userModel.postRecursos = (data,callback)=>{
    console.log("postrecursos");
    pool.getConnection(function(err,conn){
        // console.log(data)
        if(err){ callback(err);}
        else{       
            conn.query('INSERT INTO recursos (tipo,codigo,descripcion,unidad,cuadrilla,cantidad,precio,parcial,Partidas_id_partida) VALUES ?',[data],(error,res)=>{
                if(error){
                    console.log("error",error);                     
                    callback(error.code);
                }else{
                    // console.log("res",res); 
                    callback(null,res.affectedRows);
                    conn.destroy()
                }
            })
        }
    })
}
userModel.postLogin = (data,callback)=>{
    console.log("postLogin");
    console.log("data",data);
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{     
            var query = "SELECT accesos.id_acceso,accesos.usuario, cargos.nombre nombre_cargo, usuarios.nombre nombre_usuario FROM accesos LEFT JOIN cargos ON accesos.Cargos_id_Cargo = cargos.id_Cargo LEFT JOIN usuarios ON accesos.Usuarios_id_usuario = usuarios.id_usuario WHERE usuario ='"+data.usuario+"' AND password = '"+data.password+"' order by accesos.id_acceso desc limit 1"
            console.log("query=>",query);
            
            conn.query(query,(error,res)=>{
                if(error) {
                    console.log(error);                    
                    callback(error);
                }
                else if(res.length == 0){
                    console.log("vacio");                    
                    callback("vacio");
                
                }else{                    
                    console.log("res",res); 
                    callback(null,res[0]);
                    conn.destroy()
                }
                
            })  
        }      
    })
}
userModel.postPresupuesto = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO presupuestos SET ?', data,(error,res)=>{
                if(error){
                    callback(error);
                }else{
                    // console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.postPresupuestos = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO presupuestos (monto,Fichas_id_ficha) values ?', [data],(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{ 
                    console.log("res",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.postEstado = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            // console.log("postestados",data);
            
            conn.query('INSERT INTO estados SET ?', data,(error,res)=>{
                if(error){
                    callback(error);
                }else{
                    console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postHistorialEstados = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO historialEstados SET ?', data,(error,res)=>{
                if(error){
                    callback(error);
                }else{
                    // console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.getestadoIdHistorialEstados =(id_historial,callback)=>{
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{
            console.log("get estado");
            
            conn.query('select nombre from historialestados left join estados on estados.id_Estado = historialestados.Estados_id_Estado where historialestados.id_historialEstado = ?', id_historial,(error,res)=>{
                if(error){
                    console.log(error);
                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res[0]);
                    conn.destroy()
                }
                
                
            })
        } 
    })
}
userModel.getEstados = (callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('SELECT * FROM estados', (error,res)=>{
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
userModel.postHistorialPartidas = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('Insert into historialpartidas (estado,partidas_id_partida) values ?',[data], (error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postHistorialComponentes = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('Insert into historialcomponentes (estado,componentes_id_componente) values ?',[data], (error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postPlazoEjecucion = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('Insert into PlazoEjecucion set ?',data, (error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.getDatosGenerales = (id_ficha,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('SELECT fichas.g_meta, TIMESTAMPDIFF(DAY, fichas.fecha_inicial, CURDATE()) dias_ejecutados, TIMESTAMPDIFF(DAY, CURDATE(), plazoejecucion.fechaEjecucion) dias_saldo, estado.nombre estado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_acumulado, SUM(avanceactividades.valor * partidas.costo_unitario) / fichas.g_total_presu * 100 porcentaje_acumulado, avance_actual.avance avance_actual, avance_actual.avance / fichas.g_total_presu * 100 porcentaje_actual, avance_ayer.avance avance_ayer, avance_ayer.avance / fichas.g_total_presu * 100 porcentaje_ayer FROM fichas LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN plazoejecucion ON plazoejecucion.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas.id_ficha, SUM(avanceactividades.valor * partidas.costo_unitario) avance, avanceactividades.fecha FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE DATE(avanceactividades.fecha) = CURDATE() GROUP BY fichas.id_ficha) avance_actual ON avance_actual.id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas.id_ficha, SUM(avanceactividades.valor * partidas.costo_unitario) avance, avanceactividades.fecha FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE DATE(avanceactividades.fecha) = SUBDATE(CURDATE(), 1) GROUP BY fichas.id_ficha) avance_ayer ON avance_ayer.id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ? GROUP BY fichas.id_ficha',id_ficha, (error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }
                else if(res.length ==0){
                    callback("vacio");
                }else{
                    console.log("res",res); 
                    
                        const ficha = res[0];                        
                        ficha.avance_acumulado = formatoPorcentaje(ficha.avance_acumulado)
                        ficha.porcentaje_acumulado = formatoPorcentaje(ficha.porcentaje_acumulado)
                        ficha.avance_actual = formatoPorcentaje(ficha.avance_actual)
                        ficha.porcentaje_actual = formatoPorcentaje(ficha.porcentaje_actual)
                        ficha.avance_ayer = formatoPorcentaje(ficha.avance_ayer)
                        ficha.porcentaje_ayer = formatoPorcentaje(ficha.porcentaje_ayer)
                        
                    
                 
                    callback(null,res[0]);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.getProfesiones = (callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('select * from profesiones',(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postProfesion = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('insert into profesiones set ?',data,(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postProfesionUsuario = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('insert into Profesiones_has_usuarios set ?',data,(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}

userModel.postMenu = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{            
            conn.query("INSERT INTO menus (data,accesos_id_acceso ) VALUES (?,?) ON DUPLICATE KEY UPDATE data = ?",[data.data,data.accesos_id_acceso,data.data],(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.getMenu = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{            
            conn.query("SELECT fichas.id_ficha, id_acceso, data, estado.estado_nombre,estado.id_historialEstado FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN menus ON menus.accesos_id_acceso = accesos.id_acceso LEFT JOIN (SELECT fichas.id_ficha, estados.nombre estado_nombre,historialestados.id_historialEstado FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado ) estado ON estado.id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ? AND id_acceso = ? order by estado.id_historialEstado desc limit 1 ",[data.id_ficha,data.id_acceso],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else if(res.length ==0){
                    console.log("vacio");                    
                    callback("vacio");
                }else{
                    var json = JSON.parse(res[0].data)
                    var estado = res[0].estado_nombre
                    console.log("estado",estado);
                    

                    for (let i = 0; i < json.length; i++) {
                        const element = json[i];
                        console.log("nombremenu",element.nombreMenu);
                        if(element.nombreMenu=="PROCESOS FISICOS"){
                            if(estado == "Ejecucion"){
                                element.submenus.splice(0,0,
                                    {
                                        "ruta": "/MDdiario",
                                        "nombreMenu": "Metrados diarios",
                                        "nombrecomponente":"MDdiario"
                                    }
                                )
                            }else if(estado == "Corte"){
                                element.submenus.splice(0,0,
                                    {
                                        "nombreMenu": "Corte de obra",
                                        "ruta": "/CorteObra",
                                        "nombrecomponente":"CorteObra"
                                    }
                                )
                            }else if(estado == "Actualizacion"){
                                element.submenus.splice(0,0,
                                    {
                                        "nombreMenu": "Actualización de obra",
                                        "ruta": "/ActualizacionObra",
                                        "nombrecomponente":"ActualizacionObra"
                                    }
                                )
                            }else if(estado == "Paralizado"){
                                element.submenus.splice(0,0,
                                    {
                                        "nombreMenu": "Paralizado ",
                                        "ruta": "/ParalizacionObra",
                                        "nombrecomponente":"ParalizacionObra"
                                    }
                                )
                            }else if(estado == "Compatibilidad"){
                                element.submenus.splice(0,0,
                                    {
                                        "nombreMenu": "Compatibilidad",
                                        "ruta": "/CompatibilidadObra",
                                        "nombrecomponente":"CompatibilidadObra"
                                    }
                                )
                            }
                            

                        }
                         
                    }
                    console.log("res",json); 
                    callback(null,json);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postTipoObra = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{            
            conn.query("INSERT INTO tipoObras (nombre, codigo) VALUES ?",[data],(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.getTipoObras = (callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{            
            
            
            conn.query("select * from tipoobras",(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postUnidadEjecutora = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{            
            conn.query("INSERT INTO UnidadEjecutoras (nombre) VALUES ?",[data],(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.getUnidadEjecutora = (callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{                       
            conn.query("select * from UnidadEjecutoras",(error,res)=>{
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
//mish
// cambio de nombre mish
userModel.postmetas = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("insert into metas set ?",[data],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                   
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}

userModel.PostCostosyGanancias = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("insert into CostosyGanancias set ?",[data],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                   
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}

userModel.getGananciasyCostos = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("select * from costosyganancias",(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                   
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}

userModel.PostHistorialCyG = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("insert into HistorialCyG set ?",[data],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                   
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.postcronogramamensual = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("insert into cronogramamensual (fichas_id_ficha,mes,programado,financieroEjecutado)values ?",[data],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                   
                    console.log("res",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}


userModel.getcronogramamensual = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("select fichas_id_ficha,programado,financieroEjecutado,mes from cronogramamensual where fichas_id_ficha = ?",[data],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                }else{
                    var listaMes = []
                    var programado = []
                    var financieroEjecutado = []
                    ///ac tres arrays de la consulta
                    for (let i = 0; i < res.length; i++) {
                        const element = res[i];
                        console.log(element.mes);
                        listaMes.push(element.mes)
                        programado.push(element.programado)
                        financieroEjecutado.push(element.financieroEjecutado)
                    }

                    var cronogramamensual = {
                        "mes":listaMes,
                        "programado":programado,
                        "financieroEjecutado":financieroEjecutado
                    }





                    console.log()
                    //hasta aqui
                   
                    // console.log("res",listaMes); 
                    callback(null,cronogramamensual);
                    conn.destroy()
                }
                
                
            })
        }                
    })
}
userModel.posthistorialActividades = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('insert into historialActividades set ?',data,(err,res)=>{ 
                if(err){
                    console.log(err);
                    callback(err.code);
                }else{      
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}

module.exports = userModel;