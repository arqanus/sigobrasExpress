const DB = {};

DB.obtenerTodos = ({ id_ficha, anyo }) => {
  return new Promise((resolve, reject) => {
    var query = `
            SELECT
                *
            FROM
                datos_anuales
            WHERE
                fichas_id_ficha = ${id_ficha}
                AND anyo = ${anyo}
            `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.actualizarPresupuesto = ({ id, anyo, pim, pia, presupuesto_aprobado }) => {
  return new Promise((resolve, reject) => {
    var query = `
      INSERT INTO datos_anuales (fichas_id_ficha,anyo, `;
    if (pia) query += `pia,`;
    if (pim) query += `pim,`;
    if (presupuesto_aprobado) query += `presupuesto_aprobado,`;
    query = query.slice(0, -1);
    query += `)
      VALUES (${id},${anyo},
        `;
    if (pia) query += pia + ",";
    if (pim) query += pim + ",";
    if (presupuesto_aprobado) query += presupuesto_aprobado + ",";
    query = query.slice(0, -1);
    query += `
    )
      on duplicate key update `;
    if (pia) query += `pia=values(pia),`;
    if (pim) query += `pim=values(pim),`;
    if (presupuesto_aprobado)
      query += `presupuesto_aprobado=values(presupuesto_aprobado),`;
    query = query.slice(0, -1);
    // resolve(query);
    // return;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
module.exports = DB;
