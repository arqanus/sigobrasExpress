const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerTodos = ({ id_avancemensual }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("tiposcomprobantes_asignados")
      .select([
        "tiposcomprobantes_asignados.id",
        "nombre",
        "tiposcomprobantes.id id_tipoComprobante",
      ])
      .leftJoin(
        `tiposcomprobantes on tiposcomprobantes.id = tiposcomprobantes_asignados.tiposcomprobante_id`
      )
      .where(`fuentesfinanciamiento_avancemensual_id = ${id_avancemensual}`)
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.predecir = ({ id_avancemensual }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("tiposcomprobantes")
      .select(["MIN(tiposcomprobantes.id) id"])
      .leftJoin(
        `tiposcomprobantes_asignados ON tiposcomprobantes_asignados.tiposcomprobante_id = tiposcomprobantes.id
        AND fuentesfinanciamiento_avancemensual_id = ${id_avancemensual}`
      )
      .where(`tiposcomprobantes_asignados.id IS NULL`)
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.guardar = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("tiposcomprobantes_asignados")
      .insert(data)
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.eliminar = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("tiposcomprobantes_asignados")
      .del()
      .where(`id = ${id}`)
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizar = ({ id, tiposcomprobante_id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("tiposcomprobantes_asignados")
      .update({
        tiposcomprobante_id,
      })
      .where(`id = ${id}`)
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
module.exports = DB;
