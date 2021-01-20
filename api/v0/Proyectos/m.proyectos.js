module.exports = {
  getProyectos() {
    return new Promise((resolve, reject) => {
      var query = `
            select proyectos.*, DATE_FORMAT(viabilizacion, '%Y-%m-%d') viabilizacion from proyectos
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getProyectosMeta({ proyectos_id, anyo }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                *
            FROM
                proyectos_meta
            WHERE
                proyectos_id = ${proyectos_id} AND anyo = ${anyo};
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res ? res[0] : {});
      });
    });
  },
  getProyectoUsuario({ proyectos_id }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                proyectos_usuarios.*, proyectos_cargos.nombre cargo_nombre
            FROM
                proyectos_asignados
                    LEFT JOIN
                proyectos_usuarios ON proyectos_usuarios.id = proyectos_asignados.proyectos_usuarios_id
                    LEFT JOIN
                proyectos_cargos ON proyectos_cargos.id = proyectos_asignados.proyectos_cargos_id
            WHERE
                proyectos_id = ${proyectos_id}
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getProyectoPlanTrabajo({ proyectos_id }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                *
            FROM
                proyectos_plantrabajo
            WHERE
                proyectos_id = ${proyectos_id}
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res ? res[0] : {});
      });
    });
  },
  getProyectoPlanTrabajoRecursos({ proyectos_plantrabajo_id }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                *
            FROM
                proyectos_plantrabajo_recursos
            WHERE
                proyectos_plantrabajo_id = ${proyectos_plantrabajo_id}
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getProyectoPlazos({ proyectos_id }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                proyectos_plazos.*,
                DATE_FORMAT(fecha_inicial, '%Y-%m-%d') fecha_inicial,
                DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final,
                proyectos_plazos_tipos.nombre tipo_nombre
            FROM
                proyectos_plazos
                    LEFT JOIN
                proyectos_plazos_tipos ON proyectos_plazos_tipos.id = proyectos_plazos.proyectos_plazos_tipos_id
            WHERE
                proyectos_id = ${proyectos_id}
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getProyectoAvanceFisico({ proyectos_id, anyo }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                *
            FROM
                proyectos_avancefisico
            WHERE
                proyectos_id = ${proyectos_id} AND anyo = ${anyo}
            `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getProyectoEjecucionPresupuestal({ proyectos_id, anyo }) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                *
            FROM
                proyectos_ejecucionpresupuestal
            WHERE
                proyectos_id = ${proyectos_id} AND anyo = ${anyo}
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
