// let userModel = {};

module.exports = {
  Comunicados(fecha_inicial, fecha_final, texto) {
    return new Promise((resolve, reject) => {
      var query =
        "INSERT INTO sigobras_db.comunicados (fecha_inicial, fecha_final, texto_mensaje) VALUES (?, ?, ?);";
      pool.query(
        query,
        [fecha_inicial, fecha_final, texto],
        (error, resultado) => {
          if (error) {
            reject(error);
          } else {
            resolve(resultado);
          }
        }
      );
    });
  },

  comunicadoFichas(data) {
    return new Promise((resolve, reject) => {
      var query =
        "INSERT INTO `sigobras_db`.`comunicados_has_fichas` (`fichas_id_ficha`,`comunicados_idcomunicados`) VALUES ?;";
      pool.query(query, [data], (error, resultado) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultado);
        }
      });
    });
  },

  comunicadoInicio(id_ficha) {
    return new Promise((resolve, reject) => {
      var query =
        "select * from comunicados_has_fichas left join comunicados on comunicados.idcomunicados = comunicados_has_fichas.comunicados_idcomunicados where fichas_id_ficha = ? and fecha_inicial <= curdate() and curdate() <= fecha_final";
      pool.query(query, [id_ficha], (error, resultado) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultado);
        }
      });
    });
  },

  obrasListaUser(id_acceso) {
    return new Promise((resolve, reject) => {
      var query =
        "select codigo, id_ficha from fichas_has_accesos left join fichas on fichas.id_ficha = fichas_has_accesos.Fichas_id_ficha where fichas_has_accesos.Accesos_id_acceso = ?";
      pool.query(query, [id_acceso], (error, resultado) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultado);
        }
      });
    });
  },

  listaComunicados(id_acceso) {
    return new Promise((resolve, reject) => {
      var query =
        "select codigo, DATE_FORMAT(comunicados.fecha_inicial,'%Y %m %d') fecha_inicial, DATE_FORMAT(comunicados.fecha_final,'%Y %m %d') fecha_final, texto_mensaje, idcomunicados from fichas_has_accesos left join fichas on fichas.id_ficha = fichas_has_accesos.Fichas_id_ficha left join comunicados_has_fichas on comunicados_has_fichas.fichas_id_ficha = fichas.id_ficha inner join comunicados on comunicados.idcomunicados = comunicados_has_fichas.comunicados_idcomunicados where fichas_has_accesos.Accesos_id_acceso = ?;";
      pool.query(query, [id_acceso], (error, resultado) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultado);
        }
      });
    });
  },

  eliminarComunicados(id_comunicados) {
    return new Promise((resolve, reject) => {
      var query = "delete from comunicados where idcomunicados = ?;";
      pool.query(query, [id_comunicados], (error, resultado) => {
        if (error) {
          reject(error);
        } else {
          resolve(resultado);
        }
      });
    });
  },
};

// module.exports =
