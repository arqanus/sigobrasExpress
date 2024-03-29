let userModel = {};

userModel.putMenusUsuarios = (data, callback) => {
  pool.query("update accesos set menu = ?", data, (error, res) => {
    if (error) {
      callback(error);
    } else {
      console.log("affectedRows", res.affectedRows);
      callback(null, res.affectedRows);
    }
  });
};
userModel.putactualizarUsuario = (usuarios) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE usuarios set nombre=?, apellido_paterno=?,apellido_materno=?,dni=?,direccion=?,email=?,celular=?,cpt=? where id_usuario = ?",
      [
        usuarios.nombre,
        usuarios.apellido_paterno,
        usuarios.apellido_materno,
        usuarios.dni,
        usuarios.direccion,
        usuarios.email,
        usuarios.celular,
        usuarios.cpt,
        usuarios.id_usuario,
      ],
      (error, res) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      }
    );
  });
};

userModel.putMenuUsuarioUnico = (menu, id_acceso) => {
  return new Promise((resolve, reject) => {
    var query = "update accesos set menu = ? where id_acceso = ?";
    pool.query(query, [menu, id_acceso], (error, resultado) => {
      if (error) {
        reject(error);
      } else {
        resolve(resultado);
      }
    });
  });
};

module.exports = userModel;
