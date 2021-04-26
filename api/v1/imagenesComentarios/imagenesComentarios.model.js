const { resume } = require("../../../utils/logger");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerTodos = ({ id_partidaImagen, id_AvanceActividades, id_ficha }) => {
  return new Promise((resolve, reject) => {
    var condiciones = [
      id_partidaImagen
        ? `partidasimagenes_id_partidaImagen = ${id_partidaImagen}`
        : `avanceactividades_id_AvanceActividades = ${id_AvanceActividades}`,
      `fichas_id_ficha = ${id_ficha}`,
    ];
    var query = new queryBuilder("imagenes_comentarios")
      .select([
        "imagenes_comentarios.*",
        "accesos.nombre usuario_nombre",
        "accesos.apellido_paterno usuario_apellido_paterno",
        "cargos.nombre cargo_nombre",
      ])
      .leftJoin(
        `accesos ON accesos.id_acceso = imagenes_comentarios.accesos_id
        LEFT JOIN
    fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
        LEFT JOIN
    cargos ON cargos.id_Cargo = fichas_has_accesos.cargos_id_Cargo
        `
      )
      .where(condiciones)
      .toString();
    // resolve(query);
    // return;
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.guardar = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("imagenes_comentarios")
      .insert(data)
      .toString();
    // resolve(query);
    // return;
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizar = ({ id, updateData }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("imagenes_comentarios")
      .update(updateData)
      .where([`id = ${id}`])
      .toString();
    // resolve(query);
    // return;
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.eliminar = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("imagenes_comentarios")
      .del()
      .where([`id = ${id}`])
      .toString();
    // resolve(query);
    // return;
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
