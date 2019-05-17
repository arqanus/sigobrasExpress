const mysql = require('mysql');



var pool = mysql.createPool({
   
    //**** config en red trabajo */
    // host: '192.168.0.4',
    // user: 'mish',
    // password: 'mish',    
    // database: 'SIGOBRAS_DB',
    // connectTimeout: 1000

    /**********config laptop run* */
<<<<<<< HEAD
    // host: '192.168.0.4',
    // user: 'kaido',
    // password: 'kaido',    
=======
    host: '190.117.94.80',
    user: 'myuser',
    password: 'mypass',    
    database: 'SIGOBRAS_DB',
    connectTimeout: 1000

    // host: 'localhost',
    // user: 'root',
    // password: 'password',    
>>>>>>> dev_master
    // database: 'SIGOBRAS_DB',
    // connectTimeout: 1000

    host: 'localhost',
    user: 'root',
    password: 'password',    
    database: 'SIGOBRAS_DB',
    connectTimeout: 10000
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