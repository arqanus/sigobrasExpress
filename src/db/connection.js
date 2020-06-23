const mysql = require('mysql');
var pool = mysql.createPool({
    
    // //MODO SERVIDOR PARA SUBIR TIENE ESTAR ACTIVO
    host: 'localhost',
    user: 'root',
    password: 'Mds@anton@mysqlserver1.',  
    database: 'sigobras_db',
    
   
    // MODO REMOTO PARA TRABAJARLO LOCALMENTE
    // host:'190.117.94.80',
    // user: 'kaido',
    // password: 'K@idos1.',    
    // database: 'sigobras_db',   
    
});
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection){
        console.log("Database Connection stablished")
        connection.release()
    }
    return
})
module.exports = pool;