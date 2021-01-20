module.exports = {
  getFichasHasAccesos({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            select * from fichas_has_accesos
            where fichas_has_accesos.Fichas_id_ficha = ${id_ficha};
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
  postFichasNotificaciones(data) {
    return new Promise((resolve, reject) => {
      var query = `
            INSERT INTO fichas_notificaciones
             (url, descripcion, emisor, fichas_notificaciones_tipo_id, fichas_has_accesos_id,asunto)
            VALUES ?
            `;
      console.log("query", query);
      pool.query(query, [data], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getFichasNotificaciones({ id_ficha, id_acceso }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                fichas_notificaciones.*
            FROM
                fichas_notificaciones
                    LEFT JOIN
                fichas_has_accesos ON fichas_has_accesos.id = fichas_notificaciones.fichas_has_accesos_id
            WHERE
                fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
                    AND fichas_has_accesos.Accesos_id_acceso = ${id_acceso}
            ORDER BY fichas_notificaciones.id DESC
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getFichasNotificaciones_cantidad({ id_ficha, id_acceso }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                count(*) cantidad
            FROM
                fichas_notificaciones
                    LEFT JOIN
                fichas_has_accesos ON fichas_has_accesos.id = fichas_notificaciones.fichas_has_accesos_id
            WHERE
                fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
                    AND fichas_has_accesos.Accesos_id_acceso = ${id_acceso}
                    AND revisado = FALSE
            ORDER BY fichas_notificaciones.id DESC
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res ? res[0] : {});
      });
    });
  },
  putFichasNotificaciones({ id_ficha, id_acceso }) {
    return new Promise((resolve, reject) => {
      var query = `
            UPDATE fichas_notificaciones
                LEFT JOIN
            fichas_has_accesos ON fichas_has_accesos.id = fichas_notificaciones.fichas_has_accesos_id
            SET
            revisado = '1'
            WHERE
            fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
                AND fichas_has_accesos.Accesos_id_acceso = ${id_acceso}
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
};
