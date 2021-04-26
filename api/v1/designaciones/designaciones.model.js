const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};

DB.obtenerTodosByCargo = ({ id_ficha, id_cargo }) => {
  return new Promise((resolve, reject) => {
    var query = `
            SELECT
                designaciones.id,
                accesos.apellido_paterno,
                accesos.apellido_materno,
                accesos.nombre,
                DATE_FORMAT(fecha_inicio, '%Y-%m-%d') fecha_inicio,
                DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final,
                designaciones.memorandum,
                habilitado,
                celular,
                dni,
                direccion,
                cpt,
                email,
                cargos.nombre cargo_nombre
            FROM
                accesos
                    LEFT JOIN
                fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
                    INNER JOIN
                designaciones ON designaciones.fichas_has_accesos_id = fichas_has_accesos.id
                      LEFT JOIN
                cargos ON cargos.id_Cargo = fichas_has_accesos.cargos_id_Cargo
            WHERE
                Fichas_id_ficha = ${id_ficha}
                    AND Cargos_id_Cargo = ${id_cargo}
            ORDER BY fecha_inicio DESC

            `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarById = ({ id, fecha_inicio, fecha_final, tipoUndefined }) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("designaciones")
      .update({
        fecha_inicio,
        fecha_final,
      })
      .where(`id = ${id}`)
      .tipoNull(tipoUndefined)
      .toString();
    // resolve(query);
    // return;
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.actualizarMemorandumById = ({ id, memorandum }) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.update(
      "designaciones",
      {
        memorandum,
      },
      [`id = ${id}`]
    );
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.guardarDesignacion = (data) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.insert("designaciones", data);
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
module.exports = DB;
