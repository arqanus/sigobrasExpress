module.exports = {
  getAmpliacionPresupuestal({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                fichas_ampliacionpresupuesto.*, DATE_FORMAT(fecha, '%Y-%m-%d') fecha
            FROM
                fichas_ampliacionpresupuesto
            WHERE
                (fichas_id_ficha =  ${id_ficha} );
            `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  getCostosIndirectosAdicionales({ fichas_ampliacionpresupuesto_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                *
            FROM
                fichas_costosindirectos_adicionales
            WHERE
                fichas_ampliacionpresupuesto_id = ${fichas_ampliacionpresupuesto_id};
            `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  getCostosDirectosAdicionales({ fichas_ampliacionpresupuesto_id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                *
            FROM
                fichas_costosdirectos_adicionales
            WHERE
                fichas_ampliacionpresupuesto_id = ${fichas_ampliacionpresupuesto_id};
            `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
  getEjecucionPresupuestal({ anyo, id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                *
            FROM
                fichas_ejecucionpresupuestal
            WHERE
                anyo = ${anyo} AND fichas_id_ficha = ${id_ficha}
            `,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
};
