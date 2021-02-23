const DB = {};

DB.obtenerTodos = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = `
              SELECT
                  plazos_tipo.nombre tipo_nombre,
                  descripcion,
                  DATE_FORMAT(fecha_inicio, '%Y-%m-%d') fecha_inicial,
                  DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final,
                  n_dias,
                  DATE_FORMAT(fecha_aprobada, '%Y-%m-%d') fecha_aprobada,
                  plazos_historial.documento_resolucion_estado,
                  archivo,
                  plazo_aprobado
              FROM
                  plazos_historial
                      LEFT JOIN
                  plazos_tipo ON plazos_tipo.idplazos_tipo = plazos_historial.tipo
              WHERE
                  plazos_historial.nivel = 1
                      AND fichas_id_ficha = ${id_ficha}
              ORDER BY plazos_historial.fecha_inicio
            `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
module.exports = DB;
