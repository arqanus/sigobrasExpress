const mysql = require('mysql');

var connection = mysql.createConnection(
  // { multipleStatements: true }
  {}
  );

var pool = mysql.createPool({
    connectionLimit : 500,
    connectTimeout:40000,
    
    // host: 'us-cdbr-iron-east-01.cleardb.net',
    // user: 'b7b9eee1f53a99',
    // password: '686c8bb7',
    // database: 'heroku_0e6ecdf80bb8bdf',
    // mysql:'b7b9eee1f53a99:686c8bb7@us-cdbr-iron-east-01.cleardb.net/heroku_0e6ecdf80bb8bdf?reconnect=true'

    host: 'us-cdbr-iron-east-03.cleardb.net',
    user: 'b5ec525fc59630',
    password: 'e81c813f',
    database: 'heroku_06daa7d2a5a7a30'
    
    
});    
connection.on('error', function(err) {
  console.log(err.code); // 'ER_BAD_DB_ERROR'
});
module.exports = pool;