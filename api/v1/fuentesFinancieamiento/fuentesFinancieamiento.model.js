const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};
DB.obtenerTodosFuentesFinanaciamiento = () => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento").toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerTodosCostos = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_costosasignados")
      .select([
        ["presupuestoanalitico_costos.id", "id_costo"],
        " fuentesfinanciamiento_costosasignados.id",
        "nombre",
      ])
      .leftJoin(
        "presupuestoanalitico_costos ON presupuestoanalitico_costos.id = fuentesfinanciamiento_costosasignados.presupuestoanalitico_costos_id"
      )
      .where(
        `fuentesfinanciamiento_costosasignados.fuentesfinanciamiento_asignados_id = ${id}`
      )
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
DB.obtenerTodosEspecificas = ({ id, anyo }) => {
  return new Promise((resolve, reject) => {
    var avanceMensual = [];
    for (let i = 1; i <= 12; i++) {
      avanceMensual.push(`SUM(IF(fuentesfinanciamiento_avancemensual.anyo = ${anyo}
            AND mes = ${i},
        fuentesfinanciamiento_avancemensual.monto,
        0)) avanceMensual_${i}`);
    }
    var query = new queryBuilder("fuentesfinanciamiento_costosasignados")
      .select(
        [
          ["fuentesfinanciamiento_costosasignados.id", "id_costoasignado"],
          "fuentesfinanciamiento_analitico.id",
          ["clasificadores_presupuestarios.id", "id_clasificador"],
          "clasificador",
          "descripcion",
          "fuentesfinanciamiento_analitico.pia",
        ].concat(avanceMensual)
      )
      .innerJoin(
        `fuentesfinanciamiento_analitico ON fuentesfinanciamiento_analitico.fuentesfinanciamiento_costosasignados_id = fuentesfinanciamiento_costosasignados.id
            LEFT JOIN
        clasificadores_presupuestarios ON clasificadores_presupuestarios.id = fuentesfinanciamiento_analitico.clasificadores_presupuestarios_id
            LEFT JOIN
        fuentesfinanciamiento_avancemensual ON fuentesfinanciamiento_avancemensual.fuentesfinanciamiento_analitico_id = fuentesfinanciamiento_analitico.id`
      )
      .where(
        `fuentesfinanciamiento_costosasignados.fuentesfinanciamiento_asignados_id = ${id}`
      )
      .groupBy("fuentesfinanciamiento_analitico.id")
      .orderBy(
        "fuentesfinanciamiento_costosasignados.id,clasificadores_presupuestarios_id"
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
DB.obtenerTodosEspecificasVariacionesPim = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("variacionespim")
      .where([`fichas_id_ficha = ${id_ficha}`, `anyo = ${anyo}`])
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
DB.obtenerTodosEspecificasVariacionesPimMonto = ({
  id,
  listVariacionesPim,
}) => {
  return new Promise((resolve, reject) => {
    console.log("listVariacionesPim", listVariacionesPim);
    var cols = [];
    for (let i = 0; i < listVariacionesPim.length; i++) {
      const item = listVariacionesPim[i];
      cols.push(`SUM(IF(variacionespim_monto.variacionespim_id = ${item.id},
        variacionespim_monto.monto,
        0)) variacionPim_${item.id}`);
    }
    var query = new queryBuilder("fuentesfinanciamiento_costosasignados")
      .select(
        [["fuentesfinanciamiento_analitico.id", "id_fuentevariacion"]].concat(
          cols
        )
      )
      .innerJoin(
        ` fuentesfinanciamiento_analitico ON fuentesfinanciamiento_analitico.fuentesfinanciamiento_costosasignados_id = fuentesfinanciamiento_costosasignados.id
        LEFT JOIN
    variacionespim_monto ON variacionespim_monto.fuentesfinanciamiento_analitico_id = fuentesfinanciamiento_analitico.id`
      )
      .where(
        `fuentesfinanciamiento_costosasignados.fuentesfinanciamiento_asignados_id = ${id}`
      )
      .groupBy("fuentesfinanciamiento_analitico.id")
      .orderBy(
        "fuentesfinanciamiento_costosasignados.id,clasificadores_presupuestarios_id"
      )
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
DB.obtenerTodos = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_asignados")
      .select([
        "fuentesfinanciamiento_asignados.*",
        "fuentesfinanciamiento_asignados.id",
        "fuentesfinanciamiento.nombre",
      ])
      .leftJoin(
        "fuentesfinanciamiento on fuentesfinanciamiento.id = fuentesfinanciamiento_asignados.fuentesfinanciamiento_id"
      )
      .where([`  fichas_id_ficha = ${id_ficha}`, `anyo = ${anyo}`])
      .orderBy("fuentesfinanciamiento.id")
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
DB.actualizarDatosLista = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_asignados")
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
DB.eliminarById = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_asignados")
      .where(`(id = ${id})`)
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
DB.ingresarEspecifica = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_analitico")
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
DB.actualizarEspecificaById = ({
  id,
  pia,
  clasificadores_presupuestarios_id,
}) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_analitico")
      .update({ pia, clasificadores_presupuestarios_id })
      .where(`id = ${id}`)
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
DB.actualizarAvanceMensual = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_avancemensual")
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
DB.actualizarCostos = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_costosasignados")
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
DB.eliminarCostosById = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_costosasignados")
      .del()
      .where(`id = ${id}`)
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
DB.eliminarEspecificaById = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_analitico")
      .del()
      .where(`id = ${id}`)
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
DB.guardarVariacionesPim = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("variacionespim").insert(data).toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarVariacionesPim = ({ id, nombre }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("variacionespim")
      .update({ nombre })
      .where(`id = ${id}`)
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
DB.eliminarVariacionesPim = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("variacionespim")
      .del()
      .where(`id = ${id}`)
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
DB.actualizarVariacionesPimMonto = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("variacionespim_monto")
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
module.exports = DB;
