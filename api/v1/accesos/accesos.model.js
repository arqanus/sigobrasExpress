const DB = {};
DB.obtenerTodos = () => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT
      *
    FROM
      accesos
    `;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
DB.existe = ({ usuario }) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT
        *
    FROM
        accesos
    WHERE
        usuario = '${usuario}'
    LIMIT 1
    `;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res.length);
    });
  });
};
DB.crear = ({ usuario, hash, id_cargo, id_usuario }) => {
  return new Promise((resolve, reject) => {
    const query = `
    INSERT INTO accesos
      (usuario, password, Cargos_id_Cargo, Usuarios_id_usuario)
    VALUES
      ('${usuario}', '${hash}', '${id_cargo}', '${id_usuario}')
    `;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
DB.obtenerUno = ({ usuario }) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT
        *
    FROM
        accesos
    WHERE
        usuario = '${usuario}'
    LIMIT 1
    `;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.obtenerById = ({ id_acceso }) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT
        *
    FROM
        accesos
    WHERE
        id_acceso = '${id_acceso}'
    LIMIT 1
    `;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res ? res[0] : {});
    });
  });
};
module.exports = DB;
