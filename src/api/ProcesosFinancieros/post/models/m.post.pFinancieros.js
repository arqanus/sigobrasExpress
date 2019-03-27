const pool = require('../../../../db/connection');

let userModel = {};
userModel.postCostosIndirectos = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("insert into CostosIndirectos (nombre,porcentajeExpediente,presupuesto,Fichas_id_ficha) values ?",[data],(error,res)=>{ 
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
userModel.postHistorialCostosIndirectos = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("insert into historialCostosIndirectos set ?",[data],(error,res)=>{ 
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
userModel.postAvanceFinanciero = (financieroEjecutado,id_ficha,mes,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){                        
            callback(err);
        }
        else{     
            //insertar datos query
            conn.query("update cronogramamensual set cronogramamensual.financieroEjecutado =? where cronogramamensual.fichas_id_ficha = ? and cronogramamensual.mes = ? ",[financieroEjecutado,id_ficha,mes],(error,res)=>{ 
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