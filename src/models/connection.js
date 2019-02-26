const mysql = require('mysql');

var connection = mysql.createConnection(
  
  {}
  );

var pool = mysql.createPool({
   
    
    // host: 'us-cdbr-iron-east-03.cleardb.net',
    // user: 'b5ec525fc59630',
    // password: 'e81c813f',
    // database: 'heroku_06daa7d2a5a7a30'

    // host: '192.168.0.4',
    // user: 'kaido',
    // password: 'kaido',    
    // database: 'SIGOBRAS_DB'

    // host: 'localhost',
    // user: 'root',
    // password: 'password',    
    // database: 'SIGOBRAS_DB'
    
    
});    
connection.on('error', function(err) {
  console.log(err.code); // 'ER_BAD_DB_ERROR'
});
module.exports = pool;