const pool = require('../../../../db/connection');  

let userModel = {}; 

userModel.infobras = (id_ficha) => { 
    return new Promise((resolve, reject) => { var query = "SELECT DATE_FORMAT (fecha_inicial, '%Y-%m-%d') fecha_inicial, g_tipo_act, codigo, g_meta, g_snip, tiempo_ejec, g_total_presu FROM fichas WHERE id_ficha = ?"
        pool.query(query, [id_ficha], (error, resultado) => { 
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
                                        
            }
        })
    })
}

module.exports = userModel;

