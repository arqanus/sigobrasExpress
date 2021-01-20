module.exports = {
  getCostosIndirectos({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                *
            FROM
                fichas_costosindirectos
            WHERE
                (fichas_id_ficha =  ${id_ficha} );
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
  getAmpliacionPresupuesto({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                *
            FROM
                fichas_ampliacionpresupuesto
            WHERE
                (fichas_id_ficha =  ${id_ficha} );
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
  getCostosIndirectosAdicionales({ id_ficha }, ampliaciones) {
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
      // resolve(query)
      pool.query(query, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  postCostosIndirectos({
    nombre,
    monto_expediente,
    monto_adicional,
    id_ficha,
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            INSERT INTO
                fichas_costosindirectos
                    (nombre, monto_expediente, monto_adicional, fichas_id_ficha)
            VALUES
                (\'${nombre}\', ${monto_expediente}, ${monto_adicional}, ${id_ficha});
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
  deleteCostoIndirecto({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            DELETE FROM fichas_costosindirectos
            WHERE
            id = ${id}
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
  putCostoIndirecto({ id, nombre, monto_expediente }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            UPDATE
                fichas_costosindirectos
            SET
                nombre = \'${nombre}\',
                monto_expediente = ${monto_expediente}
            WHERE
                id = ${id}
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
