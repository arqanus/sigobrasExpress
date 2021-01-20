module.exports = {
  getDificultades(if_ficha, tipo) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT dificultades.*, DATE_FORMAT(fecha_registro, '%Y-%m-%d') fecha_registro,DATE_FORMAT(fecha_inicio, '%Y-%m-%d') fecha_inicio, DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final FROM dificultades WHERE fichas_id_ficha = ? AND tipo = ?",
        [if_ficha, tipo],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  postDificultades(data) {
    return new Promise((resolve, reject) => {
      pool.query(
        " INSERT INTO dificultades (descripcion, fecha_inicio, fecha_final, duracion, duracion_tipo, fichas_id_ficha, tipo, autor, cargo,asiento_obra) VALUES (?,?,?,?,?,?,?,?,?,?);",
        [
          data.descripcion,
          data.fecha_inicio,
          data.fecha_final,
          data.duracion,
          data.duracion_tipo,
          data.fichas_id_ficha,
          data.tipo,
          data.autor,
          data.cargo,
          data.asiento_obra,
        ],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  //consultas
  getConsultas(if_ficha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT dificultades.*,DATE_FORMAT(fecha_registro, '%Y-%m-%d') fecha_registro, DATE_FORMAT(fecha_inicio, '%Y-%m-%d') fecha_inicio, DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final FROM dificultades WHERE fichas_id_ficha = ? AND tipo = 'CONSULTA'",
        [if_ficha],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  postConsultaResidente(data) {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO consultas ( id, fecha,residente_descripcion,fichas_id_ficha) VALUES (?,?,?,?) ON DUPLICATE key UPDATE fecha = VALUES(fecha), residente_descripcion = VALUES(residente_descripcion)",
        [data.id, data.fecha, data.residente_descripcion, data.fichas_id_ficha],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  //observaciones
  getObservaciones(if_ficha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT dificultades.*,DATE_FORMAT(fecha_registro, '%Y-%m-%d') fecha_registro, DATE_FORMAT(fecha_inicio, '%Y-%m-%d') fecha_inicio, DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final FROM dificultades WHERE fichas_id_ficha = ? AND tipo = 'OBSERVACION'",
        [if_ficha],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  getObservacionesHabilitado(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT habilitado FROM observaciones WHERE id = ?;",
        [id],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res[0]);
        }
      );
    });
  },
  postObservacionesResidente(data) {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO observaciones ( id, autor,cargo,fecha,descripcion,fichas_id_ficha) VALUES (?,?,?,?,?,?) ON DUPLICATE key UPDATE autor = VALUES(autor), cargo = VALUES(cargo),fecha=values(fecha),descripcion=values(descripcion)",
        [
          data.id,
          data.autor,
          data.cargo,
          data.fecha,
          data.descripcion,
          data.fichas_id_ficha,
        ],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  postObservacionesSupervisor(data, habilitado) {
    console.log("habilitado", habilitado);
    return new Promise((resolve, reject) => {
      pool.query(
        "update observaciones set respuesta = ?,respuesta_fecha = ?,respuesta_autor = ?,habilitado = ? where id = ?",
        [
          data.respuesta,
          data.respuesta_fecha,
          data.respuesta_autor,
          false,
          data.id,
        ],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  getDificultadesComentarios(dificultades_id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT DATE_FORMAT(dificultades_comentarios.fecha_registro, '%d-%m-%Y %H:%i') fecha_registro, comentario, cargos.nombre cargo_nombre, '' cargo_imagen, usuarios.nombre usuario_nombre FROM dificultades_comentarios LEFT JOIN accesos ON accesos.id_acceso = dificultades_comentarios.accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario WHERE dificultades_id = ?;",
        [dificultades_id],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  postDificultadesComentarios(comentario, dificultades_id, accesos_id_acceso) {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO dificultades_comentarios (comentario, dificultades_id, accesos_id_acceso) VALUES (?,?,?);",
        [comentario, dificultades_id, accesos_id_acceso],
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  getDificultadesComentariosNoVistos(id_acceso, id_dificultad) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT dificultades_comentarios.* FROM dificultades_comentarios LEFT JOIN dificultades_comentarios_visto ON dificultades_comentarios_visto.dificultades_comentarios_id = dificultades_comentarios.id AND dificultades_comentarios_visto.accesos_id_acceso = ? WHERE dificultades_comentarios.dificultades_id = ? AND dificultades_comentarios_visto.id IS NULL;",
        [id_acceso, id_dificultad],
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  postDificultadesComentariosVistos(data) {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO dificultades_comentarios_visto(accesos_id_acceso, dificultades_comentarios_id) VALUES ?;",
        [data],
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
  getDificultadesComentariosNoVistosFicha(id_acceso, id_ficha, tipo) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT dificultades.id, SUM(IF(dificultades_comentarios_mod.id IS NOT NULL, 1, 0)) mensajes FROM dificultades LEFT JOIN (SELECT dificultades_comentarios.* FROM dificultades_comentarios LEFT JOIN dificultades_comentarios_visto ON dificultades_comentarios_visto.dificultades_comentarios_id = dificultades_comentarios.id AND dificultades_comentarios_visto.accesos_id_acceso = ? WHERE dificultades_comentarios_visto.id IS NULL) dificultades_comentarios_mod ON dificultades_comentarios_mod.dificultades_id = dificultades.id WHERE dificultades.fichas_id_ficha = ? and dificultades.tipo = ? GROUP BY dificultades.id;",
        [id_acceso, id_ficha, tipo],
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  },
};
