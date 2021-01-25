const DB = {};

DB.obtenerTodos = ({ id_ficha = 0, texto_buscar }) => {
  return new Promise((resolve, reject) => {
    var query = `
            SELECT
                SUM(IF(fichas_has_labels.fichas_id_ficha = ${id_ficha},
                    1,
                    0)) orden,
                fichas_labels.*
            FROM
                fichas_labels
                    LEFT JOIN
                fichas_has_labels ON fichas_has_labels.fichas_labels_id = fichas_labels.id

            `;
    var condiciones = [];
    if (texto_buscar != "" && texto_buscar != undefined) {
      condiciones.push(
        `(fichas_labels.nombre like \'%${texto_buscar}%\' || fichas_labels.descripcion like \'%${texto_buscar}%\')`
      );
    }
    if (condiciones.length > 0) {
      query += " WHERE " + condiciones.join(" AND ");
    }
    query += ` GROUP BY fichas_labels.id
            ORDER BY 1 DESC , fichas_labels.id DESC`;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.crearLabel = (data) => {
  return new Promise((resolve, reject) => {
    pool.query(`INSERT INTO fichas_labels set ?`, data, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerTodosByObra = ({ id_ficha }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        fichas_labels.*
    FROM
        fichas_has_labels
            LEFT JOIN
        fichas_labels ON fichas_labels.id = fichas_has_labels.fichas_labels_id
    WHERE
        fichas_id_ficha = ${id_ficha}
    `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerCantidadByObra = ({ id_ficha, id_label }) => {
  return new Promise((resolve, reject) => {
    var query = `
    SELECT
        count(*) cantidad
    FROM
        fichas_has_labels
    WHERE
        fichas_id_ficha = ${id_ficha}
        AND fichas_labels_id = ${id_label};
    `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.agregarLabelObra = ({ id_ficha, id_label }) => {
  return new Promise((resolve, reject) => {
    var query = `
    INSERT INTO fichas_has_labels (fichas_id_ficha, fichas_labels_id)
    VALUES (${id_ficha}, ${id_label})
    on duplicate key update
    fichas_id_ficha=values(fichas_id_ficha),
    fichas_labels_id=values(fichas_labels_id)
    `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.quitarLabelObra = ({ id_ficha, id_label }) => {
  return new Promise((resolve, reject) => {
    var query = `
      DELETE FROM fichas_has_labels
      WHERE
          fichas_id_ficha = ${id_ficha}
          AND fichas_labels_id = ${id_label};
    `;
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};
module.exports = DB;
