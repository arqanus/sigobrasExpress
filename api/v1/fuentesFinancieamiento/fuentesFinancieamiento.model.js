const BaseModel = require("../../libs/baseModel");
const DB = {};

DB.obtenerTodos = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = `
          SELECT
              *
          FROM
              fuentes_financiamiento
          WHERE
              id_ficha = ${id_ficha}
              AND anyo = ${anyo}
            `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarDatosLista = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.updateOnDuplicateKey("fuentes_financiamiento", data);
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.eliminarById = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.delete("fuentes_financiamiento", [`(id = ${id})`]);
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
