let userModel = {};
userModel.ultimoEstadoObra = (id_ficha, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query(
        "select  historialestados.id_historialEstado,historialestados.Estados_id_Estado,estados.nombre from historialestados left join estados on estados.id_Estado = historialestados.Estados_id_Estado where historialestados.Fichas_id_ficha =? order by historialestados.id_historialEstado desc limit 1",
        id_ficha,
        (error, res) => {
          if (error) {
            callback(error);
          } else if (res.length == 0) {
            console.log("vacio");
            callback("vacio");
            conn.destroy();
          } else {
            console.log("res", res);
            callback(null, res[0]);
            conn.destroy();
          }
        }
      );
    }
  });
};
userModel.postHistorialEstados = (id_ficha, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query(
        "Insert into historialestados set ?",
        id_ficha,
        (error, res) => {
          if (error) {
            callback(error);
          } else if (res.length == 0) {
            console.log("vacio");
            callback("vacio");
            conn.destroy();
          } else {
            console.log("res", res);
            callback(null, res.insertId);
            conn.destroy();
          }
        }
      );
    }
  });
};
userModel.getestadoIdHistorialEstados = (id_historial, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      console.log("get estado");

      conn.query(
        "select nombre from historialestados left join estados on estados.id_Estado = historialestados.Estados_id_Estado where historialestados.id_historialEstado = ?",
        id_historial,
        (error, res) => {
          if (error) {
            console.log(error);

            callback(error.code);
          } else {
            console.log("res", res);
            callback(null, res[0]);
            conn.destroy();
          }
        }
      );
    }
  });
};
userModel.postHistorialEstadosObra = (data, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query(
        "INSERT INTO historialestados (id_historialEstado,fichas_id_ficha,fecha_inicial,fecha_final,estados_id_estado) VALUES ? ON DUPLICATE key UPDATE fecha_inicial = VALUES(fecha_inicial),fecha_final = VALUES(fecha_final),estados_id_estado = VALUES(estados_id_estado)",
        [data],
        (error, res) => {
          if (error) {
            console.log(error);
            callback(error.code);
            conn.destroy();
          } else {
            console.log("res", res);
            callback(null, res);
            conn.destroy();
          }
        }
      );
    }
  });
};
userModel.postFecha_finalHistorialEstados = (id_historialEstado, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query(
        "update historialestados set fecha_final = now() where id_historialEstado = ?",
        [id_historialEstado],
        (error, res) => {
          if (error) {
            console.log(error);
            callback(error.code);
            conn.destroy();
          } else {
            // console.log("res",res);
            callback(null, res);
            conn.destroy();
          }
        }
      );
    }
  });
};

module.exports = userModel;
