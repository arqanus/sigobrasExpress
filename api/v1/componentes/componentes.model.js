const DB = {};
DB.obtenerTodos = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        *
    FROM
        componentes
    WHERE
        fichas_id_ficha = ${id_ficha}
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
DB.costoDirecto = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        SUM(componentes.presupuesto) monto
    FROM
        componentes
    WHERE
        componentes.fichas_id_ficha = ${id_ficha}
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
module.exports = DB;
