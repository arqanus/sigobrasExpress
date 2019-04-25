const pool = require('../../../../db/connection');
let userModel = {};

userModel.postProyecto = (data,callback)=>{
         
    pool.query('INSERT INTO proyectos SET ?', data,(error,res)=>{
        if(error){
            callback(error);
        }else{
            console.log("res",res);
            callback(null,res.insertId);
        }        
    })  
}


module.exports = userModel;
