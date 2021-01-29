const DB = {};

DB.obtenerTodos = ({ id_ficha, id_cargo, habilitado, cargos_tipo_id }) => {
  return new Promise((resolve, reject) => {
    var query = `
              SELECT
                  fichas_has_accesos.id id_asignacion,
                  usuarios.*,
                  CONCAT(usuarios.apellido_paterno,
                          ' ',
                          usuarios.apellido_materno,
                          ' ',
                          usuarios.nombre) nombre_usuario,
                  cargos.nombre cargo_nombre,
                  fichas_has_accesos.memorandum,
                  accesos.id_acceso,
                  fichas_has_accesos.habilitado
              FROM
                  fichas
                      LEFT JOIN
                  fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
                      LEFT JOIN
                  accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
                      INNER JOIN
                  usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario
                      LEFT JOIN
                  cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo


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
                cargos.nombre cargo_nombre, usuarios.nombre usuario_nombre
            FROM
                accesos
                    LEFT JOIN
                cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo
                    LEFT JOIN
                usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario
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

module.exports = DB;
