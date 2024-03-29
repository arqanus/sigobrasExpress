const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};
DB.obtenerCostos = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = `
      SELECT
          presupuestoanalitico_costosasignados.id,
          presupuestoanalitico_costos.id id_costo,
          nombre
      FROM
          presupuestoanalitico_costos
              LEFT JOIN
          presupuestoanalitico_costosasignados ON presupuestoanalitico_costosasignados.presupuestoanalitico_costos_id = presupuestoanalitico_costos.id`;
    var condiciones = [];
    if (id_ficha != 0 && id_ficha != undefined) {
      condiciones.push(`fichas_id_ficha = ${id_ficha}`);
    }
    if (condiciones.length) {
      query += " WHERE " + condiciones.join(" AND ");
    }
    query += ` GROUP BY presupuestoanalitico_costos.id`;
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.guardarCostos = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.insert("presupuestoanalitico_costos", data);
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.asignarCostosObra = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.insert("presupuestoanalitico_costosasignados", data);
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.predecirCostos = ({ id, id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("presupuestoanalitico_costosasignados")
      .select(["presupuestoanalitico_costos.*"])
      .leftJoin(
        `presupuestoanalitico_costos ON presupuestoanalitico_costos.id = presupuestoanalitico_costosasignados.presupuestoanalitico_costos_id`
      )
      .where([
        ` presupuestoanalitico_costos.id > ${id}`,
        ` fichas_id_ficha = ${id_ficha}`,
      ])
      .limit("1")
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
DB.eliminarCosto = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("presupuestoanalitico_costosasignados")
      .del()
      .where(`id = ${id}`)
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
DB.obtenerCostosAnalitico = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("presupuestoanalitico_costosasignados")
      .select(["presupuestoanalitico_costos.*"])
      .leftJoin(
        `presupuestoanalitico_costos ON presupuestoanalitico_costos.id = presupuestoanalitico_costosasignados.presupuestoanalitico_costos_id`
      )
      .where([` fichas_id_ficha = ${id_ficha}`])
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
