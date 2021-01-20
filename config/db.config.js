const mysql = require("mysql");
const log = require("../utils/logger");

var pool = mysql.createPool({
  connectionLimit: 200,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  // multipleStatements: true,
});
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }
  if (connection) {
    console.log("Database Connection stablished");
    connection.release();
  }
  return;
});
if (process.env.NODE_ENV === "dev") {
  pool.on("acquire", function (connection) {
    console.log("Connection %d acquired", connection.threadId);
  });
  // pool.on("connection", function (connection) {
  //   // connection.query("SET SESSION auto_increment_increment=1");
  // });
  pool.on("release", function (connection) {
    console.log("Connection %d released", connection.threadId);
  });
}
pool.on("enqueue", function () {
  log.warn("Waiting for available connection slot");
});
module.exports = pool;
