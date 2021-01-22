const DB = {};
DB.obtenerTodosPublico = ({ id_unidadEjecutora }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
      sectores.*
    FROM
      fichas
          LEFT JOIN
      unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
          INNER JOIN
      sectores ON sectores.idsectores = fichas.sectores_idsectores
    WHERE
        estado_publico
           `;
    var condiciones = [];
    if (id_unidadEjecutora != undefined && id_unidadEjecutora != 0) {
      condiciones.push(
        ` (unidadejecutoras.id_unidadEjecutora = ${id_unidadEjecutora})`
      );
    }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += `
    GROUP BY sectores.idsectores
    `;
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
DB.obtenerTodos = ({ id_unidadEjecutora, id_acceso }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        sectores.*
    FROM
        fichas
            LEFT JOIN
        fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
            LEFT JOIN
        unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
            INNER JOIN
        sectores ON sectores.idsectores = fichas.sectores_idsectores
    WHERE
        fichas_has_accesos.Accesos_id_acceso = ${id_acceso}
           `;
    var condiciones = [];
    if (id_unidadEjecutora != undefined && id_unidadEjecutora != 0) {
      condiciones.push(
        ` (unidadejecutoras.id_unidadEjecutora = ${id_unidadEjecutora})`
      );
    }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += `
    GROUP BY sectores.idsectores
    `;
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
