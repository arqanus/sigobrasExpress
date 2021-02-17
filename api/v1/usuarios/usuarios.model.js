const DB = {};

DB.obtenerTodos = ({ id_ficha, id_cargo, habilitado, cargos_tipo_id }) => {
  return new Promise((resolve, reject) => {
    var query = `
              SELECT
                  fichas_has_accesos.id id_asignacion,
                  CONCAT(accesos.apellido_paterno,
                          ' ',
                          accesos.apellido_materno,
                          ' ',
                          accesos.nombre) nombre_usuario,
                  cargos.nombre cargo_nombre,
                  accesos.id_acceso,
                  fichas_has_accesos.habilitado,
                  celular,
                  dni,
                  email
              FROM
                  accesos
                      LEFT JOIN
                  fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
                      LEFT JOIN
                  cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
            `;
    var condiciones = [];
    if (id_ficha != "" && id_ficha != undefined && id_ficha != 0) {
      condiciones.push(`(fichas_has_accesos.Fichas_id_ficha = ${id_ficha})`);
    }
    if (id_cargo != "" && id_cargo != undefined && id_cargo != 0) {
      condiciones.push(`(Cargos_id_Cargo = ${id_cargo})`);
    }
    if (habilitado != "" && habilitado != undefined && habilitado != 0) {
      condiciones.push(`(habilitado = ${habilitado})`);
    }
    if (
      cargos_tipo_id != "" &&
      cargos_tipo_id != undefined &&
      cargos_tipo_id != 0
    ) {
      condiciones.push(`(cargos_tipo_id = ${cargos_tipo_id})`);
    }
    if (condiciones.length > 0) {
      query += " WHERE " + condiciones.join(" AND ");
    }
    query += `
      ORDER BY cargos.nivel , accesos.id_acceso DESC
    `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerUsuarioByIdAcceso = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = `
            SELECT
                cargos.nombre cargo_nombre, accesos.nombre usuario_nombre
            FROM
                fichas_has_accesos
                    LEFT JOIN
                cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
                    LEFT JOIN
                accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
            WHERE
                id_acceso = ${id}
            `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.ingresarUsuario = ({
  nombre,
  apellido_paterno,
  apellido_materno,
  dni,
  direccion,
  email,
  celular,
  cpt,
}) => {
  return new Promise((resolve, reject) => {
    var query = `
            INSERT INTO usuarios
            (nombre, apellido_paterno, apellido_materno, dni, direccion, email, celular, cpt)
            VALUES ('${nombre}','${apellido_paterno}','${apellido_materno}','${dni}','${direccion}','${email}','${celular}','${cpt}');
            `;
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarHabilitadoObra = ({ id, habilitado }) => {
  return new Promise((resolve, reject) => {
    var query = `
             UPDATE fichas_has_accesos
              SET
                  habilitado = ${habilitado}
              WHERE
                  (id = ${id});
            `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarTodo = ({
  nombre,
  apellido_paterno,
  apellido_materno,
  dni,
  direccion,
  email,
  celular,
  cpt,
  id,
}) => {
  return new Promise((resolve, reject) => {
    var query = `
          UPDATE usuarios
          SET
              nombre = '${nombre}',
              apellido_paterno = '${apellido_paterno}',
              apellido_materno = '${apellido_materno}',
              dni = '${dni}',
              direccion = '${direccion}',
              email = '${email}',
              celular = '${celular}',
              cpt = '${cpt}'
          WHERE
              (id_usuario =${id})
            `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerUsuariosByIdCargo = ({ id_ficha, id_cargos }) => {
  return new Promise((resolve, reject) => {
    var query = `
          SELECT
              id_cargo,
              CONCAT(apellido_paterno,
                      ' ',
                      apellido_materno,
                      ' ',
                      accesos.nombre) nombre_completo
          FROM
              fichas_has_accesos
                  INNER JOIN
              (SELECT
                  MAX(fichas_has_accesos.id) id
              FROM
                  fichas_has_accesos
              LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
              INNER JOIN cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
              WHERE
                  fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
                      AND id_cargo IN (${id_cargos})
                      AND fichas_has_accesos.habilitado
              GROUP BY cargos.id_Cargo) ultimos_asignados ON ultimos_asignados.id = fichas_has_accesos.id
                  LEFT JOIN
              accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
                  INNER JOIN
              cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
          WHERE
              fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
            `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerUsuarioPorDNI = ({ dni }) => {
  return new Promise((resolve, reject) => {
    var query = `
       SELECT
          nombre,
          apellido_paterno,
          apellido_materno,
          dni,
          direccion,
          email,
          celular,
          cpt
      FROM
          accesos
      WHERE
          dni = ${dni}
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
