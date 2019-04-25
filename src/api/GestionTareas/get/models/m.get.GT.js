const pool = require('../../../../db/connection');
let userModel = {};

userModel.getProyectos = (callback)=>{
    
    
    pool.query('select *from proyectos', (error,res)=>{
        if(error){
            callback(error);
        }else{
            callback(null,res);
        }             
        
    })        
    
}



module.exports = userModel;
