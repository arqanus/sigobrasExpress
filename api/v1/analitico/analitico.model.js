const BaseModel = require("../../libs/baseModel");
const DB = {};

DB.obtenerResumen = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = `
             SELECT
                presupuesto_analitico_resumen.id,
                presupuesto_analitico_resumen.nombre,
                presupuesto_analitico_resumen.fichas_id_ficha,
                analitico_resumen_avanceanual.presupuesto_aprobado presupuesto_aprobado_anterior,
                analitico_resumen_avanceanual.financiero_ejecutado financiero_ejecutado_anterior,
                analitico_actual.pim pim_actual,`;
    for (let i = 1; i <= 12; i++) {
      query += ` SUM(IF(analitico_resumen_avancemensual.mes = ${i},
                    analitico_resumen_avancemensual.financiero_programado_monto,
                    0)) financiero_programado_monto_mes${i},
                SUM(IF(analitico_resumen_avancemensual.mes = ${i},
                    analitico_resumen_avancemensual.financiero_monto,
                    0)) financiero_monto_mes${i},`;
    }
    query = query.slice(0, -1);

    query += `
              FROM
                presupuesto_analitico_resumen
                    LEFT JOIN
                analitico_resumen_avanceanual ON analitico_resumen_avanceanual.presupuesto_analitico_resumen_id = presupuesto_analitico_resumen.id
                    AND analitico_resumen_avanceanual.anyo = ${anyo - 1}
                    LEFT JOIN
                analitico_resumen_avanceanual analitico_actual ON analitico_actual.presupuesto_analitico_resumen_id = presupuesto_analitico_resumen.id
                    AND analitico_actual.anyo = ${anyo}
                    LEFT JOIN
                analitico_resumen_avancemensual ON analitico_resumen_avancemensual.presupuesto_analitico_resumen_id = presupuesto_analitico_resumen.id
                    AND analitico_resumen_avancemensual.anyo = ${anyo}
              WHERE
                fichas_id_ficha = ${id_ficha}
              GROUP BY presupuesto_analitico_resumen.id
            `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarResumen = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.updateOnDuplicateKey(
      "presupuesto_analitico_resumen",
      data
    );
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.eliminarResumen = ({ id }) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.delete("presupuesto_analitico_resumen", [
      `id = ${id}`,
    ]);
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarResumenAnual = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.updateOnDuplicateKey(
      "analitico_resumen_avanceanual",
      data
    );
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarResumenMensual = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.updateOnDuplicateKey(
      "analitico_resumen_avancemensual",
      data
    );
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
