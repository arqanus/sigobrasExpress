// let userModel = {};
module.exports = {
  infobras(id_ficha) {
    return new Promise((resolve, reject) => {
      var query =
        "SELECT DATE_FORMAT(fecha_inicial, '%Y-%M-%d') fecha_inicial, g_tipo_act, fichas.codigo, g_meta, g_snip, tiempo_ejec, g_total_presu, SUM(COALESCE(costo_unitario, 0) * COALESCE(avanceactividades.valor, 0)) acumulado_hoy, DATE_FORMAT((MAX(fecha)), '%W %d-%m-%Y') udm FROM fichas LEFT JOIN componentes ON fichas.id_ficha = componentes.fichas_id_ficha LEFT JOIN partidas ON componentes.id_componente = partidas.componentes_id_componente LEFT JOIN actividades ON partidas.id_partida = actividades.Partidas_id_partida LEFT JOIN avanceactividades ON actividades.id_actividad = avanceactividades.Actividades_id_actividad WHERE id_ficha = ? AND avanceactividades.valor IS NOT NULL";
      pool.query(query, [id_ficha], (error, resultado) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultado);
        }
      });
    });
  },
  presupuestoCostoDirecto(id_ficha) {
    return new Promise((resolve, reject) => {
      var query =
        "SELECT SUM(componentes.presupuesto) costo_directo FROM componentes WHERE componentes.fichas_id_ficha = ?";
      pool.query(query, [id_ficha], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res[0]);
        }
      });
    });
  },
};
