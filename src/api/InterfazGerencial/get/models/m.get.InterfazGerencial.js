const pool = require('../../../../db/connection');

module.exports = {
  getProvincias() {
    return new Promise((resolve, reject) => {
      pool.query("select * from unidadejecutoras where nivel =2;", [], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  getSectores() {
    return new Promise((resolve, reject) => {
      pool.query("select * from sectores;", [], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  getModalidadesEjecutoras() {
    return new Promise((resolve, reject) => {
      pool.query("select * from modalidad_ejecutora;", [], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  getEstados() {
    return new Promise((resolve, reject) => {
      pool.query("select * from  estados;", [], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  getInterfazGerencialData(unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, modalidad_ejecutora, Estados_id_Estado) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT fichas.codigo, unidadejecutoras.nombre unidad_ejecutora_nombre, sectores.nombre sector_nombre, modalidad_ejecutora.nombre modalidad_ejecutora_nombre, estado.nombre estado_nombre, fichas.fecha_inicial FROM fichas LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo, historialestados.Estados_id_Estado FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora LEFT JOIN sectores ON sectores.idsectores = fichas.sectores_idsectores LEFT JOIN modalidad_ejecutora ON modalidad_ejecutora.idmodalidad_ejecutora = fichas.modalidad_ejecutora WHERE ((0 = ?) OR fichas.unidadEjecutoras_id_unidadEjecutora = ?) AND ((0 = ?) OR sectores_idsectores = ?) AND ((0 = ?) OR modalidad_ejecutora = ?) AND ((0 = ?) OR Estados_id_Estado = ?) GROUP BY fichas.unidadEjecutoras_id_unidadEjecutora , sectores_idsectores,id_ficha", [unidadEjecutoras_id_unidadEjecutora, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, sectores_idsectores, modalidad_ejecutora, modalidad_ejecutora, Estados_id_Estado, Estados_id_Estado], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
}

