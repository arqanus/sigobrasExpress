const DB = {};
DB.avanceObra = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        SUM(avanceactividades.valor * partidas.costo_unitario) avance
    FROM
        componentes
            LEFT JOIN
        partidas ON partidas.componentes_id_componente = componentes.id_componente
            LEFT JOIN
        actividades ON actividades.Partidas_id_partida = partidas.id_partida
            LEFT JOIN
        avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    WHERE
        componentes.fichas_id_ficha = ${id_ficha}
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
