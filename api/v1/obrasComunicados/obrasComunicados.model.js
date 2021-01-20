const DB = {};
DB.obtenerTodos = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        *
    FROM
        comunicados_has_fichas
            LEFT JOIN
        comunicados ON comunicados.idcomunicados = comunicados_has_fichas.comunicados_idcomunicados
    WHERE
        fichas_id_ficha = ${id_ficha}
            AND fecha_inicial <= CURDATE()
            AND CURDATE() <= fecha_final
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
