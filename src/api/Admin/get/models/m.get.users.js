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
    pool.query('select *from cargos', (error,res)=>{
        if(error){ callback(error);  }
        else{
            callback(null,res);
        }
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


module.exports = userModel;
