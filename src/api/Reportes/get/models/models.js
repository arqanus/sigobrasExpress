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

module.exports = userModel;
