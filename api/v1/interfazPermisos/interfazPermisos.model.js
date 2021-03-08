const BaseModel = require("../../libs/baseModel");
const queryBuilder = require("../../libs/queryBuilder");
const DB = {};
DB.obtenerDatos = ({ id_cargos }) => {
  return new Promise((resolve, reject) => {
    var cargos = [];
    var cargosColumnas = [];
    if (id_cargos != "") {
      cargos = id_cargos.split(",");
    }
    for (let index = 0; index < cargos.length; index++) {
      const cargo = cargos[index];
      cargosColumnas.push(
        `sum(IF(cargos_id_cargo = ${cargo},activo,0)) cargo_${cargo}`
      );
    }
    var query = new queryBuilder()
      .select(
        [
          [" interfaz_principales.nombre ", "interfaz_nombre"],
          "interfaz_secundarias.id",
          ["interfaz_secundarias.nombre ", "funcionalidad_nombre"],
          "interfaz_secundarias.nombre_clave",
        ].concat(cargosColumnas)
      )
      .from("interfaz_principales")
      .leftJoin(
        `interfaz_secundarias ON interfaz_secundarias.interfaz_principales_id = interfaz_principales.id
        LEFT JOIN
    interfaz_permisocargo ON interfaz_permisocargo.interfaz_secundarias_id = interfaz_secundarias.id`
      )
      .groupBy("interfaz_secundarias.id")
      .orderBy("interfaz_principales.id,interfaz_secundarias.id")
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
DB.actualizarDatos = (data) => {
  return new Promise((resolve, reject) => {
    var query = new queryBuilder("interfaz_permisocargo")
      .insert(data)
      .merge()
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
DB.obtenerPermisoInterfaz = ({ id_ficha, id_acceso, nombres_clave }) => {
  return new Promise((resolve, reject) => {
    var nombres_claveList = nombres_clave.split(",");
    var nombres_claveProcesada = [];
    for (let index = 0; index < nombres_claveList.length; index++) {
      const nombre_clave = nombres_claveList[index];
      nombres_claveProcesada.push(
        `sum(if(nombre_clave='${nombre_clave}',activo,0) ) ${nombre_clave}`
      );
    }
    var query = new queryBuilder("fichas_has_accesos")
      .select(nombres_claveProcesada)
      .leftJoin(
        `interfaz_permisocargo ON interfaz_permisocargo.cargos_id_Cargo = fichas_has_accesos.cargos_id_Cargo
            inner JOIN
        interfaz_secundarias ON interfaz_secundarias.id = interfaz_secundarias_id`
      )
      .where([
        `Fichas_id_ficha = ${id_ficha}`,
        `Accesos_id_acceso = ${id_acceso}`,
      ])
      .toString();
    pool.query(query, (error, res) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(res ? res[0] : {});
    });
  });
};
module.exports = DB;
