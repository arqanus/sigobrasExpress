const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerTodos = () => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("tiposcomprobantes").toString();
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
module.exports = DB;
