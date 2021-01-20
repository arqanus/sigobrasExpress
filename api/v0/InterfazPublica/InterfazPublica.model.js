module.exports = {
  postImagenesObra({ url, descripcion, id_acceso, id_ficha }) {
    return new Promise((resolve, reject) => {
      var query = `
      SELECT
          *
      FROM
          fichas
      WHERE
          estado_publico
      `;
      pool.query(query, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
};
