const DB = {};
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
module.exports = DB;
