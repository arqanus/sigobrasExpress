const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};
DB.obtenerDatos = ({ id_ficha, anyo, mes, limit, estado_presentado, id }) => {
  return new Promise((resolve, reject) => {
    var condiciones = [];
    if (id_ficha) {
      condiciones.push(`fichas_id_ficha = ${id_ficha}`);
    }
    if (anyo) {
      condiciones.push(`anyo = ${anyo}`);
    }
    if (id) {
      condiciones.push(`infobras_informes.id = ${id}`);
    }
    if (mes) {
      condiciones.push(`mes = ${mes}`);
    }
    if (estado_presentado) {
      condiciones.push(`estado_presentado = ${estado_presentado}`);
    }
    var query = new queryBuilder()
      .select([
        "infobras_informes.*",
        ["fecha_recepcion", "fecha_recepcion", "date"],
        ["fecharegisto_infobras", "fecharegisto_infobras", "date"],
        "abreviacion",
      ])
      .from("infobras_informes")
      .leftJoin(
        `informes_ubicaciones ON informes_ubicaciones.id = infobras_informes.informes_ubicaciones_id`
      )
      .where(condiciones)
      .orderBy(["anyo", "mes"])
      .limit(limit);
    query = query.toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarDatos = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.updateOnDuplicateKey("infobras_informes", data);
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerDescripcion = ({ id, padres, padre }) => {
  return new Promise((resolve, reject) => {
    var condiciones = [];
    if (id) {
      condiciones.push(`infobras_informes_id = ${id}`);
    }
    if (padres) {
      condiciones.push(`padre is null`);
    }
    if (padre) {
      condiciones.push(`padre = ${padre}`);
    }
    var query = new queryBuilder("infobras_informes_descripcion").where(
      condiciones
    );
    query = query.toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarDescripcion = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("infobras_informes_descripcion")
      .insert(data)
      .merge()
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.eliminarDescripcion = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("infobras_informes_descripcion")
      .where(`id = ${id}`)
      .del()
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.guardarDescripcion = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("infobras_informes_descripcion")
      .insert(data)
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
module.exports = DB;
