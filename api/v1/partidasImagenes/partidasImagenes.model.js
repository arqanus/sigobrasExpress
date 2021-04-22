const { resume } = require("../../../utils/logger");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerTodosAnyoMeses = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("componentes")
      .select([
        `${
          anyo
            ? `MONTH(imagenesObra.fecha) mes`
            : "YEAR(imagenesObra.fecha) anyo"
        }`,
      ])
      .leftJoin(
        `
    partidas ON partidas.componentes_id_componente = componentes.id_componente
        INNER JOIN
    (SELECT
        partidasimagenes.fecha,
            partidasimagenes.imagen,
            partidasimagenes.descripcionObservacion observacion,
            partidas_id_partida,
            id_partidaImagen id,
            'partidaImagen' tipo
    FROM
        partidasimagenes UNION ALL SELECT
        fecha,
            imagen,
            avanceactividades.observacion,
            partidas_id_partida,
            id_AvanceActividades id,
            'avanceActividades' tipo
    FROM
        actividades
    INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    WHERE
        imagen IS NOT NULL) imagenesObra ON imagenesObra.partidas_id_partida = partidas.id_partida
        `
      )
      .where([
        `fichas_id_ficha = ${id_ficha}  ${
          anyo ? ` AND year(imagenesObra.fecha)=${anyo}` : ""
        }`,
      ])

      .groupBy(`${anyo && `year(imagenesObra.fecha)`}`)
      .groupBy(
        `${anyo ? "MONTH(imagenesObra.fecha)" : "YEAR(imagenesObra.fecha)"}`
      )
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
DB.obtenerComponentes = ({ id_ficha, anyo, mes }) => {
  return new Promise((resolve, reject) => {
    var condiciones = [`fichas_id_ficha = ${id_ficha}`];
    if (anyo) {
      condiciones.push(`YEAR(imagenesObra.fecha) = ${anyo}`);
    }
    if (mes) {
      condiciones.push(`MONTH(imagenesObra.fecha) = ${mes}`);
    }
    var query = new queryBuilder("componentes")
      .leftJoin(
        `
    partidas ON partidas.componentes_id_componente = componentes.id_componente
        INNER JOIN
    (SELECT
        partidasimagenes.fecha,
            partidasimagenes.imagen,
            partidasimagenes.descripcionObservacion observacion,
            partidas_id_partida,
            id_partidaImagen id,
            'partidaImagen' tipo
    FROM
        partidasimagenes UNION ALL SELECT
        fecha,
            imagen,
            avanceactividades.observacion,
            partidas_id_partida,
            id_AvanceActividades id,
            'avanceActividades' tipo
    FROM
        actividades
    INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    WHERE
        imagen IS NOT NULL) imagenesObra ON imagenesObra.partidas_id_partida = partidas.id_partida
        `
      )
      .where(condiciones)
      .groupBy(`id_componente`)
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
DB.obtenerTodos = ({
  anyo,
  mes,
  id_componente,
  id_ficha,
  resumen,
  imagenes_labels_id,
}) => {
  return new Promise((resolve, reject) => {
    //para anyo mes
    var date = new Date(anyo, mes, 0);
    var ultimoDia = date.getDate();
    var cols = [];
    for (let dia = 1; dia <= ultimoDia; dia++) {
      cols.push(`SUM(IF(DAY(imagenesObra.fecha) = ${dia}, 1, 0)) dia_${dia}`);
    }
    //para historial general

    //condiciones
    var condiciones = [];
    if (resumen == "true" && anyo && mes) {
      condiciones.push(`YEAR(imagenesObra.fecha) = ${anyo}`);
      condiciones.push(`MONTH(imagenesObra.fecha) = ${mes}`);
    }
    if (imagenes_labels_id) {
      condiciones.push(`imagenes_labels_id = ${imagenes_labels_id}`);
    }
    var query = new queryBuilder("componentes")
      .select([`id_partida`, `item`, `descripcion`].concat(cols))
      .leftJoin(
        `
    partidas ON partidas.componentes_id_componente = componentes.id_componente
        LEFT JOIN
    (SELECT
        partidasimagenes.fecha,
            partidasimagenes.imagen,
            partidasimagenes.descripcionObservacion observacion,
            partidas_id_partida,
            imagenes_labels_id
    FROM
        partidasimagenes
    LEFT JOIN imagenes_labels_asignadas ON imagenes_labels_asignadas.partidasimagenes_id_partidaImagen = partidasimagenes.id_partidaImagen UNION ALL SELECT
        fecha,
            imagen,
            avanceactividades.observacion,
            partidas_id_partida,
            imagenes_labels_id
    FROM
        actividades
    INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    LEFT JOIN imagenes_labels_asignadas ON imagenes_labels_asignadas.avanceactividades_id_AvanceActividades = avanceactividades.id_AvanceActividades
    WHERE
        imagen IS NOT NULL) imagenesObra ON imagenesObra.partidas_id_partida = partidas.id_partida
        ` +
          (anyo ? ` AND YEAR(imagenesObra.fecha) = ${anyo} ` : "") +
          (mes ? ` AND MONTH(imagenesObra.fecha) = ${mes} ` : "")
      )
      .where(
        [
          `id_componente = ${id_componente}`,
          `fichas_id_ficha = ${id_ficha}`,
        ].concat(condiciones)
      )
      .groupBy(`id_partida`)
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
DB.obtenerTodosTotalFechas = ({ id_componente, id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("componentes")
      .select([
        `YEAR(imagenesObra.fecha) anyo`,
        `MONTH(imagenesObra.fecha) mes`,
      ])
      .leftJoin(
        `
        partidas ON partidas.componentes_id_componente = componentes.id_componente
        INNER JOIN
    (SELECT
        partidasimagenes.fecha,
            partidasimagenes.imagen,
            partidasimagenes.descripcionObservacion observacion,
            partidas_id_partida,
            id_partidaImagen id,
            'partidaImagen' tipo
    FROM
        partidasimagenes UNION ALL SELECT
        fecha,
            imagen,
            avanceactividades.observacion,
            partidas_id_partida,
            id_AvanceActividades id,
            'avanceActividades' tipo
    FROM
        actividades
    INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    WHERE
        imagen IS NOT NULL) imagenesObra ON imagenesObra.partidas_id_partida = partidas.id_partida
        `
      )
      .where([
        `fichas_id_ficha = ${id_ficha}`,
        `id_componente = ${id_componente}`,
      ])
      .groupBy(`YEAR(imagenesObra.fecha) , MONTH(imagenesObra.fecha) `)
      .orderBy(`YEAR(imagenesObra.fecha) , MONTH(imagenesObra.fecha) `)
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
DB.obtenerTodosTotal = ({
  id_componente,
  id_ficha,
  resumen,
  fechas,
  imagenes_labels_id,
}) => {
  return new Promise((resolve, reject) => {
    var cols = [];
    for (let index = 0; index < fechas.length; index++) {
      const fecha = fechas[index];
      cols.push(` SUM(IF(YEAR(imagenesObra.fecha) = ${fecha.anyo}
            AND MONTH(imagenesObra.fecha) = ${fecha.mes},
        1,
        0)) fecha_${fecha.anyo}_${fecha.mes}`);
    }
    //condiciones
    var condiciones = [];
    if (imagenes_labels_id) {
      condiciones.push(`imagenes_labels_id = ${imagenes_labels_id}`);
    }
    var query = new queryBuilder("componentes")
      .select([`id_partida`, `item`, `descripcion`].concat(cols))
      .innerJoin(
        `
    partidas ON partidas.componentes_id_componente = componentes.id_componente
        ${resumen == "true" ? "inner" : "left"} JOIN
    (SELECT
        partidasimagenes.fecha,
            partidasimagenes.imagen,
            partidasimagenes.descripcionObservacion observacion,
            partidas_id_partida,
            imagenes_labels_id
    FROM
        partidasimagenes
    LEFT JOIN imagenes_labels_asignadas ON imagenes_labels_asignadas.partidasimagenes_id_partidaImagen = partidasimagenes.id_partidaImagen UNION ALL SELECT
        fecha,
            imagen,
            avanceactividades.observacion,
            partidas_id_partida,
            imagenes_labels_id
    FROM
        actividades
    INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    LEFT JOIN imagenes_labels_asignadas ON imagenes_labels_asignadas.avanceactividades_id_AvanceActividades = avanceactividades.id_AvanceActividades
    WHERE
        imagen IS NOT NULL) imagenesObra ON imagenesObra.partidas_id_partida = partidas.id_partida
        `
      )
      .where(
        [
          `id_componente = ${id_componente}`,
          `fichas_id_ficha = ${id_ficha}`,
        ].concat(condiciones)
      )
      .groupBy(`id_partida`)
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
DB.dataById = ({ id, anyo, mes }) => {
  var condiciones = [];
  if (id) {
    condiciones.push(`partidas_id_partida = ${id}`);
  }
  if (anyo) {
    condiciones.push(`YEAR(fecha) = ${anyo}`);
  }
  if (mes) {
    condiciones.push(`MONTH(fecha) = ${mes}`);
  }
  return new Promise((resolve, reject) => {
    var query = new queryBuilder(`
    (SELECT
        partidasimagenes.fecha,
            partidasimagenes.imagen,
            partidasimagenes.descripcionObservacion observacion,
            partidas_id_partida,
            id_partidaImagen id,
            'partidaImagen' tipo
    FROM
        partidasimagenes UNION ALL SELECT
        fecha,
            imagen,
            avanceactividades.observacion,
            partidas_id_partida,
            id_AvanceActividades id,
            'avanceActividades' tipo
    FROM
        actividades
    INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    WHERE
        imagen IS NOT NULL) imagenesObra
    `)
      .select(["imagenesObra.*", ["fecha", "fecha", "date"]])
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
DB.eliminarImagen = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder(`partidasimagenes`)
      .del()
      .where(`id_partidaImagen = ${id}`)
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
