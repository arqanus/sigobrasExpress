const { resume } = require("../../../utils/logger");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerTodos = ({ id_partidaImagen, id_AvanceActividades }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("imagenes_labels_asignadas")
      .select(`imagenes_labels.*, imagenes_labels_asignadas.id`)
      .leftJoin(
        `imagenes_labels ON imagenes_labels.id = imagenes_labels_asignadas.imagenes_labels_id`
      )
      .where([
        id_partidaImagen
          ? `partidasimagenes_id_partidaImagen = ${id_partidaImagen}`
          : `avanceactividades_id_AvanceActividades=${id_AvanceActividades}`,
      ])
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
    var query = new queryBuilder("imagenes_labels_asignadas")
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
DB.actualizar = ({ id, imagenes_labels_id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("imagenes_labels_asignadas")
      .update({ imagenes_labels_id })
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
    var query = new queryBuilder("imagenes_labels_asignadas")
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
