const { resume } = require("../../../utils/logger");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerTodos = ({
  id_ficha,
  anyo,
  mes,
  id_componente,
  id_partidaImagen,
  id_AvanceActividades,
}) => {
  return new Promise((resolve, reject) => {
    var condiciones = [];
    if (id_ficha) {
      condiciones.push(`componentes.fichas_id_ficha = ${id_ficha}`);
    }
    if (anyo) {
      condiciones.push(`YEAR(imagenesObra.fecha) = ${anyo}`);
    }
    if (mes) {
      condiciones.push(`MONTH(imagenesObra.fecha) = ${mes}`);
    }
    if (id_componente) {
      condiciones.push(`id_componente = ${id_componente}`);
    }
    var query = new queryBuilder("componentes")
      .select([
        `imagenes_labels.*`,
        `accesos.nombre usuario_nombre`,
        `accesos.apellido_paterno usuario_apellido_paterno`,
        `cargos.nombre cargo_nombre`,
      ])
      .leftJoin(
        `partidas ON partidas.componentes_id_componente = componentes.id_componente
        LEFT JOIN
    (SELECT
        partidasimagenes.fecha,
            partidasimagenes.imagen,
            partidasimagenes.descripcionObservacion observacion,
            partidas_id_partida,
            imagenes_labels_id,
            accesos_id
    FROM
        partidasimagenes
    LEFT JOIN imagenes_labels_asignadas ON imagenes_labels_asignadas.partidasimagenes_id_partidaImagen = partidasimagenes.id_partidaImagen
    ${
      id_partidaImagen || id_AvanceActividades
        ? id_partidaImagen
          ? ` WHERE partidasimagenes_id_partidaImagen = ${id_partidaImagen}`
          : " WHERE false"
        : ""
    }

    UNION ALL SELECT
        fecha,
            imagen,
            avanceactividades.observacion,
            partidas_id_partida,
            imagenes_labels_id,
            accesos_id
    FROM
        actividades
    INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    LEFT JOIN imagenes_labels_asignadas ON imagenes_labels_asignadas.avanceactividades_id_AvanceActividades = avanceactividades.id_AvanceActividades
    WHERE
        imagen IS NOT NULL
           ${
             id_partidaImagen || id_AvanceActividades
               ? id_AvanceActividades
                 ? ` AND avanceactividades_id_AvanceActividades = ${id_AvanceActividades}`
                 : " AND false"
               : ""
           }
        ) imagenesObra ON imagenesObra.partidas_id_partida = partidas.id_partida
        LEFT JOIN
    accesos ON accesos.id_acceso = imagenesObra.accesos_id
        LEFT JOIN
    fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
        LEFT JOIN
    cargos ON cargos.id_Cargo = fichas_has_accesos.cargos_id_Cargo
        INNER JOIN
    imagenes_labels ON imagenes_labels.id = imagenesObra.imagenes_labels_id`
      )
      .where(condiciones)
      .groupBy(`imagenes_labels.id`)
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
