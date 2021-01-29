const DB = {};

DB.obtenerByComponente = ({
  id_componente,
  offset = 0,
  limit,
  id_prioridad,
  id_iconoCategoria,
  texto_buscar,
}) => {
  return new Promise((resolve, reject) => {
    var query = `SELECT * FROM partidas`;
    var condiciones = [];
    if (id_componente != 0 && id_componente != undefined) {
      condiciones.push(`(componentes_id_componente = ${id_componente})`);
    }
    if (id_prioridad != 0 && id_prioridad != undefined) {
      condiciones.push(`(partidas.prioridades_id_prioridad = ${id_prioridad})`);
    }
    if (id_iconoCategoria != 0 && id_iconoCategoria != undefined) {
      condiciones.push(
        `(partidas.iconosCategorias_id_iconoCategoria =  ${id_iconoCategoria})`
      );
    }
    if (texto_buscar != "" && texto_buscar != undefined) {
      condiciones.push(
        `(partidas.item like \'%${texto_buscar}%\' || partidas.descripcion like \'%${texto_buscar}%\')`
      );
    }
    if (condiciones.length > 0) {
      query += " WHERE " + condiciones.join(" AND ");
    }
    query += ` LIMIT ${offset} , ${limit}`;

    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res);
    });
  });
};
DB.obtenerTotalPartidas = ({
  id_componente,
  id_prioridad,
  id_iconoCategoria,
  texto_buscar,
}) => {
  var query = `SELECT COUNT(partidas.id_partida) total FROM partidas `;
  var condiciones = [];
  if (id_componente != 0 && id_componente != undefined) {
    condiciones.push(`(componentes_id_componente = ${id_componente})`);
  }
  if (id_prioridad != 0 && id_prioridad != undefined) {
    condiciones.push(`(partidas.prioridades_id_prioridad = ${id_prioridad})`);
  }
  if (id_iconoCategoria != 0 && id_iconoCategoria != undefined) {
    condiciones.push(
      `(partidas.iconosCategorias_id_iconoCategoria =  ${id_iconoCategoria})`
    );
  }
  if (texto_buscar != "" && texto_buscar != undefined) {
    condiciones.push(
      `(partidas.item like \'%${texto_buscar}%\' || partidas.descripcion like \'%${texto_buscar}%\')`
    );
  }
  if (condiciones.length > 0) {
    query += " WHERE " + condiciones.join(" AND ");
  }
  return new Promise((resolve, reject) => {
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
DB.obtenerById = ({ id }) => {
  var query = `SELECT * FROM partidas WHERE id_partida = ${id}`;
  return new Promise((resolve, reject) => {
    pool.query(query, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
module.exports = DB;
