const pool = require('../../../../db/connection');
function formato(data){
    
    // data = parseFloat(data)
    data = Number(data)
    if(isNaN(data)){
        
        data=0
    }
    if(data == 0){
        return 0
    }
    else if(data < 1){
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          })
    }else{
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
    } 

    return data
}
let userModel = {};

userModel.postAvanceActividad = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO AvanceActividades set ?',data,(error,res)=>{
                if(error){
                    callback(error);
                    conn.destroy()
                }else{
                    console.log("affectedRows",res); 
                    callback(null,res);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.postActividad = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO actividades set ?',data,(error,res)=>{
                if(error){
                    callback(error);
                    conn.destroy()
                }else{
                    console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
userModel.posthistorialActividades = (data,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query('INSERT INTO historialActividades set ?',data,(error,res)=>{
                if(error){
                    callback(error);
                    conn.destroy()
                }else{
                    console.log("affectedRows",res); 
                    callback(null,res.insertId);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}
module.exports = userModel;