const pool = require('../../../../db/connection');
let userModel = {};
userModel.postMeta = (data,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        
        else{
            conn.query("insert into metas set ?",data,(err,res)=>{
                if(err){
                    callback(err);                
                }
                else{      
                    
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


module.exports = userModel;