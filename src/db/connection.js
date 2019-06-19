const mysql = require('mysql');
var pool = mysql.createPool({
    //master
    // host: 'localhost',
    // user: 'root',
    // password: 'Mds@anton@mysqlserver1.',  
    // database: 'sigobras_db',
    // //dev
    // host: '192.168.0.4',
    // user: 'kaido',
    // password: 'K@idos1.', 
    // database: 'sigobras_db',
    //master_test
    // host: 'localhost',
    // user: 'root',
    // password: 'Mds@anton@mysqlserver1.',  
    // database: 'sigobras_db_test',
    //dev_test
    // host:'190.117.94.80',
    host: '192.168.0.4',
    user: 'kaido',
    password: 'K@idos1.',    
    database: 'sigobras_db_test',   
    // //dev_test
    // host: '192.168.0.4',
    // user: 'kaido',
    // password: 'kaido',    
    // database: 'sigobras_db_test',
    // //mish
    // host: '192.168.0.4',
    // user: 'mish',
    // password: 'mish',    
    // database: 'sigobras_db_test',
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
    if (connection) connection.release()
    return
})
module.exports = pool;