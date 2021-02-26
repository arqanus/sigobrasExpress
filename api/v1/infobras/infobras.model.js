const BaseModel = require("../../libs/baseModel");
const DB = {};
DB.obtenerDatos = ({ id_ficha, anyo, limit }) => {
  return new Promise((resolve, reject) => {
    var condiciones = [];
    if (id_ficha) {
      condiciones.push(`fichas_id_ficha = ${id_ficha}`);
    }
    if (anyo) {
      condiciones.push(`anyo = ${anyo}`);
    }
    var query = BaseModel.select("infobras_informes", [], condiciones);
    query += " ORDER BY anyo,mes ";
    if (limit) {
      query += `limit ${limit}`;
    }
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarDatos = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.updateOnDuplicateKey("infobras_informes", data);
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
