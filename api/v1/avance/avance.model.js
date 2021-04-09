const DB = {};
const queryBuilder = require("../../libs/queryBuilder");
DB.obtenerAvanceByComponente = ({ id_componente }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        SUM(avanceactividades.valor * partidas.costo_unitario) avance
    FROM
        partidas
            LEFT JOIN
        actividades ON actividades.Partidas_id_partida = partidas.id_partida
            LEFT JOIN
        avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    WHERE
        partidas.componentes_id_componente = ${id_componente}
           `;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.obtenerAvanceResumenAnual = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = `
     SELECT
        mes, fisico_monto,fisico_programado_monto
    FROM
        curva_s
    WHERE
        anyo = ${anyo} AND fichas_id_ficha = ${id_ficha}
           `;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
DB.obtenerAvanceAcumuladoAnual = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        SUM(fisico_monto) fisico_monto,
         SUM(financiero_monto) financiero_monto
    FROM
        curva_s
    WHERE
        anyo <= ${anyo} AND fichas_id_ficha = ${id_ficha}
           `;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.obtenerValorizacionPartidas = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        SUM(fisico_monto) fisico_monto,
         SUM(financiero_monto) financiero_monto
    FROM
        curva_s
    WHERE
        anyo <= ${anyo} AND fichas_id_ficha = ${id_ficha}
           `;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.obtenerCuadroMetrados = ({ id_componente, anyo, mes }) => {
  return new Promise((resolve, reject) => {
    var date = new Date(anyo, mes, 0);
    var ultimoDia = date.getDate();
    var cols = [];
    for (let index = 1; index <= ultimoDia; index++) {
      cols.push(
        `SUM(IF(DAY(avanceactividades.fecha) = ${index},
        valor,
        0)) dia_${index}`
      );
    }
    var query = new queryBuilder("partidas")
      .select([`partidas.item`, `partidas.descripcion`].concat(cols))
      .leftJoin(
        `actividades ON actividades.Partidas_id_partida = partidas.id_partida
        LEFT JOIN
    avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        AND YEAR(avanceactividades.fecha) = ${anyo}
        AND MONTH(avanceactividades.fecha) = ${mes}
    `
      )
      .where([`componentes_id_componente = ${id_componente}`])
      .groupBy(`partidas.id_partida`)
      .toString();
    // resolve(query);
    // return;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
module.exports = DB;
