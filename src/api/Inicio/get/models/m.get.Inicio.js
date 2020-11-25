const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')

let userModel = {};
userModel.getObras = (id_acceso) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT costo_directo.presupuesto costo_directo, fichas.id_ficha, fichas.g_meta, fichas.g_total_presu, SUM(avanceactividades.valor * partidas.costo_unitario) presu_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / costo_directo.presupuesto * 100 porcentaje_avance, fichas.codigo, estado.nombre estado_nombre, tipoobras.nombre tipo_obra, MAX(IF(avanceactividades.valor IS NULL, '1990-01-01', avanceactividades.fecha)) ultima_fecha_avance, fichas.confirmacion_super_inf FROM fichas LEFT JOIN tipoobras ON tipoobras.id_tipoObra = fichas.tipoObras_id_tipoObra LEFT JOIN (SELECT componentes.fichas_id_ficha, SUM(componentes.presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) costo_directo ON costo_directo.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE  fichas_has_accesos.habilitado AND fichas_has_accesos.Accesos_id_acceso = ? AND historialactividades.estado IS NULL GROUP BY fichas.id_ficha ORDER BY ultima_fecha_avance DESC", [id_acceso], (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
}
userModel.listaObrasByIdAcceso = ({ id_acceso, id_tipoObra }) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT  fichas.id_ficha, fichas.codigo, fichas.g_meta, id_tipoObra FROM fichas LEFT JOIN tipoobras ON tipoobras.id_tipoObra = fichas.tipoObras_id_tipoObra LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha WHERE fichas_has_accesos.habilitado AND fichas_has_accesos.Accesos_id_acceso = ? AND (0 = ? OR id_tipoObra = ?)", [id_acceso, id_tipoObra, id_tipoObra], (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
}
userModel.getAvanceFinancieroCortes = (id_ficha) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT SUM(monto) avance_financiero FROM historialestados WHERE historialestados.Fichas_id_ficha = ? GROUP BY historialestados.Fichas_id_ficha", [id_ficha], (error, res) => {
      if (error) {
        reject(error);
      } else if (res.length == 0) {
        reject("vacio");
      }
      resolve(res[0])
    })
  })

}
userModel.getComponentesPgerenciales = (id_ficha) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT fichas.id_ficha, componentes.numero, componentes.nombre, componentes.presupuesto, SUM(avanceactividades.valor * partidas.costo_unitario) comp_avance, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 porcentaje_avance_componentes FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ? and historialactividades.estado is null GROUP BY componentes.id_componente", id_ficha, (err, res) => {
      if (err) {
        reject(err);
      }
      else if (res.length == 0) {
        reject("vacio");
      } else {
        var costo_directo = {
          "numero": "",
          "nombre": "COSTO DIRECTO",
          "presupuesto": 0,
          "comp_avance": 0,
          "porcentaje_avance_componentes": 0
        }
        for (let i = 0; i < res.length; i++) {
          const fila = res[i];

          //calculo de costo directo
          costo_directo.presupuesto += fila.presupuesto
          costo_directo.comp_avance += fila.comp_avance
          costo_directo.porcentaje_avance_componentes += fila.porcentaje_avance_componentes

          //formateo
          fila.presupuesto = tools.formatoSoles(fila.presupuesto)
          fila.comp_avance = tools.formatoSoles(fila.comp_avance)
          fila.porcentaje_avance_componentes = tools.formatoSoles(fila.porcentaje_avance_componentes)


        }
        costo_directo.porcentaje_avance_componentes = costo_directo.comp_avance / costo_directo.presupuesto * 100
        costo_directo.presupuesto = tools.formatoSoles(costo_directo.presupuesto)
        costo_directo.comp_avance = tools.formatoSoles(costo_directo.comp_avance)
        costo_directo.porcentaje_avance_componentes = tools.formatoSoles(costo_directo.porcentaje_avance_componentes)

        res.push(
          costo_directo
        )
        resolve(res);
      }
    })
  })
}
userModel.getCargosById_ficha = (id_ficha) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT cargos.nombre cargo_nombre, cargos.id_cargo FROM fichas_has_accesos LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso INNER JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE fichas_has_accesos.Fichas_id_ficha = ? AND cargos_tipo_id = 3 GROUP BY cargos.id_Cargo ORDER BY cargos.nivel", [id_ficha], (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
}
userModel.getUsuariosByCargo = (id_ficha, id_cargo, estado = true) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT usuarios.*, CONCAT(usuarios.apellido_paterno, ' ', usuarios.apellido_materno, ' ', usuarios.nombre) nombre_usuario, cargos.nombre cargo_nombre, fichas_has_accesos.memorandum, accesos.id_acceso FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso INNER JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE fichas_has_accesos.Fichas_id_ficha = ? AND (0 = ? OR accesos.Cargos_id_Cargo = ?) AND fichas_has_accesos.habilitado = ?  AND cargos_tipo_id = 3 ORDER BY cargos.nivel , accesos.id_acceso DESC", [id_ficha, id_cargo, id_cargo, estado], (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
}
userModel.getFinancieroMonto = (id_ficha) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT historialestados.monto financiero_monto, historialestados.monto / fichas.g_total_presu * 100 financiero_porcentaje,historialestados.id_historialEstado FROM historialestados LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN fichas ON fichas.id_ficha = historialestados.Fichas_id_ficha WHERE estados.codigo = 'C' AND historialestados.Fichas_id_ficha = ? LIMIT 1", [id_ficha], (error, res) => {
      if (error) {
        reject(error);
      } else if (res.length == 0) {
        resolve("vacio");
      } else {
        resolve(res[0]);
      }
    })
  })
}
userModel.getcronogramaInicio = (corte, id_ficha, fecha_inicial) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT 'E' codigo, DATE_FORMAT(cronogramamensual.mes, '%Y-%m-%d') fecha, DATE_FORMAT(cronogramamensual.mes, '%b.') mes, DATE_FORMAT(cronogramamensual.mes, '%Y') anyo, programado programado_monto, programado / tb_presupuesto.presupuesto * 100 programado_porcentaje, COALESCE(tb_fisico.fisico_monto, 0) fisico_monto, COALESCE(tb_fisico.fisico_monto, 0) / tb_presupuesto.presupuesto * 100 fisico_porcentaje, COALESCE(financieroEjecutado, 0) financiero_monto, COALESCE(financieroEjecutado, 0) / fichas.g_total_presu * 100 financiero_porcentaje FROM cronogramamensual LEFT JOIN (SELECT componentes.fichas_id_ficha, avanceactividades.fecha, DATE_FORMAT(avanceactividades.fecha, '%m ') mes, DATE_FORMAT(avanceactividades.fecha, '%Y ') anyo, SUM(avanceactividades.valor * partidas.costo_unitario) fisico_monto FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND avanceactividades.fecha >= ? GROUP BY componentes.fichas_id_ficha , DATE_FORMAT(avanceactividades.fecha, '%m %Y') ORDER BY avanceactividades.fecha) tb_fisico ON tb_fisico.fichas_id_ficha = cronogramamensual.fichas_id_ficha AND DATE_FORMAT(tb_fisico.fecha, '%m %Y') = DATE_FORMAT(cronogramamensual.mes, '%m %Y') LEFT JOIN (SELECT componentes.fichas_id_ficha, SUM(componentes.presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.fichas_id_ficha = cronogramamensual.fichas_id_ficha left join fichas on fichas.id_ficha = cronogramamensual.fichas_id_ficha WHERE cronogramamensual.fichas_id_ficha = ? AND DATE_FORMAT(cronogramamensual.mes, '%Y-%m-01') >= DATE_FORMAT(?, '%Y-%m-01') AND cronogramamensual.programado != 0", [fecha_inicial, id_ficha, fecha_inicial], (error, res) => {
      if (error) {
        reject(error);
      } else if (res.length == 0 && corte == "vacio") {
        resolve("vacio");
      } else {
        if (corte != "vacio") {
          delete corte.fecha_inicial
          delete corte.fecha_final
          res.unshift(corte)
        }
        // resolve(res)
        var programado_acumulado = 0
        var fisico_acumulado = 0
        var financiero_acumulado = 0
        var programado_monto = 0
        var fisico_monto = 0
        var financiero_monto = 0
        var grafico_programado = []
        var grafico_fisico = []
        var grafico_financiero = []
        var periodos = []
        for (let i = 0; i < res.length; i++) {
          const fila = res[i];
          programado_acumulado += fila.programado_porcentaje
          fisico_acumulado += fila.fisico_porcentaje
          financiero_acumulado += fila.financiero_porcentaje
          programado_monto += fila.programado_monto
          fisico_monto += fila.fisico_monto
          financiero_monto += fila.financiero_monto
          fila.programado_acumulado = programado_acumulado
          fila.fisico_acumulado = fisico_acumulado
          fila.financiero_acumulado = financiero_acumulado
          fila.periodo = fila.mes + " " + fila.anyo
          // delete fila.codigo
          delete fila.mes
          delete fila.anyo
          grafico_programado.push(Number(tools.formatoSoles(programado_acumulado)))
          grafico_fisico.push(Number(tools.formatoSoles(fisico_acumulado)))
          grafico_financiero.push(Number(tools.formatoSoles(financiero_acumulado)))
          periodos.push(fila.periodo)
          //format
          fila.programado_monto = tools.formatoSoles(fila.programado_monto)
          fila.programado_porcentaje = tools.formatoSoles(fila.programado_porcentaje)
          fila.fisico_monto = tools.formatoSoles(fila.fisico_monto)
          fila.fisico_porcentaje = tools.formatoSoles(fila.fisico_porcentaje)
          fila.financiero_monto = tools.formatoSoles(fila.financiero_monto)
          fila.financiero_porcentaje = tools.formatoSoles(fila.financiero_porcentaje)
          fila.programado_acumulado = tools.formatoSoles(fila.programado_acumulado)
          fila.fisico_acumulado = tools.formatoSoles(fila.fisico_acumulado)
          fila.financiero_acumulado = tools.formatoSoles(fila.financiero_acumulado)
        }
        resolve({
          "programado_monto_total": tools.formatoSoles(programado_monto),
          "programado_porcentaje_total": tools.formatoSoles(programado_acumulado),
          "fisico_monto_total": tools.formatoSoles(fisico_monto),
          "fisico_porcentaje_total": tools.formatoSoles(fisico_acumulado),
          "financiero_monto_total": tools.formatoSoles(financiero_monto),
          "financiero_porcentaje_total": tools.formatoSoles(financiero_acumulado),
          "grafico_programado": grafico_programado,
          "grafico_fisico": grafico_fisico,
          "grafico_financiero": grafico_financiero,
          "grafico_periodos": periodos,
          "data": res
        });
      }
    })
  })

}
userModel.postUsuario = (data) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, dni, direccion, email, celular, cpt) VALUES (?,?,?,?,?,?,?,?);", [data.nombre, data.apellido_paterno, data.apellido_materno, data.dni, data.direccion, data.email, data.celular, data.cpt], (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res)
    })
  })
}
userModel.postAcceso = (id_cargo, id_usuario) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO accesos (usuario, password, estado, Cargos_id_Cargo, Usuarios_id_usuario) VALUES ('USER', 'USER123', 1, ?,?);", [id_cargo, id_usuario], (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res)
    })
  })
}
userModel.postAccesoFicha = (id_ficha, id_acceso) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO `fichas_has_accesos` (`Fichas_id_ficha`, `Accesos_id_acceso`) VALUES (?,?)", [id_ficha, id_acceso], (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res)
    })
  })
}
userModel.putUsuarioMemo = (memorandum, id_acceso, id_ficha) => {
  return new Promise((resolve, reject) => {
    pool.query("UPDATE fichas_has_accesos SET memorandum = ? WHERE fichas_has_accesos.Accesos_id_acceso = ? AND fichas_has_accesos.Fichas_id_ficha = ?", [memorandum, id_acceso, id_ficha], (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res)
    })
  })
}


module.exports = userModel;