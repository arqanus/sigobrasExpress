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
module.exports = DB;
