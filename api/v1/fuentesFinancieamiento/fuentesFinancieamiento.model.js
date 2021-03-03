const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};
DB.obtenerTodosFuentesFinanaciamiento = () => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento").toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerTodos = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_asignados")
      .select([
        "fuentesfinanciamiento_asignados.*",
        "fuentesfinanciamiento_asignados.id",
        "fuentesfinanciamiento.nombre",
      ])
      .leftJoin(
        "fuentesfinanciamiento on fuentesfinanciamiento.id = fuentesfinanciamiento_asignados.fuentesfinanciamiento_id"
      )
      .where([`  fichas_id_ficha = ${id_ficha}`, `anyo = ${anyo}`])
      .orderBy("fuentesfinanciamiento.id")
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
DB.actualizarDatosLista = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_asignados")
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
DB.eliminarById = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_asignados")
      .where(`(id = ${id})`)
      .del()
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
