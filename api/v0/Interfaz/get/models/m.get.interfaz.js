const tools = require("../../../../../utils/format");
const default_data = require("../../../../../utils/default_data");

function formatoPorcentaje(data) {
  // data = parseFloat(data)
  data = Number(data);
  if (isNaN(data)) {
    data = 0;
  }
  if (data < 1) {
    data = data.toLocaleString("es-PE", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  } else {
    data = data.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return data;
}
module.exports = {
  //idacceso en login
  getId_acceso(data) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT accesos.id_acceso, accesos.usuario, cargos.nombre nombre_cargo, usuarios.nombre nombre_usuario, fichas.id_ficha, usuarios.imagen, usuarios.imagenAlt FROM accesos LEFT JOIN cargos ON accesos.Cargos_id_Cargo = cargos.id_Cargo LEFT JOIN usuarios ON accesos.Usuarios_id_usuario = usuarios.id_usuario LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso LEFT JOIN fichas ON fichas.id_ficha = fichas_has_accesos.Fichas_id_ficha WHERE estado = 1 AND usuario = '" +
          data.usuario +
          "' AND password = '" +
          data.password +
          "' ORDER BY accesos.id_acceso DESC LIMIT 1",
        (error, res) => {
          if (error) {
            reject(error);
          } else if (res.length == 0) {
            reject("vacio");
          } else {
            res[0].imagen = res[0].imagen || default_data.user_image_default;
            res[0].imagenAlt = res[0].imagenAlt || "default";
            resolve(res[0]);
          }
        }
      );
    });
  },
  getIdAcceso({ usuario, password }) {
    console.log("data", usuario, password);
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT accesos.id_acceso FROM accesos WHERE estado = 1 AND usuario = ? AND password = ? ORDER BY accesos.id_acceso DESC LIMIT 1",
        [usuario, password],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  getIdAccesoAdmin({ usuario, password }) {
    return new Promise((resolve, reject) => {
      var query = `
      SELECT
          fichas_has_accesos.Accesos_id_acceso id_acceso
      FROM
          fichas_has_accesos
              LEFT JOIN
          cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
              LEFT JOIN
          accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
      WHERE
          nivel = 1 AND estado = 1
              AND usuario = '${usuario}'
              AND password = '${password}'
      ORDER BY fichas_has_accesos.Accesos_id_acceso DESC
      LIMIT 1
      `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getCargoByIdAcceso({ id_acceso }) {
    return new Promise((resolve, reject) => {
      var query = `
      SELECT
          Cargos_id_Cargo cargo
      FROM
          fichas_has_accesos
      WHERE
          Accesos_id_acceso = ${id_acceso}
      LIMIT 1
      `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res ? res[0] : {});
      });
    });
  },
  getTipoAdministracion({ id_ficha }) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT COUNT(fichas.id_ficha) estado FROM fichas WHERE fichas.fichas_tipo_administracion_id = 2 AND fichas.id_ficha = ?;",
        [id_ficha],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res ? res[0] : {});
        }
      );
    });
  },
  //revisar
  getMenu({ id_ficha, id_acceso }) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT fichas.id_ficha, id_acceso, accesos.menu, estado.estado_nombre, estado.id_historialEstado, cargos.nombre cargo_nombre FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso LEFT JOIN (SELECT fichas.id_ficha, estados.nombre estado_nombre, historialestados.id_historialEstado FROM fichas LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.id_ficha = fichas.id_ficha LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE fichas.id_ficha = ? AND id_acceso = ? ORDER BY estado.id_historialEstado DESC LIMIT 1 ",
        [id_ficha, id_acceso],
        (error, res) => {
          if (error) {
            reject(error);
          }
          if (res && res[0]) {
            var json = JSON.parse(res[0].menu);
            var estado = res[0].estado_nombre;
            var cargo = res[0].cargo_nombre;
            for (let i = 0; i < json.length; i++) {
              const element = json[i];
              if (element.nombreMenu == "PROCESOS FISICOS") {
                if (cargo == "RESIDENTE" || cargo == "ASISTENTE TECNICO") {
                  if (
                    estado == "Ejecucion" ||
                    estado == "Corte" ||
                    estado == "Actualizacion"
                  ) {
                    element.submenus.splice(0, 0, {
                      ruta: "/MDdiario",
                      nombreMenu: "Metrados diarios",
                      nombrecomponente: "MDdiario",
                    });
                  } else if (estado == "Paralizado") {
                    element.submenus.splice(0, 0, {
                      nombreMenu: "Paralizado ",
                      ruta: "/ParalizacionObra",
                      nombrecomponente: "ParalizacionObra",
                    });
                  } else if (estado == "Compatibilidad") {
                    element.submenus.splice(0, 0, {
                      nombreMenu: "Compatibilidad",
                      ruta: "/CompatibilidadObra",
                      nombrecomponente: "CompatibilidadObra",
                    });
                  }
                } else {
                  element.submenus.splice(0, 0, {
                    nombreMenu: "MDdiario",
                    ruta: "/ParalizacionObra",
                    nombrecomponente: "ParalizacionObra",
                  });
                }
              } else {
              }
            }
            resolve(json);
          } else {
            reject("no data");
          }
        }
      );
    });
  },
  getMenu2({ id_ficha, id_acceso }) {
    return new Promise((resolve, reject) => {
      var query = `
      SELECT
          cargos.nombre cargo_nombre, accesos.nombre usuario_nombre,menu
      FROM
          accesos
              LEFT JOIN
          fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso
              LEFT JOIN
          cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
      WHERE
          id_acceso = ${id_acceso} AND Fichas_id_ficha = ${id_ficha}
      `;
      pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res ? res[0] : {});
      });
    });
  },
  getMenuDefecto() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM master_menus limit 1", (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res ? res[0] : {});
      });
    });
  },
  getDatosGenerales(id_ficha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT fichas.codigo, fichas.g_meta,fichas.g_total_presu presupuesto_total, TIMESTAMPDIFF(DAY, fichas.fecha_inicial, CURDATE()) dias_ejecutados, TIMESTAMPDIFF(DAY, CURDATE(), plazoejecucion.fechaEjecucion) dias_saldo, estado.nombre estado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_acumulado, SUM(avanceactividades.valor * partidas.costo_unitario) / tb_costo_directo.costo_directo * 100 porcentaje_acumulado, avance_actual.avance avance_actual, avance_actual.avance / tb_costo_directo.costo_directo * 100 porcentaje_actual, avance_ayer.avance avance_ayer, avance_ayer.avance / tb_costo_directo.costo_directo * 100 porcentaje_ayer, Avance_mes_actual.avance avance_mes_actual, Avance_mes_actual.avance / tb_costo_directo.costo_directo * 100 porcentaje_mes_actual FROM fichas LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad LEFT JOIN plazoejecucion ON plazoejecucion.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas.id_ficha, SUM(avanceactividades.valor * partidas.costo_unitario) avance, avanceactividades.fecha FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE DATE(avanceactividades.fecha) = CURDATE() GROUP BY fichas.id_ficha) avance_actual ON avance_actual.id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas.id_ficha, SUM(avanceactividades.valor * partidas.costo_unitario) avance FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE DATE(avanceactividades.fecha) = SUBDATE(CURDATE(), 1) AND historialactividades.estado IS NULL GROUP BY fichas.id_ficha) avance_ayer ON avance_ayer.id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas.id_ficha, SUM(avanceactividades.valor * partidas.costo_unitario) avance FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE DATE_FORMAT(avanceactividades.fecha, '%Y %m') = DATE_FORMAT(NOW(), '%Y %m') AND historialactividades.estado IS NULL GROUP BY fichas.id_ficha) Avance_mes_actual ON avance_mes_actual.id_ficha = fichas.id_ficha LEFT JOIN (SELECT fichas_id_ficha, SUM(presupuesto) costo_directo FROM componentes GROUP BY componentes.fichas_id_ficha) tb_costo_directo ON tb_costo_directo.fichas_id_ficha = fichas.id_ficha WHERE historialactividades.estado IS NULL and fichas.id_ficha = ? GROUP BY fichas.id_ficha",
        [id_ficha],
        (error, res) => {
          if (error) {
            reject(error.code);
          } else if (res.length == 0) {
            reject("vacio");
          } else {
            const ficha = res[0];
            ficha.avance_acumulado = formatoPorcentaje(ficha.avance_acumulado);
            ficha.porcentaje_acumulado = formatoPorcentaje(
              ficha.porcentaje_acumulado
            );
            ficha.avance_actual = formatoPorcentaje(ficha.avance_actual);
            ficha.porcentaje_actual = formatoPorcentaje(
              ficha.porcentaje_actual
            );
            ficha.avance_ayer = formatoPorcentaje(ficha.avance_ayer);
            ficha.porcentaje_ayer = formatoPorcentaje(ficha.porcentaje_ayer);
            ficha.avance_mes_actual = formatoPorcentaje(
              ficha.avance_mes_actual
            );
            ficha.porcentaje_mes_actual = formatoPorcentaje(
              ficha.porcentaje_mes_actual
            );
            ficha.presupuesto_total = formatoPorcentaje(
              ficha.presupuesto_total
            );
            resolve(res[0]);
          }
        }
      );
    });
  },
  getCostoDirecto(id_ficha, formato = false) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT SUM(componentes.presupuesto) costo_directo FROM componentes WHERE fichas_id_ficha = ? GROUP BY componentes.fichas_id_ficha ",
        [id_ficha],
        (error, res) => {
          if (error) {
            reject(error.code);
          } else if (res.length == 0) {
            reject("vacio");
          } else {
            if (formato) {
              res[0].costo_directo = tools.formatoSoles(res[0].costo_directo);
            }
            resolve(res[0].costo_directo);
          }
        }
      );
    });
  },
  getAvanceActual(id_ficha, fecha_inicial, fecha_final) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT SUM(valor) metrado, SUM(valor * costo_unitario) valor FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE componentes.fichas_id_ficha = ? and historialactividades.estado IS NULL AND avanceactividades.fecha >= ? AND avanceactividades.fecha < ? ",
        [id_ficha, fecha_inicial, fecha_final],
        async (error, res) => {
          if (error) {
            reject(error.code);
          } else if (res.length == 0) {
            reject("vacio");
          } else {
            var costo_directo = await userModel.getCostoDirecto(id_ficha);
            res[0].porcentaje = (res[0].valor / costo_directo) * 100;
            //formato soles
            res[0].metrado = tools.formatoSoles(res[0].metrado);
            res[0].valor = tools.formatoSoles(res[0].valor);
            res[0].porcentaje = tools.formatoSoles(res[0].porcentaje);
            resolve(res[0]);
          }
        }
      );
    });
  },
  getCargoPersonal(id_ficha, cargo_nombre, fecha_inicial) {
    return new Promise((resolve, reject) => {
      pool.query(
        `
        SELECT
    CONCAT(accesos.nombre,
            ' ',
            accesos.apellido_paterno,
            ' ',
            accesos.apellido_materno) usuario,
    designaciones.fecha_inicio
FROM
    fichas_has_accesos
        LEFT JOIN
    accesos ON accesos.id_acceso = fichas_has_accesos.Accesos_id_acceso
        LEFT JOIN
    cargos ON cargos.id_Cargo = fichas_has_accesos.Cargos_id_Cargo
        LEFT JOIN
    designaciones ON designaciones.fichas_has_accesos_id = fichas_has_accesos.id
WHERE
    fichas_has_accesos.Fichas_id_ficha = ${id_ficha}
        AND cargos.nombre = '${cargo_nombre}'
           AND DATE_FORMAT(designaciones.fecha_inicio, '%Y-%m-01') <= '${fecha_inicial}'
ORDER BY designaciones.fecha_inicio desc
        `,
        (error, res) => {
          if (error) {
            reject(error.code);
          } else {
            res = res[0] || {};
            res.usuario = res.usuario || "";
            resolve(res.usuario);
          }
        }
      );
    });
  },
  getIdUsuarioIdAcceso(id_acceso) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT usuarios.id_usuario FROM usuarios LEFT JOIN accesos ON accesos.Usuarios_id_usuario = usuarios.id_usuario where accesos.id_acceso = ?",
        id_acceso,
        (error, res) => {
          if (error) {
            reject(error);
          } else if (res.length == 0) {
            reject("vacio");
          } else {
            resolve(res[0].id_usuario);
          }
        }
      );
    });
  },
  getTipoObras1() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT tipoobras.* FROM tipoobras", (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
  getTipoObras({ id_acceso }) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT tipoobras.* FROM fichas_has_accesos LEFT JOIN fichas ON fichas.id_ficha = fichas_has_accesos.Fichas_id_ficha LEFT JOIN tipoobras ON tipoobras.id_tipoObra = fichas.tipoObras_id_tipoObra where fichas_has_accesos.Accesos_id_acceso = ? GROUP BY tipoobras.id_tipoObra",
        id_acceso,
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  getTipoObrasAdmin() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM tipoobras", (error, res) => {
        if (error) {
          reject(error);
        }
        resolve(res);
      });
    });
  },
};
