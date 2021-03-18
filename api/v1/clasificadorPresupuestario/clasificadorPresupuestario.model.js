const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};
DB.obtenerDatos = ({ textoBuscado, limit, id_inicio, id_final }) => {
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
    if (id_inicio) {
      condiciones.push(`(id >= ${id_inicio})`);
    }
    if (id_final) {
      condiciones.push(`(id <= ${id_final})`);
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
DB.obtenerDatosAnalitico = ({ id_ficha, textoBuscado }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("presupuestoanalitico_costosasignados")
      .select(["clasificadores_presupuestarios.*"])
      .leftJoin(
        ` presupuesto_analitico ON presupuesto_analitico.presupuestoanalitico_costosasignados_id = presupuestoanalitico_costosasignados.id
        LEFT JOIN
    clasificadores_presupuestarios ON clasificadores_presupuestarios.id = presupuesto_analitico.clasificadores_presupuestarios_id`
      )
      .where([
        `fichas_id_ficha = ${id_ficha}`,
        `( REPLACE(clasificador, ' ', '') like '%${textoBuscado.replace(
          / /g,
          ""
        )}%' or descripcion like '%${textoBuscado}%')`,
      ])
      .groupBy(`clasificadores_presupuestarios.id`)
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
DB.predecirDatosAnalitico = ({ id_ficha, id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("presupuestoanalitico_costosasignados")
      .select(["clasificadores_presupuestarios.*"])
      .leftJoin(
        ` presupuesto_analitico ON presupuesto_analitico.presupuestoanalitico_costosasignados_id = presupuestoanalitico_costosasignados.id
        LEFT JOIN
    clasificadores_presupuestarios ON clasificadores_presupuestarios.id = presupuesto_analitico.clasificadores_presupuestarios_id`
      )
      .where([
        `fichas_id_ficha = ${id_ficha}`,
        `clasificadores_presupuestarios.id > ${id} `,
      ])
      .groupBy(`clasificadores_presupuestarios.id`)
      .limit(1)
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
module.exports = DB;
