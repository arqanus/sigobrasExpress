const pool = require('../../../../db/connection');
let userModel = {};

userModel.getUsuarios = (callback)=>{
    
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
userModel.getUsuariosAcceso = (callback)=>{
    
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}  
        conn.query("SELECT usuarios.id_usuario, usuarios.nombre, usuarios.apellido_paterno, usuarios.apellido_materno, usuarios.dni, usuarios.direccion, usuarios.email, usuarios.celular, usuarios.cpt FROM usuarios INNER JOIN accesos ON accesos.Usuarios_id_usuario = usuarios.id_usuario", (error,res)=>{
            if(error){ callback(error);  }
            else{
                callback(null,res);
                conn.destroy()
            }
            
        })        
    })
}
//idacceso en login
userModel.getId_acceso = (data,callback)=>{
    console.log("postLogin");
    console.log("data",data);
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{     
            var query = "SELECT accesos.id_acceso,accesos.usuario, cargos.nombre nombre_cargo, usuarios.nombre nombre_usuario,fichas.id_ficha FROM accesos LEFT JOIN cargos ON accesos.Cargos_id_Cargo = cargos.id_Cargo LEFT JOIN usuarios ON accesos.Usuarios_id_usuario = usuarios.id_usuario LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso LEFT JOIN fichas ON fichas.id_ficha = fichas_has_accesos.Fichas_id_ficha WHERE usuario ='"+data.usuario+"' AND password = '"+data.password+"' order by accesos.id_acceso desc limit 1"
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
//revisar
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

module.exports = userModel;
