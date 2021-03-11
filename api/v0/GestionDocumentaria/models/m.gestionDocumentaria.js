module.exports = {
  postgestiondocumentaria_mensajes(data) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO gestiondocumentaria_mensajes set ?`,
        data,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  },
  postgestiondocumentaria_mensajes_archivoAdjunto(data) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO gestiondocumentaria_archivosadjuntos set ?`,
        data,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  },
  postgestiondocumentaria_receptores(data) {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO gestiondocumentaria_receptores(gestiondocumentaria_mensajes_id, receptor_id,cargos_id_Cargo) VALUES ?`,
        [data],
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  },
  getgestiondocumentaria_enviados({ id_acceso }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
        SELECT
            gestiondocumentaria_mensajes.*,
            gestiondocumentaria_archivosadjuntos.documento_link,
            DATE_FORMAT(fecha_registro,"%Y-%m-%d") fecha
        FROM
            accesos
                INNER JOIN
            gestiondocumentaria_mensajes ON gestiondocumentaria_mensajes.emisor_id = accesos.id_acceso
                LEFT JOIN
            gestiondocumentaria_archivosadjuntos ON gestiondocumentaria_archivosadjuntos.gestiondocumentaria_mensajes_id = gestiondocumentaria_mensajes.id
        WHERE
            accesos.id_acceso =  ${id_acceso}
            order by fecha_registro desc
            `,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  },
  getgestiondocumentaria_enviados_usuarios({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                fichas.id_ficha,
                fichas.codigo,
                cargos.nombre cargo_nombre,
                gestiondocumentaria_receptores.mensaje_visto
            FROM
                gestiondocumentaria_mensajes
                    LEFT JOIN
                gestiondocumentaria_receptores ON gestiondocumentaria_receptores.gestiondocumentaria_mensajes_id = gestiondocumentaria_mensajes.id
                    LEFT JOIN
                fichas ON fichas.id_ficha = gestiondocumentaria_receptores.receptor_id
                    LEFT JOIN
                cargos ON cargos.id_Cargo = gestiondocumentaria_receptores.cargos_id_Cargo
            WHERE
                gestiondocumentaria_mensajes.id = ${id}
            `,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  },
  getgestiondocumentaria_receptores_mensaje_visto({
    id_ficha,
    id_acceso,
    gestiondocumentaria_mensajes_id,
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                gestiondocumentaria_receptores.mensaje_visto
            FROM
                gestiondocumentaria_receptores
            WHERE
            receptor_id = ${id_ficha}
            AND gestiondocumentaria_mensajes_id = ${gestiondocumentaria_mensajes_id}
            `,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res ? res[0] : {});
        }
      );
    });
  },
  putgestiondocumentaria_receptores({
    id_ficha,
    gestiondocumentaria_mensajes_id,
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            UPDATE gestiondocumentaria_receptores
            SET
                gestiondocumentaria_receptores.mensaje_visto = TRUE
            WHERE
                receptor_id = ${id_ficha}
                    AND gestiondocumentaria_mensajes_id = ${gestiondocumentaria_mensajes_id}
            `,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  },
  getgestiondocumentaria_recibidos({ id_ficha, id_acceso }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                gestiondocumentaria_mensajes.*,
                gestiondocumentaria_archivosadjuntos.documento_link,
                DATE_FORMAT(fecha_registro, '%Y-%m-%d') fecha,
                gestiondocumentaria_archivosadjuntos.gestiondocumentaria_archivosadjuntos_tipos_id archivoAdjunto_id,
                gestiondocumentaria_archivosadjuntos_tipos.tipo archivoAdjunto_tipo,
                CONCAT(accesos.apellido_paterno,
                        ' ',
                        accesos.apellido_materno,
                        ' ',
                        accesos.nombre) emisor_nombre,
                cargos_receptor.nombre receptor_cargo
            FROM
                fichas
                    INNER JOIN
                gestiondocumentaria_receptores ON gestiondocumentaria_receptores.receptor_id = fichas.id_ficha
                    LEFT JOIN
                cargos cargos_receptor ON cargos_receptor.id_Cargo = gestiondocumentaria_receptores.cargos_id_Cargo
                    LEFT JOIN
                gestiondocumentaria_mensajes ON gestiondocumentaria_mensajes.id = gestiondocumentaria_receptores.gestiondocumentaria_mensajes_id
                    LEFT JOIN
                gestiondocumentaria_archivosadjuntos ON gestiondocumentaria_archivosadjuntos.gestiondocumentaria_mensajes_id = gestiondocumentaria_mensajes.id
                    LEFT JOIN
                gestiondocumentaria_archivosadjuntos_tipos ON gestiondocumentaria_archivosadjuntos_tipos.id = gestiondocumentaria_archivosadjuntos.gestiondocumentaria_archivosadjuntos_tipos_id
                    LEFT JOIN
                accesos ON accesos.id_acceso = gestiondocumentaria_mensajes.emisor_id
            WHERE
                fichas.id_ficha = ${id_ficha}
                AND gestiondocumentaria_mensajes.emisor_id != ${id_acceso}
            ORDER BY fecha_registro DESC
                 `,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  },
  getgestiondocumentaria_recibidos_respuestas({
    id_acceso,
    emisor_id,
    mensaje_id,
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
            gestiondocumentaria_respuestas.*,
            gestiondocumentaria_archivosadjuntos.*,
            DATE_FORMAT(fecha_registro, '%Y-%m-%d') fecha
            FROM
                gestiondocumentaria_respuestas
                    LEFT JOIN
                gestiondocumentaria_archivosadjuntos ON gestiondocumentaria_archivosadjuntos.gestiondocumentaria_respuestas_id = gestiondocumentaria_respuestas.id
            WHERE
                gestiondocumentaria_respuestas.mensaje_id = ${mensaje_id}
                    AND emisor_id =  ${emisor_id}
                    AND receptor_id = ${id_acceso}

                ORDER BY fecha_registro DESC
                 `,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  },
  getgestiondocumentaria_recibidos_respuestas_cantidad({
    id_acceso,
    emisor_id,
    mensaje_id,
  }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                COUNT(*) cantidad
            FROM
                gestiondocumentaria_respuestas
                    LEFT JOIN
                gestiondocumentaria_archivosadjuntos ON gestiondocumentaria_archivosadjuntos.gestiondocumentaria_respuestas_id = gestiondocumentaria_respuestas.id
            WHERE
                gestiondocumentaria_respuestas.mensaje_id = ${mensaje_id}
                    AND emisor_id =  ${emisor_id}
                    AND receptor_id = ${id_acceso}

                ORDER BY fecha_registro DESC
                 `,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res ? res[0] : {});
        }
      );
    });
  },
  postgestiondocumentaria_respuestas(data) {
    return new Promise((resolve, reject) => {
      pool.query(
        `insert into gestiondocumentaria_respuestas set ?`,
        data,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  },
  getfichas_has_accesosId({ id_ficha, id_acceso }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                id
            FROM
                fichas_has_accesos
            WHERE
                fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
                    AND fichas_has_accesos.Accesos_id_acceso = ${id_acceso}`,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res ? res[0] : {});
        }
      );
    });
  },
  getgestiondocumentaria_archivosadjuntos_tipos() {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            select * from gestiondocumentaria_archivosadjuntos_tipos`,
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        }
      );
    });
  },
  putgestiondocumentaria_mensajes_revisado({
    id_mensaje,
    id_acceso,
    revisado,
  }) {
    return new Promise((resolve, reject) => {
      var query = `
            insert into gestiondocumentaria_mensajes_revisado
            (gestiondocumentaria_mensajes_id,accesos_id_acceso,revisado)
            values(${id_mensaje},${id_acceso},${revisado})
            on duplicate key update revisado = values(revisado)
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getgestiondocumentaria_mensajes_revisado({ id_mensaje, id_acceso }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                *
            FROM
                gestiondocumentaria_mensajes_revisado
            WHERE
                gestiondocumentaria_mensajes_id = ${id_mensaje}
                    AND accesos_id_acceso = ${id_acceso};
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res ? res[0] : {});
      });
    });
  },
};
