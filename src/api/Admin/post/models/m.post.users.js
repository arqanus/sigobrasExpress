const pool = require('../../../../db/connection');
let userModel = {};

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

module.exports = userModel;
