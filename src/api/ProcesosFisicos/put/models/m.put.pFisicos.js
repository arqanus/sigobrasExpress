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
//avanceactividad para saber el estado de obra
userModel.putPrioridad = (id_partida,prioridad,callback)=>{
    
    pool.getConnection(function(err ,conn){
        if(err){ 
            callback(err);
        }else{        
            conn.query('update partidas set partidas.prioridad = ? where partidas.id_partida = ?',[prioridad,id_partida],(error,res)=>{
                if(error){
                    callback(error);
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