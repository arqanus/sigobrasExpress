const DB = {};

DB.obtenerTodosFromAmpliaciones = ({ id_ficha }, ampliaciones) => {
  return new Promise((resolve, reject) => {
    var query = `
            SELECT
                fichas_costosindirectos.*,
                `;
    ampliaciones.forEach((item, i) => {
      query += `
                SUM(IF(fichas_ampliacionpresupuesto_id = ${item.id},
                    fichas_costosindirectos_adicionales.monto,
                    0)) monto_adicional_${i},`;
    });
    query = query.slice(0, -1);
    query += `
            FROM
                fichas_costosindirectos
                    LEFT JOIN
                fichas_costosindirectos_adicionales ON fichas_costosindirectos_adicionales.fichas_costosindirectos_id = fichas_costosindirectos.id
            WHERE
                fichas_id_ficha = ${id_ficha}
            GROUP BY fichas_costosindirectos.id
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
