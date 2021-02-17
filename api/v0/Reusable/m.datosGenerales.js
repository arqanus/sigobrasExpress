module.exports = {
  getDatosGenerales2(id_ficha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT fichas.*,DATE_FORMAT(fecha_inicial, '%Y-%m-%d') fecha_inicial,DATE_FORMAT(resolucion_fecha, '%Y-%m-%d') resolucion_fecha FROM fichas WHERE fichas.id_ficha = ?",
        [id_ficha],
        (error, res) => {
          if (error) {
            reject(error.code);
          }
          resolve(res && res[0]);
        }
      );
    });
  },
  getPresupuestoCostoDirecto(id_ficha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT sum(componentes.presupuesto) monto FROM componentes WHERE componentes.fichas_id_ficha = ?",
        [id_ficha],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
  getEstadoObra(id_ficha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT estados.* FROM historialestados LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado WHERE Fichas_id_ficha = ? AND fecha_inicial = (SELECT MAX(fecha_inicial) FROM historialestados WHERE Fichas_id_ficha = ?)",
        [id_ficha, id_ficha],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
  getDatosUsuario({ id_acceso, id_ficha }) {
    return new Promise((resolve, reject) => {
      var query = `
      SELECT
          cargos.nombre cargo_nombre, accesos.nombre usuario_nombre
      FROM
          accesos
              LEFT JOIN
          fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
              LEFT JOIN
          cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
      WHERE
          id_acceso = ${id_acceso} AND Fichas_id_ficha = ${id_ficha}
      `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res ? res[0] : {});
      });
    });
  },
};
