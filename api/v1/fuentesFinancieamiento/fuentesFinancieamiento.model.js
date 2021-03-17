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
DB.obtenerTodosCostos = ({ id, anyo }) => {
  return new Promise((resolve, reject) => {
    var avanceMensual = [];
    for (let mes = 1; mes <= 12; mes++) {
      avanceMensual.push(
        `SUM(IF(fuentesfinanciamiento_avancemensual.anyo = ${anyo}
            AND fuentesfinanciamiento_avancemensual.mes = ${mes},
        fuentesfinanciamiento_avancemensual.monto,
        0)) avanceMensual_${mes}`
      );
      avanceMensual.push(
        `SUM(IF(fuentesfinanciamiento_avancemensual.anyo = ${anyo}
            AND fuentesfinanciamiento_avancemensual.mes = ${mes},
        fuentesfinanciamiento_avancemensual.programado,
        0)) programadoMensual_${mes}`
      );
    }
    var query = new queryBuilder("fuentesfinanciamiento_analitico")

      .select(
        [
          "fuentesfinanciamiento_costoasignado.id",
          ["fuentesfinanciamiento_analitico.id", "id_analitico"],
          " presupuestoanalitico_costos.nombre",
          ["presupuestoanalitico_costos.id", "id_costo"],
        ].concat(avanceMensual)
      )
      .innerJoin(
        `fuentesfinanciamiento_costoasignado ON fuentesfinanciamiento_costoasignado.fuentesfinanciamiento_analitico_id = fuentesfinanciamiento_analitico.id
            LEFT JOIN
        presupuestoanalitico_costos ON presupuestoanalitico_costos.id = fuentesfinanciamiento_costoasignado.presupuestoanalitico_costos_id
            LEFT JOIN
        fuentesfinanciamiento_avancemensual ON fuentesfinanciamiento_avancemensual.fuentesfinanciamiento_costoasignado_id = fuentesfinanciamiento_costoasignado.id`
      )
      .where(
        `fuentesfinanciamiento_analitico.fuentesfinanciamiento_asignados_id = ${id}`
      )
      .groupBy("fuentesfinanciamiento_costoasignado.id")
      .orderBy("fuentesfinanciamiento_costoasignado.id")
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
DB.obtenerTodosEspecificas = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_analitico")
      .select([
        "fuentesfinanciamiento_analitico.id",
        ["clasificadores_presupuestarios.id", "id_clasificador"],
        "clasificador",
        "descripcion",
        "fuentesfinanciamiento_analitico.pia",
      ])
      .leftJoin(
        `clasificadores_presupuestarios ON clasificadores_presupuestarios.id = fuentesfinanciamiento_analitico.clasificadores_presupuestarios_id`
      )
      .where(
        `fuentesfinanciamiento_analitico.fuentesfinanciamiento_asignados_id = ${id}`
      )
      .groupBy("fuentesfinanciamiento_analitico.id")
      .orderBy(
        "clasificadores_presupuestarios_id,fuentesfinanciamiento_analitico.id"
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
DB.obtenerTodosEspecificasVariacionesPim = ({ id, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("variacionespim")
      .where([`fuentesfinanciamiento_asignados_id = ${id}`, `anyo = ${anyo}`])
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
    var query = new queryBuilder("fuentesfinanciamiento_analitico")
      .select(
        [["fuentesfinanciamiento_analitico.id", "id_fuentevariacion"]].concat(
          cols
        )
      )
      .leftJoin(
        ` variacionespim_monto ON variacionespim_monto.fuentesfinanciamiento_analitico_id = fuentesfinanciamiento_analitico.id`
      )
      .where(
        `fuentesfinanciamiento_analitico.fuentesfinanciamiento_asignados_id = ${id}`
      )
      .groupBy("fuentesfinanciamiento_analitico.id")
      .orderBy(
        "clasificadores_presupuestarios_id,fuentesfinanciamiento_analitico.id"
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
//costos
DB.actualizarCostos = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_costoasignado")
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
    var query = new queryBuilder("fuentesfinanciamiento_costoasignado")
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
DB.asignarCosto = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_costoasignado")
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
DB.getDataParaActualizarAvanceMensual = ({
  fuentesfinanciamiento_costoasignado_id,
}) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("fuentesfinanciamiento_asignados")
      .select([
        "fuentesfinanciamiento_asignados.fichas_id_ficha",
        "fuentesfinanciamiento_costoasignado.presupuestoanalitico_costos_id",
        "fuentesfinanciamiento_analitico.clasificadores_presupuestarios_id",
      ])
      .leftJoin(
        `fuentesfinanciamiento_analitico ON fuentesfinanciamiento_analitico.fuentesfinanciamiento_asignados_id = fuentesfinanciamiento_asignados.id
        INNER JOIN
    fuentesfinanciamiento_costoasignado ON fuentesfinanciamiento_costoasignado.fuentesfinanciamiento_analitico_id = fuentesfinanciamiento_analitico.id`
      )
      .where(
        `fuentesfinanciamiento_costoasignado.id = ${fuentesfinanciamiento_costoasignado_id}`
      )
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.getMontoParaActualizarAvanceMensual = ({
  id_ficha,
  anyo,
  id_costo,
  id_clasificador,
  mes,
}) => {
  return new Promise((resolve, reject) => {
    console.log("data entrante", {
      id_ficha,
      anyo,
      id_costo,
      id_clasificador,
      mes,
    });
    var query = new queryBuilder("fuentesfinanciamiento_asignados")
      .select([[" SUM(fuentesfinanciamiento_avancemensual.monto) ", "avance"]])
      .leftJoin(
        `fuentesfinanciamiento_analitico ON fuentesfinanciamiento_analitico.fuentesfinanciamiento_asignados_id = fuentesfinanciamiento_asignados.id
        INNER JOIN
    fuentesfinanciamiento_costoasignado ON fuentesfinanciamiento_costoasignado.fuentesfinanciamiento_analitico_id = fuentesfinanciamiento_analitico.id
        LEFT JOIN
    fuentesfinanciamiento_avancemensual ON fuentesfinanciamiento_avancemensual.fuentesfinanciamiento_costoasignado_id = fuentesfinanciamiento_costoasignado.id`
      )
      .where([
        `fichas_id_ficha = ${id_ficha}`,
        `fuentesfinanciamiento_avancemensual.anyo = ${anyo}`,
        `presupuestoanalitico_costos_id = ${id_costo}`,
        `clasificadores_presupuestarios_id = ${id_clasificador}`,
        `mes = ${mes}`,
      ])
      .toString();
    // resolve(query);
    // return;
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
module.exports = DB;
