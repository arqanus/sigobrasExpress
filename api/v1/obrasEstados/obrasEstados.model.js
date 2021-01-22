const DB = {};

DB.obtenerTodos = ({ id_acceso }) => {
  return new Promise((resolve, reject) => {
    var query = `
   SELECT
        estados.*
    FROM
        fichas_datosautomaticos
            LEFT JOIN
        fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas_datosautomaticos.fichas_id_ficha
            LEFT JOIN
        historialestados ON historialestados.id_historialEstado = fichas_datosautomaticos.estado_obra
            INNER JOIN
        estados ON estados.id_Estado = historialestados.Estados_id_Estado
    WHERE
        fichas_has_accesos.Accesos_id_acceso = ${id_acceso}
    GROUP BY id_Estado
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
