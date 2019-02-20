const pool = require('./connection');
let userModel = {};
userModel.postObra = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO fichas SET ?', data,(error,res)=>{
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
            if(error) callback(error);            
            callback(null,res);
            conn.destroy()
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
            if(error) callback(error);            
            callback(null,res);
            conn.destroy()
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
                if(error) callback(error.code);
                console.log("res ",res); 
                callback(null,res);
                conn.destroy()
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
                if(error) callback(error.code);
                console.log("affectedRows",res); 
                callback(null,res.affectedRows);
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
        conn.query('select *from componentes where Fichas_id_ficha = ?',id_ficha, (error,res)=>{
            if(error) callback(error);            
            callback(null,res);
            conn.destroy()
        })        
    })
}
userModel.postPartidas = (data,callback)=>{
    // console.log("postPartidas");
    console.log("partidaData",data);
    pool.getConnection(function(err,conn){
        if(err){ callback(err);}
        else{     
            conn.query('INSERT INTO partidas (tipo,item,descripcion,unidad_medida,metrado,costo_unitario,equipo,rendimiento,Componentes_id_componente,presupuestos_id_presupuesto) VALUES ?',[data],(error,res)=>{
                if(error){
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
userModel.postActividades = (data,callback)=>{
    console.log("postactividadaes");
    pool.getConnection(function(err,conn){
        // console.log(data)
        if(err){ callback(err);}
        else{       
            conn.query('INSERT INTO actividades (nombre,veces,largo,ancho,alto,parcial,Partidas_id_partida) VALUES ?',[data],(error,res)=>{
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
            conn.query("SELECT accesos.id_acceso, cargos.nombre nombre_cargo, usuarios.nombre nombre_usuario FROM accesos LEFT JOIN cargos ON accesos.Cargos_id_Cargo = cargos.id_Cargo LEFT JOIN usuarios ON accesos.Usuarios_id_usuario = usuarios.id_usuario WHERE usuario ='"+data.usuario+"' AND password = '"+data.password+"'",(error,res)=>{
                if(error) {
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



module.exports = userModel;