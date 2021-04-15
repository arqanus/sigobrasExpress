const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerTodos = ({ id_tipocomprobante_asignado }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("comprobantes_asignados")
      .select([
        "comprobantes_asignados.*",
        ["comprobantes_asignados.fecha", "fecha", "date"],
      ])
      .where(
        `comprobantes_asignados.tiposcomprobantes_asignados_id = ${id_tipocomprobante_asignado}`
      )
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.guardar = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("comprobantes_asignados")
      .insert(data)
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
DB.eliminar = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("comprobantes_asignados")
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
DB.actualizar = ({
  id,
  numero_tipo_comprobante,
  fecha,
  siaf,
  numero_comprobante,
  numero_pecosa,
  monto_total,
  razon_social,
  observacion,
  archivo,
}) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("comprobantes_asignados")
      .update({
        numero_tipo_comprobante,
        fecha,
        siaf,
        numero_comprobante,
        numero_pecosa,
        monto_total,
        razon_social,
        observacion,
        archivo,
      })
      .where(`id = ${id}`)
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
DB.avanceMensual = ({ id_avanceMensual }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("tiposcomprobantes_asignados")
      .select(`SUM(monto_total) monto_total`)
      .leftJoin(
        `comprobantes_asignados ON comprobantes_asignados.tiposcomprobantes_asignados_id = tiposcomprobantes_asignados.id`
      )
      .where(
        `tiposcomprobantes_asignados.fuentesfinanciamiento_avancemensual_id = ${id_avanceMensual}`
      )
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
module.exports = DB;
