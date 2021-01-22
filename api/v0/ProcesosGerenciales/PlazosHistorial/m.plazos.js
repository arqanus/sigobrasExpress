const { log } = require("winston");

module.exports = {
  postPlazos(data) {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO plazos_historial SET ?", [data], (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  putPlazos(data) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            INSERT INTO plazos_historial
            (
                id,
                tipo,
                nivel,descripcion,
                fecha_inicio,
                fecha_final,
                documento_resolucion_estado,
                observacion,
                fichas_id_ficha,
                n_dias,
                plazo_aprobado,
                fecha_aprobada
                )
            VALUES
            ?
            ON DUPLICATE KEY UPDATE
            tipo = values(tipo),
            descripcion = values(descripcion),
            fecha_inicio = values(fecha_inicio),
            fecha_final = values(fecha_final),
            documento_resolucion_estado = values(documento_resolucion_estado),
            observacion = values(observacion),
            n_dias = values(n_dias),
            plazo_aprobado = values(plazo_aprobado),
            fecha_aprobada = values(fecha_aprobada)
            `,
        [data],
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  getPlazosPadres({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
        SELECT
            plazos_historial.*,
            plazos_tipo.nombre tipo_nombre,
            DATE_FORMAT(fecha_inicio, '%Y-%m-%d') fecha_inicio,
            DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final,
            DATE_FORMAT(fecha_aprobada, '%Y-%m-%d') fecha_aprobada,
            CONCAT(usuarios.nombre,
                    ' ',
                    usuarios.apellido_paterno) usuario_nombre
        FROM
            plazos_historial
                LEFT JOIN
            plazos_tipo ON plazos_tipo.idplazos_tipo = plazos_historial.tipo
                LEFT JOIN
            accesos ON accesos.id_acceso = plazos_historial.archivo_editor
                LEFT JOIN
            usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario
        WHERE
          plazos_historial.nivel = 1
                AND fichas_id_ficha = ${id_ficha}
            `,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
          console.log("test");
          if (res.length > 0) {
            var id_inicio = res[0].id;
            var id_finalaprobado = null;
            var id_finalsinaprobar = null;
            for (let i = 0; i < res.length; i++) {
              const element = res[i];
              if (element.tipo == 3) {
                if (element.plazo_aprobado) {
                  id_finalaprobado = element.id;
                } else {
                  id_finalsinaprobar = element.id;
                }
              }
            }

            console.log(
              "response actualizacion",
              res[res.length - 1].id,
              id_finalaprobado,
              id_finalsinaprobar
            );
            pool.query(
              `
              INSERT INTO fichas_datosautomaticos
              ( fichas_id_ficha, plazoaprobado_inicial,plazoaprobado_ultimo,plazosinaprobar_ultimo)
              VALUES (${id_ficha},${id_inicio},${id_finalaprobado},${id_finalsinaprobar})
              ON DUPLICATE key UPDATE
              plazoaprobado_inicial = VALUES(plazoaprobado_inicial),
              plazoaprobado_ultimo = VALUES(plazoaprobado_ultimo),
              plazosinaprobar_ultimo = VALUES(plazosinaprobar_ultimo)
            `,
              (err, res) => {
                if (err) {
                  console.log("err", err);
                  reject(err);
                }
                console.log("response de actualizacion", res);
              }
            );
          }
        }
      );
    });
  },
  getPlazosHijos({ id_ficha, id_padre }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            SELECT
                plazos_historial.*, plazos_tipo.nombre tipo_nombre,
                DATE_FORMAT(fecha_inicio,"%Y-%m-%d")fecha_inicio,
                DATE_FORMAT(fecha_final,"%Y-%m-%d")fecha_final,
                DATE_FORMAT(fecha_aprobada,"%Y-%m-%d")fecha_aprobada
            FROM
                plazos_historial
                    LEFT JOIN
                plazos_tipo ON plazos_tipo.idplazos_tipo = plazos_historial.tipo
            WHERE
                plazos_historial.nivel = 2
                    AND fichas_id_ficha = ${id_ficha}
                    AND id_padre = ${id_padre}
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
  deletePlazosPadresAndHijos({ id }) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
            DELETE FROM plazos_historial
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
