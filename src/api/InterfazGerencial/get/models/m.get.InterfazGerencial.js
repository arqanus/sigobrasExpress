const pool = require('../../../../db/connection');

module.exports = {
  getProvincias(id_acceso) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT unidadejecutoras.* FROM unidadejecutoras LEFT JOIN fichas ON fichas.unidadEjecutoras_id_unidadEjecutora = unidadejecutoras.id_unidadEjecutora LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha WHERE nivel = 2 AND fichas_has_accesos.Accesos_id_acceso = ? GROUP BY unidadejecutoras.id_unidadEjecutora ORDER BY poblacion desc", [id_acceso], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  getSectores({ id_acceso, id_unidadEjecutora, idsectores }) {
    return new Promise((resolve, reject) => {
      var query = `
      SELECT 
          sectores.*
      FROM
          sectores
              LEFT JOIN
          fichas ON fichas.sectores_idsectores = sectores.idsectores
              LEFT JOIN
          fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
      WHERE
          fichas_has_accesos.Accesos_id_acceso = ${id_acceso}
      `
      var condiciones = []
      if (id_unidadEjecutora != 0 && id_unidadEjecutora != undefined) {
        condiciones.push(`(unidadEjecutoras_id_unidadEjecutora = ${id_unidadEjecutora})`)
      }
      if (idsectores != 0 && idsectores != undefined) {
        condiciones.push(`(idsectores = ${idsectores})`)
      }
      if (condiciones.length > 0) {
        query += " AND " + condiciones.join(" AND ")
      }
      query += " GROUP BY sectores.idsectores "
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  getModalidadesEjecutoras(id_acceso, id_unidadEjecutora) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT modalidad_ejecutora.* FROM modalidad_ejecutora LEFT JOIN fichas ON fichas.modalidad_ejecutora = modalidad_ejecutora.idmodalidad_ejecutora LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha WHERE fichas_has_accesos.Accesos_id_acceso = ? AND ((0 = ?) OR fichas.unidadEjecutoras_id_unidadEjecutora = ?) GROUP BY modalidad_ejecutora.idmodalidad_ejecutora;", [id_acceso, id_unidadEjecutora, id_unidadEjecutora], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  getEstados(id_acceso, id_unidadEjecutora) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT estado.Estados_id_Estado id_Estado, estado.nombre FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo, historialestados.Estados_id_Estado FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha WHERE fichas_has_accesos.Accesos_id_acceso = ? AND ((0 = ?) OR fichas.unidadEjecutoras_id_unidadEjecutora = ?) GROUP BY Estados_id_Estado", [id_acceso, id_unidadEjecutora, id_unidadEjecutora], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  getInterfazGerencialData(id_acceso, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, modalidad_ejecutora, Estados_id_Estado) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT fichas.id_ficha, fichas.codigo,  format(g_total_presu,2) presupuesto, FORMAT(SUM(DISTINCT componentes.presupuesto), 2) presupuesto_total, FORMAT(SUM(COALESCE(costo_unitario, 0) * COALESCE(avanceactividades.valor, 0)), 2) acumulado_HOY, FORMAT(SUM(COALESCE(costo_unitario, 0) * COALESCE(avanceactividades.valor, 0)) / SUM(DISTINCT componentes.presupuesto) * 100, 2) porcentaje_acumulado, FORMAT(SUM(DISTINCT componentes.presupuesto) - SUM(COALESCE(costo_unitario, 0) * COALESCE(avanceactividades.valor, 0)), 2) saldo, FORMAT(100 - SUM(COALESCE(costo_unitario, 0) * COALESCE(avanceactividades.valor, 0)) / SUM(DISTINCT componentes.presupuesto) * 100, 2) porcentaje_saldo, unidadejecutoras.nombre unidad_ejecutora_nombre, sectores.nombre sector_nombre, modalidad_ejecutora.nombre modalidad_ejecutora_nombre, estado.nombre estado_nombre, DATE_FORMAT(fichas.fecha_inicial, '%Y-%m-%d') fecha_inicial FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN componentes ON fichas.id_ficha = componentes.fichas_id_ficha LEFT JOIN partidas ON componentes.id_componente = partidas.componentes_id_componente LEFT JOIN actividades ON partidas.id_partida = actividades.Partidas_id_partida LEFT JOIN avanceactividades ON actividades.id_actividad = avanceactividades.Actividades_id_actividad LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo, historialestados.Estados_id_Estado FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora LEFT JOIN sectores ON sectores.idsectores = fichas.sectores_idsectores LEFT JOIN modalidad_ejecutora ON modalidad_ejecutora.idmodalidad_ejecutora = fichas.modalidad_ejecutora WHERE fichas_has_accesos.Accesos_id_acceso = ? AND ((0 = ?) OR fichas.unidadEjecutoras_id_unidadEjecutora = ?) AND ((0 = ?) OR sectores_idsectores = ?) AND ((0 = ?) OR modalidad_ejecutora = ?) AND ((0 = ?) OR Estados_id_Estado = ?) GROUP BY fichas.unidadEjecutoras_id_unidadEjecutora , sectores_idsectores , id_ficha", [id_acceso, unidadEjecutoras_id_unidadEjecutora, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, sectores_idsectores, modalidad_ejecutora, modalidad_ejecutora, Estados_id_Estado, Estados_id_Estado], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  IG_AvanceFisico_anyos(id_acceso, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, modalidad_ejecutora, Estados_id_Estado) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT YEAR(avanceactividades.fecha) anyo from fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo, historialestados.Estados_id_Estado FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora LEFT JOIN sectores ON sectores.idsectores = fichas.sectores_idsectores LEFT JOIN modalidad_ejecutora ON modalidad_ejecutora.idmodalidad_ejecutora = fichas.modalidad_ejecutora LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida inner JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas_has_accesos.Accesos_id_acceso = ? and ((0 = ?) OR fichas.unidadEjecutoras_id_unidadEjecutora = ?) AND ((0 = ?) OR sectores_idsectores = ?) AND ((0 = ?) OR modalidad_ejecutora = ?) AND ((0 = ?) OR Estados_id_Estado = ?) GROUP BY YEAR(avanceactividades.fecha);", [id_acceso, unidadEjecutoras_id_unidadEjecutora, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, sectores_idsectores, modalidad_ejecutora, modalidad_ejecutora, Estados_id_Estado, Estados_id_Estado], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  IG_AvanceFisico(id_acceso, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, modalidad_ejecutora, Estados_id_Estado, anyo) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT MONTH(avanceactividades.fecha) mes, SUM(avanceactividades.valor*partidas.costo_unitario) avance FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo, historialestados.Estados_id_Estado FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora LEFT JOIN sectores ON sectores.idsectores = fichas.sectores_idsectores LEFT JOIN modalidad_ejecutora ON modalidad_ejecutora.idmodalidad_ejecutora = fichas.modalidad_ejecutora LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas_has_accesos.Accesos_id_acceso = ? AND ((0 = ?) OR fichas.unidadEjecutoras_id_unidadEjecutora = ?) AND ((0 = ?) OR sectores_idsectores = ?) AND ((0 = ?) OR modalidad_ejecutora = ?) AND ((0 = ?) OR Estados_id_Estado = ?) AND YEAR(avanceactividades.fecha) = ? GROUP BY MONTH(avanceactividades.fecha);", [id_acceso, unidadEjecutoras_id_unidadEjecutora, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, sectores_idsectores, modalidad_ejecutora, modalidad_ejecutora, Estados_id_Estado, Estados_id_Estado, anyo], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  IG_AvanceFisicoProgramado_anyos(id_acceso, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, modalidad_ejecutora, Estados_id_Estado) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT YEAR(cronogramamensual.mes) anyo FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo, historialestados.Estados_id_Estado FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora LEFT JOIN sectores ON sectores.idsectores = fichas.sectores_idsectores LEFT JOIN modalidad_ejecutora ON modalidad_ejecutora.idmodalidad_ejecutora = fichas.modalidad_ejecutora inner JOIN cronogramamensual ON cronogramamensual.fichas_id_ficha = fichas.id_ficha WHERE fichas_has_accesos.Accesos_id_acceso = ? and ((0 = ?) OR fichas.unidadEjecutoras_id_unidadEjecutora = ?) AND ((0 = ?) OR sectores_idsectores = ?) AND ((0 = ?) OR modalidad_ejecutora = ?) AND ((0 = ?) OR Estados_id_Estado = ?) GROUP BY YEAR(cronogramamensual.mes) ", [id_acceso, unidadEjecutoras_id_unidadEjecutora, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, sectores_idsectores, modalidad_ejecutora, modalidad_ejecutora, Estados_id_Estado, Estados_id_Estado], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  IG_AvanceFisicoProgramado(id_acceso, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, modalidad_ejecutora, Estados_id_Estado, anyo) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT MONTH(cronogramamensual.mes) mes, SUM(cronogramamensual.programado) avance FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo, historialestados.Estados_id_Estado FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora LEFT JOIN sectores ON sectores.idsectores = fichas.sectores_idsectores LEFT JOIN modalidad_ejecutora ON modalidad_ejecutora.idmodalidad_ejecutora = fichas.modalidad_ejecutora LEFT JOIN cronogramamensual ON cronogramamensual.fichas_id_ficha = fichas.id_ficha WHERE fichas_has_accesos.Accesos_id_acceso = ? AND ((0 = ?) OR fichas.unidadEjecutoras_id_unidadEjecutora = ?) AND ((0 = ?) OR sectores_idsectores = ?) AND ((0 = ?) OR modalidad_ejecutora = ?) AND ((0 = ?) OR Estados_id_Estado = ?) AND YEAR(cronogramamensual.mes) = ? GROUP BY MONTH(cronogramamensual.mes) ", [id_acceso, unidadEjecutoras_id_unidadEjecutora, unidadEjecutoras_id_unidadEjecutora, sectores_idsectores, sectores_idsectores, modalidad_ejecutora, modalidad_ejecutora, Estados_id_Estado, Estados_id_Estado, anyo], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  IG_AvanceFisico_porcentaje(id_ficha) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT SUM(avanceactividades.valor * partidas.costo_unitario) / costo_directo.presupuesto * 100 porcentaje_avance FROM fichas LEFT JOIN (SELECT componentes.fichas_id_ficha, SUM(componentes.presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) costo_directo ON costo_directo.fichas_id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ?", [id_ficha], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
  IG_AvanceFinanciero_porcentaje(id_ficha) {
    return new Promise((resolve, reject) => {
      pool.query("SELECT (SUM(monto) + cronogramamensual.avance) / fichas.g_total_presu *100 porcentaje_avance FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas_id_ficha, SUM(financieroEjecutado) avance FROM cronogramamensual WHERE cronogramamensual.fichas_id_ficha = ?) cronogramamensual ON cronogramamensual.fichas_id_ficha = fichas.id_ficha WHERE fichas.id_ficha = ? ", [id_ficha, id_ficha], (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res)
      })
    })

  },
}

