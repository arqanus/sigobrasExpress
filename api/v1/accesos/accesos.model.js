const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
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
DB.crear = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.insert("accesos", data);
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
DB.asignarObra = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.insert("fichas_has_accesos", data);
    pool.query(query, (err, res) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
DB.obtenerLastId = () => {
  return new Promise((resolve, reject) => {
    const query = `
      select id_acceso id from accesos order by id_acceso desc limit 1
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
DB.getDataAsignacion = ({
  Fichas_id_ficha,
  Accesos_id_acceso,
  cargos_id_Cargo,
}) => {
  return new Promise((resolve, reject) => {
    const query = new queryBuilder("fichas_has_accesos")
      .where([
        `Fichas_id_ficha = ${Fichas_id_ficha}`,
        `Accesos_id_acceso = ${Accesos_id_acceso}`,
        `cargos_id_Cargo = ${cargos_id_Cargo}`,
      ])
      .toString();
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
