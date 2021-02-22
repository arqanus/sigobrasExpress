const BaseModel = require("../../libs/baseModel");
const DB = {};

DB.obtenerTodosByCargo = ({ id_ficha, id_cargo }) => {
  return new Promise((resolve, reject) => {
    var query = `
            SELECT
                designaciones.id,
                CONCAT(accesos.apellido_paterno,
                        ' ',
                        accesos.apellido_materno,
                        ' ',
                        accesos.nombre) nombre,
                DATE_FORMAT(fecha_inicio, '%Y-%m-%d') fecha_inicio,
                DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final,
                designaciones.memorandum,
                habilitado
            FROM
                accesos
                    LEFT JOIN
                fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
                    INNER JOIN
                designaciones ON designaciones.fichas_has_accesos_id = fichas_has_accesos.id
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
DB.actualizarById = ({
  id,
  tipoUndefined = false,
  fecha_inicio,
  fecha_final,
  memorandum,
}) => {
  return new Promise((resolve, reject) => {
    var query = BaseModel.update(
      "designaciones",
      {
        fecha_inicio,
        fecha_final,
        memorandum,
      },
      [`id = ${id}`],
      tipoUndefined
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
