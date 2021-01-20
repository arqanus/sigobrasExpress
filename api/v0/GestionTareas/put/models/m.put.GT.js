let userModel = {};

userModel.putSubtareaAvance = (terminado, id_subtarea) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "update subtareas set terminado = ? where id_subtarea = ?",
      [terminado, id_subtarea],
      (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res.affectedRows);
      }
    );
  });
};

module.exports = userModel;
