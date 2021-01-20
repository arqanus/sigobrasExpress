const DB = {};
DB.obtenerTodosPublico = ({ id_unidadEjecutora }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
      sectores.*
    FROM
        fichas
            LEFT JOIN
        sectores ON sectores.idsectores = fichas.sectores_idsectores
            LEFT JOIN
        unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
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
module.exports = DB;
