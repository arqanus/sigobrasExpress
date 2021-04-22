const DB = {};
const queryBuilder = require("../../libs/queryBuilder");
DB.obtenerAvanceByComponente = ({ id_componente }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        SUM(avanceactividades.valor * partidas.costo_unitario) avance
    FROM
        partidas
            LEFT JOIN
        actividades ON actividades.Partidas_id_partida = partidas.id_partida
            LEFT JOIN
        avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    WHERE
        partidas.componentes_id_componente = ${id_componente}
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
DB.obtenerAvanceResumenAnual = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = `
     SELECT
        mes, fisico_monto,fisico_programado_monto
    FROM
        curva_s
    WHERE
        anyo = ${anyo} AND fichas_id_ficha = ${id_ficha}
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
DB.obtenerAvanceAcumuladoAnual = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        SUM(fisico_monto) fisico_monto,
         SUM(financiero_monto) financiero_monto
    FROM
        curva_s
    WHERE
        anyo <= ${anyo} AND fichas_id_ficha = ${id_ficha}
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
DB.obtenerValorizacionPartidas = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        SUM(fisico_monto) fisico_monto,
         SUM(financiero_monto) financiero_monto
    FROM
        curva_s
    WHERE
        anyo <= ${anyo} AND fichas_id_ficha = ${id_ficha}
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
DB.avanceMetrados = ({ id_componente, anyo, mes, id_partidas }) => {
  return new Promise((resolve, reject) => {
    var condiciones = [];
    if (id_partidas) {
      condiciones.push(`partidas.id_partida in (${id_partidas})`);
    }
    var query = new queryBuilder("partidas")
      .select([`SUM(avanceactividades.valor) metrado_anterior`])
      .leftJoin(
        `actividades ON actividades.Partidas_id_partida = partidas.id_partida
        LEFT JOIN
    avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        AND avanceactividades.fecha < "${anyo}-${mes}-01"
    `
      )
      .where(
        [`componentes_id_componente = ${id_componente}`].concat(condiciones)
      )
      .groupBy(`partidas.id_partida`)
      .toString();
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
DB.obtenerRecursosNombres = ({ id_componente, anyo, mes, id_partidas }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("partidas")
      .select([`recursos.descripcion`])
      .innerJoin(
        `recursos ON recursos.Partidas_id_partida = partidas.id_partida
        AND recursos.tipo = 'Mano de Obra' `
      )
      .where([`partidas.id_partida in (${id_partidas})`])
      .groupBy(`recursos.descripcion`)
      .toString();
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
DB.recursosParcial = ({ id_partidas, recursos_nombres }) => {
  return new Promise((resolve, reject) => {
    var condiciones = [];
    for (let i = 0; i < recursos_nombres.length; i++) {
      const element = recursos_nombres[i];
      condiciones.push(`
      SUM( IF(recursos.descripcion = '${element.descripcion}',
        recursos.parcial,
        0)) recurso_${element.descripcion}
      `);
    }
    var query = new queryBuilder("partidas")
      .select(condiciones)
      .leftJoin(
        `recursos ON recursos.Partidas_id_partida = partidas.id_partida`
      )
      .where([`partidas.id_partida in (${id_partidas})`])
      .groupBy(`partidas.id_partida`)
      .toString();
    // resolve(query);
    // return;
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

DB.obtenerCuadroMetrados = ({ id_componente, anyo, mes }) => {
  return new Promise((resolve, reject) => {
    var date = new Date(anyo, mes, 0);
    var ultimoDia = date.getDate();
    var cols = [];
    for (let index = 1; index <= ultimoDia; index++) {
      cols.push(
        `SUM(IF(DAY(avanceactividades.fecha) = ${index},
        valor,
        0)) dia_${index}`
      );
    }
    var query = new queryBuilder("partidas")
      .select(
        [
          `partidas.id_partida`,
          `partidas.item`,
          `partidas.descripcion`,
          `partidas.unidad_medida`,
          `partidas.metrado`,
          `partidas.tipo`,
        ].concat(cols)
      )
      .leftJoin(
        `actividades ON actividades.Partidas_id_partida = partidas.id_partida
        LEFT JOIN
    avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        AND YEAR(avanceactividades.fecha) = ${anyo}
        AND MONTH(avanceactividades.fecha) = ${mes}
    `
      )
      .where([`componentes_id_componente = ${id_componente}`])
      .groupBy(`partidas.id_partida`)
      .toString();
    // resolve(query);
    // return;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
DB.obtenerCuadroMetradosResumen = ({ id_componente, anyo, mes }) => {
  return new Promise((resolve, reject) => {
    var date = new Date(anyo, mes, 0);
    var ultimoDia = date.getDate();
    var cols = [];
    for (let index = 1; index <= ultimoDia; index++) {
      cols.push(
        `SUM(IF(DAY(avanceactividades.fecha) = ${index},
        valor,
        0)) dia_${index}`
      );
    }
    var query = new queryBuilder("partidas")
      .select(
        [
          `partidas.id_partida`,
          `partidas.item`,
          `partidas.descripcion`,
          `partidas.unidad_medida`,
          `partidas.metrado`,
          `partidas.tipo`,
        ].concat(cols)
      )
      .leftJoin(
        `actividades ON actividades.Partidas_id_partida = partidas.id_partida
        inner JOIN
    avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    `
      )
      .where([
        `componentes_id_componente = ${id_componente}`,
        `YEAR(avanceactividades.fecha) = ${anyo}`,
        `MONTH(avanceactividades.fecha) = ${mes}`,
        `avanceactividades.fecha > 0`,
        `avanceactividades.valor is not null`,
      ])
      .groupBy(`partidas.id_partida`)
      .toString();
    // resolve(query);
    // return;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
DB.eliminarImagen = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("avanceactividades")
      .update({
        imagen: null,
      })
      .tipoNull(true)
      .where([`id_AvanceActividades = ${id}`])
      .toString();
    // resolve(query);
    // return;
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
module.exports = DB;
