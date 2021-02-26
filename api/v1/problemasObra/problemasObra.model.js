const BaseModel = require("../../libs/baseModel");
const DB = {};
DB.obtenerDatos = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.select(
      "problemas_obra",
      [
        { columna: "id" },
        { columna: "fecha", format: "fecha" },
        { columna: "titulo" },
        { columna: "descripcion" },
        { columna: "fichas_id_ficha" },
      ],
      [`fichas_id_ficha = ${id_ficha}`]
    );
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
    var query = BaseModel.updateOnDuplicateKey("problemas_obra", data);
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.eliminarData = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.delete("problemas_obra", [`id = ${id}`]);
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
