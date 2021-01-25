const DB = {};

DB.obtenerTodos = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = `
      SELECT
          *
      FROM
          fichas_ampliacionpresupuesto
      WHERE
          (fichas_id_ficha =  ${id_ficha} );
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
