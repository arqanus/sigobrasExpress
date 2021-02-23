const BaseModel = require("../../libs/baseModel");
const DB = {};
DB.obtenerDatos = ({ textoBuscado, limit }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        id,REPLACE(clasificador, ' ', '') clasificador, descripcion
    FROM
        clasificadores_presupuestarios`;
    var condiciones = [];
    if (textoBuscado) {
      condiciones.push(
        `( REPLACE(clasificador, ' ', '') like '%${textoBuscado.replace(
          / /g,
          ""
        )}%' or descripcion like '%${textoBuscado}%')`
      );
    }
    if (condiciones.length) {
      query += " WHERE " + condiciones.join(" AND ");
    }
    if (limit) {
      query += ` limit ${limit}`;
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

module.exports = DB;
