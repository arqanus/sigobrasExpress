const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};
DB.obtenerDatos = ({ id_acceso }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder()
      .from("reportegeneral_interfaces")
      .where(`accesos_id_acceso = ${id_acceso}`)
      .toString();
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
    var query = new queryBuilder("reportegeneral_interfaces")
      .insert(data)
      .merge()
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerInterfazSeleccionada = ({ id_acceso }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("reportegeneral_interfacesseleccion")
      .where(`accesos_id_acceso = ${id_acceso}`)
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.actualizarInterfazSeleccionada = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("reportegeneral_interfacesseleccion")
      .insert(data)
      .merge()
      .toString();
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
