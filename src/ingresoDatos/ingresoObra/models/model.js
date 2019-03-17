const pool = require('../../../db/connection');
let userModel = {};
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
