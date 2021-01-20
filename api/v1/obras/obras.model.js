const DB = {};
DB.obtenerTodosPublico = ({ id_unidadEjecutora, idsectores }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
      fichas.*,
      unidadejecutoras.nombre unidad_ejecutora_nombre,
      sectores.nombre sector_nombre
    FROM
      fichas
    LEFT JOIN
      unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
    LEFT JOIN
      sectores ON sectores.idsectores = fichas.sectores_idsectores
    WHERE
      estado_publico
    `;
    var condiciones = [];
    if (id_unidadEjecutora != 0 && id_unidadEjecutora != undefined) {
      condiciones.push(`(id_unidadEjecutora = ${id_unidadEjecutora})`);
    }
    if (idsectores != 0 && idsectores != undefined) {
      condiciones.push(`(idsectores = ${idsectores})`);
    }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += `
    ORDER BY unidadejecutoras.poblacion desc , sectores_idsectores
    `;
    // resolve(query);
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
