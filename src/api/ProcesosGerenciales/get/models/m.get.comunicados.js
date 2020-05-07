const pool = require('../../../../db/connection');  

let userModel = {}; 


userModel.Comunicados = (fecha_inicial, fecha_final, texto) => { 
    return new Promise((resolve, reject) => {
        var query = "INSERT INTO `sigobras_db`.`comunicados` (`fecha_inicial`, `fecha_final`, texto_mensaje) VALUES (?, ?, ?);"
        pool.query(query, [fecha_inicial, fecha_final, texto], (error, resultado) => { 
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
                                        
            }
        })
    })
}

module.exports = userModel;

