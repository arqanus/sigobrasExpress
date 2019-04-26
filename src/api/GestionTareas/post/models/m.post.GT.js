const pool = require('../../../../db/connection');
let userModel = {};

userModel.postProyecto = (data,callback)=>{
    pool.query('INSERT INTO proyectos SET ?', data,(err,res)=>{
        if(err){
            callback(err);
        }else{
            console.log("res",res);
            callback(null,res.insertId);
        }        
    })  
}
userModel.postTarea = (data,callback)=>{
    pool.query('INSERT INTO tareas SET ?', data,(err,res)=>{
        if(err){
            callback(err);
        }else{
            console.log("res",res);
            callback(null,res.insertId);
        }        
    })  
}
userModel.postTareaAvance = (avance,id_tarea,)=>{
    return new Promise((resolve, reject) => { 
        console.log(avance,id_tarea);
        
        pool.query('update tareas SET avance = ? where id_tarea = ?', [avance,id_tarea],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res.affectedRows)     
        }) 
    })
    
}


module.exports = userModel;
