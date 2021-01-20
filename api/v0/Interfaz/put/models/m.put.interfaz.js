let userModel = {};
userModel.putUserImagen = (id_usuario, imagen, callback) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "update usuarios set usuarios.imagen = ?,usuarios.imagenAlt = ? where usuarios.id_usuario = ?",
      [imagen, id_usuario, id_usuario],
      (error, res) => {
        if (error) {
          reject(error);
        } else if (res.length == 0) {
          reject("vacio");
        } else {
          resolve(res.affectedRows);
        }
      }
    );
  });
};
module.exports = userModel;
