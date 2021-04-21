const { resume } = require("../../../utils/logger");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerTodos = ({
  id_ficha,
  texto_buscar,
  id_partidaImagen,
  id_AvanceActividades,
}) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("imagenes_labels")
      .select([
        "imagenes_labels.*",
        "imagenes_labels_asignadas.id IS NOT NULL asignado",
        "imagenes_labels_asignadas.id id_label_asignado",
      ])
      .leftJoin(
        `imagenes_labels_asignadas ON imagenes_labels_asignadas.imagenes_labels_id = imagenes_labels.id AND ${
          id_partidaImagen
            ? `partidasimagenes_id_partidaImagen = ${id_partidaImagen}`
            : `avanceactividades_id_AvanceActividades = ${id_AvanceActividades}`
        }`
      )
      .where([
        `fichas_id_ficha = ${id_ficha}`,
        `(nombre like "%${texto_buscar}%" OR descripcion like "%${texto_buscar}%" )`,
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
    var query = new queryBuilder("imagenes_labels").insert(data).toString();
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
DB.actualizar = ({ id, nombre, descripcion, color }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("imagenes_labels")
      .update({ nombre, descripcion, color })
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
    var query = new queryBuilder("imagenes_labels")
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
