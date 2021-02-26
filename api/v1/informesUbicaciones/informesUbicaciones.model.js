const BaseModel = require("../../libs/baseModel");
const DB = {};
DB.obtenerDatos = () => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.select("informes_ubicaciones");
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
module.exports = DB;
