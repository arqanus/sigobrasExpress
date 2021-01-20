module.exports = {
  postImagenesObra({ url, descripcion, id_acceso, id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            INSERT INTO
                fichas_imagenes
                (url, descripcion, accesos_id_acceso, fichas_id_ficha)
            VALUES
                (\'${url}\', \'${descripcion}\', ${id_acceso}, ${id_ficha});
            `,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  getImagenesObra({ id_ficha, cantidad }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                *
            FROM
                fichas_imagenes
            WHERE
                (fichas_id_ficha =  ${id_ficha} )
            ORDER BY fecha_registro DESC
            LIMIT ${cantidad};
            `,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
};
