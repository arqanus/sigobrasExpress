let userModel = {};
userModel.postcronogramamensual = (data, callback) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO cronogramamensual (fichas_id_ficha,mes,programado, financieroEjecutado) VALUES ? ON DUPLICATE key UPDATE financieroEjecutado = VALUES(financieroEjecutado) ,programado = VALUES(programado) ",
      [data],
      (error, res) => {
        if (error) {
          reject(error.code);
        } else {
          resolve(res);
        }
      }
    );
  });
};

userModel.postFinancieroCorte = (monto, id_historialEstado) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "update historialEstados set monto =? where id_historialEstado=?",
      [monto, id_historialEstado],
      (error, res) => {
        if (error) {
          reject(error.code);
        } else {
          resolve(res);
        }
      }
    );
  });
};

module.exports = userModel;
