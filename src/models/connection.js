const mysql = require('mysql');

var connection = mysql.createConnection(
  
  {}
  );

var pool = mysql.createPool({
   
    
    host: '192.168.0.4',
    user: 'kaido',
    password: 'kaido',    
    database: 'SIGOBRAS_DB',
    connectTimeout: 1000

    // host: '192.168.0.4',
    // user: 'kaido',
    // password: 'kaido',    
    // database: 'SIGOBRAS_DB_TEST',
    // connectTimeout: 1000

    // host: 'localhost',
    // user: 'root',
    // password: 'password',    
    // database: 'SIGOBRAS_DB',
    // connectTimeout: 1000
    
    
    
});    
connection.on('error', function(err) {
  console.log(err.code); // 'ER_BAD_DB_ERROR'
});
module.exports = pool;