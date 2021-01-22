const DB = {};
DB.obtenerTodosPublico = () => {
  return new Promise((resolve, reject) => {
    var query = `
   SELECT
        unidadejecutoras.*
    FROM
        fichas
            LEFT JOIN
        unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
    WHERE
        estado_publico
    GROUP BY unidadejecutoras.id_unidadEjecutora
    order by poblacion desc
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
DB.obtenerTodos = ({ id_acceso }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        unidadejecutoras.*
    FROM
        unidadejecutoras
            LEFT JOIN
        fichas ON fichas.unidadEjecutoras_id_unidadEjecutora = unidadejecutoras.id_unidadEjecutora
            LEFT JOIN
        fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
    WHERE
        fichas_has_accesos.Accesos_id_acceso = ${id_acceso}
    GROUP BY unidadejecutoras.id_unidadEjecutora
    ORDER BY poblacion DESC
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
module.exports = DB;
