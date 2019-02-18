const mysql = require('mysql');

var connection = mysql.createConnection(
  // { multipleStatements: true }
  {}
  );

var pool = mysql.createPool({
    connectionLimit : 500,
    connectTimeout:40000,
    
    // host: '192.168.1.59',
    // user: 'anton',
    // password: 'antontupuedes',    
    // database: 'sigobras'

    host: 'localhost',
    user: 'anton',
    password: 'antontupuedes',    
    database: 'sigobras'
    
    
});    
connection.on('error', function(err) {
  console.log(err.code); // 'ER_BAD_DB_ERROR'
});
module.exports = pool;