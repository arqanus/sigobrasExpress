const pool = require('../../../../db/connection');
let userModel = {};
userModel.postcronogramamensual = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("INSERT INTO cronogramamensual (fichas_id_ficha,mes,programado, financieroEjecutado) VALUES ? ON DUPLICATE key UPDATE financieroEjecutado = VALUES(financieroEjecutado) ,programado = VALUES(programado) ",[data],(error,res)=>{ 
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
userModel.postAvanceFinanciero = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("INSERT INTO cronogramamensual (fichas_id_ficha,mes, financieroEjecutado) VALUES ? ON DUPLICATE key UPDATE financieroEjecutado = VALUES(financieroEjecutado) ",[data],(error,res)=>{ 
                if(error){
                    console.log(error);                    
                    callback(error.code);
                    conn.destroy()
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