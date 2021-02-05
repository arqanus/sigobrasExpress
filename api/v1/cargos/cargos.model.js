const DB = {};

DB.obtenerTodos = ({ id_ficha, cargos_tipo_id }) => {
  return new Promise((resolve, reject) => {
    var query = `
               SELECT * FROM cargos
            `;
    var condiciones = [];
    if (cargos_tipo_id != "" && cargos_tipo_id != undefined) {
      condiciones.push(`(cargos_tipo_id = ${cargos_tipo_id})`);
    }
    if (condiciones.length > 0) {
      query += " WHERE " + condiciones.join(" AND ");
    }
    query += `
      ORDER BY cargos.nivel
    `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerTodosByObra = ({ id_ficha, cargos_tipo_id }) => {
  return new Promise((resolve, reject) => {
    var query = `
                SELECT
                    cargos.nombre cargo_nombre, cargos.id_cargo
                FROM
                    fichas_has_accesos
                        LEFT JOIN
                    accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
                        INNER JOIN
                    cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo
                WHERE
                    fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
            `;
    var condiciones = [];
    if (cargos_tipo_id != "" && cargos_tipo_id != undefined) {
      condiciones.push(`(cargos_tipo_id = ${cargos_tipo_id})`);
    }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += `
     GROUP BY cargos.id_Cargo
                ORDER BY cargos.nivel
    `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerUltimoCargoById = ({ id, id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = `
              SELECT
                  fichas_has_accesos.id,
                  usuarios.apellido_paterno,
                  usuarios.apellido_materno,
                  usuarios.nombre
              FROM
                  fichas_has_accesos
                      LEFT JOIN
                  accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
                      INNER JOIN
                  cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo
                      LEFT JOIN
                  usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario
              WHERE
                  fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
                      AND id_Cargo = ${id}
              ORDER BY fichas_has_accesos.id DESC
              LIMIT 1
            `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
module.exports = DB;
