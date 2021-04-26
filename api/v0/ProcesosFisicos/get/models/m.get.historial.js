const tools = require("../../../../../utils/format");
let userModel = {};
function formato(data) {
  if (data == null) {
    return 0;
  }

  data = Number(data);
  if (isNaN(data)) {
    data = 0;
  }
  if (data == 0) {
    return 0;
  } else if (data < 1) {
    data = data.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
  getHistorialAnyos(id_ficha, callback) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT year(avanceactividades.fecha) anyo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado is null AND COALESCE(avanceactividades.valor, 0) != 0 and fichas.id_ficha = ? GROUP BY year(avanceactividades.fecha)",
        id_ficha,
        (err, res) => {
          if (err) {
            reject(err.code);
          } else if (res.length == 0) {
            reject("vacio");
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  getHistorialAnyosResumen(id_ficha, anyo, callback) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT CONCAT('C-', componentes.numero) numero, componentes.nombre, componentes.presupuesto, MONTH(avanceactividades.fecha) dia, SUM(avanceactividades.valor * partidas.costo_unitario) valor FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? GROUP BY componentes.id_componente , MONTH(avanceactividades.fecha)",
        [id_ficha, anyo],
        (err, res) => {
          if (err) {
            reject(err.code);
          } else if (res.length == 0) {
            resolve("vacio");
          } else {
            //calculando ultimo dia
            var dia_inicial = res[0].dia;
            var dia_final = res[res.length - 1].dia;
            // console.log("rango de dias",dia_inicial,dia_final);
            //creando data inicial
            var series = [];
            var listaItems = [];
            var leyenda = [];
            for (let i = 0; i < res.length; i++) {
              const avance = res[i];
              if (listaItems.indexOf(avance.numero) === -1) {
                series.push({
                  name: avance.numero,
                  data: [],
                });
                listaItems.push(avance.numero);
                leyenda.push({
                  numero: avance.numero,
                  componente_nombre: avance.nombre,
                  presupuesto: avance.presupuesto,
                  valor: 0,
                  porcentaje: 0,
                });
              }
            }
            //llenando de ceros
            var categories = [];
            for (let i = dia_inicial; i <= dia_final; i++) {
              categories.push(tools.monthNames[i - 1]);
              for (let j = 0; j < series.length; j++) {
                const componente = series[j];
                componente.data.push(0);
              }
            }

            //llenando datos de avance

            for (let i = 0; i < res.length; i++) {
              const avance = res[i];
              for (let j = 0; j < series.length; j++) {
                const componente = series[j];
                // console.log("avance",avance.nombre,componente.name,avance.dia);

                if (avance.numero == componente.name && avance.valor != null) {
                  componente.data[avance.dia - dia_inicial] = Number(
                    avance.valor.toFixed(2)
                  );
                  leyenda[j].valor += avance.valor;
                  break;
                }
              }
            }
            //porcentaje de leyenda
            for (let i = 0; i < leyenda.length; i++) {
              const comp = leyenda[i];
              comp.porcentaje = (comp.valor / comp.presupuesto) * 100;
              //formato
              comp.presupuesto = tools.formatoSoles(comp.presupuesto);
              comp.valor = tools.formatoSoles(comp.valor);
              comp.porcentaje = tools.formatoSoles(comp.porcentaje);
            }

            resolve({
              categories,
              series,
              leyenda,
            });
          }
        }
      );
    });
  },
  getHistorialAnyosResumen2(id_ficha, anyo, meses) {
    return new Promise((resolve, reject) => {
      var query =
        "SELECT CONCAT('C-', componentes.numero) numero, componentes.nombre, componentes.presupuesto,SUM(avanceactividades.valor * partidas.costo_unitario) valor,";
      meses.forEach((item) => {
        query += `SUM(IF(MONTH(avanceactividades.fecha) = ${item.mes}, avanceactividades.valor * partidas.costo_unitario, 0)) m${item.mes},`;
      });
      query = query.slice(0, -1);
      query +=
        " FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? GROUP BY componentes.id_componente";
      pool.query(query, [id_ficha, anyo], (err, res) => {
        if (err) {
          reject(err);
        } else if (res.length == 0) {
          reject("vacio");
        } else {
          var series = [];
          var leyenda = [];

          res.forEach((element) => {
            var data = [];
            meses.forEach((element2, index) => {
              data.push(Number(Number(element["m" + (index + 1)]).toFixed(2)));
            });
            series.push({
              name: element.numero,
              data: data,
            });
            leyenda.push({
              numero: element.numero,
              componente_nombre: element.nombre,
              presupuesto: element.presupuesto,
              valor: element.valor,
              porcentaje: (element.valor / element.presupuesto) * 100,
            });
          });

          resolve({
            series,
            leyenda,
          });
        }
      });
    });
  },
  getHistorialAnyosResumen3(id_ficha, anyo, mes_inicial, mes_final) {
    return new Promise((resolve, reject) => {
      var query = `
            SELECT
                componentes.numero,
                componentes.nombre,
                componentes.presupuesto,
                SUM(avanceactividades.valor * partidas.costo_unitario) valor,
            `;
      for (let index = mes_inicial; index <= mes_final; index++) {
        query += `SUM(IF(MONTH(avanceactividades.fecha) = ${index}, avanceactividades.valor * partidas.costo_unitario, 0)) m${index},`;
      }
      query = query.slice(0, -1);
      query += `
            FROM
                fichas
                    LEFT JOIN
                componentes ON componentes.fichas_id_ficha = fichas.id_ficha
                    LEFT JOIN
                partidas ON partidas.componentes_id_componente = componentes.id_componente
                    LEFT JOIN
                actividades ON actividades.Partidas_id_partida = partidas.id_partida
                    LEFT JOIN
                avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
                    AND COALESCE(avanceactividades.valor, 0) != 0
                    AND YEAR(avanceactividades.fecha) = ${anyo}
            WHERE
                fichas.id_ficha = ${id_ficha}
            GROUP BY componentes.id_componente
            `;
      // resolve(query)
      pool.query(query, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  },
  getHistorialMeses(id_ficha, anyo) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') fecha, MONTHNAME(avanceactividades.fecha) mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? and year(avanceactividades.fecha)= ? GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%b') order by DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01')",
        [id_ficha, anyo],
        (err, res) => {
          if (err) {
            console.log(err);
            reject(err.code);
          } else if (res.length == 0) {
            reject("vacio");
          } else {
            resolve(res);
          }
        }
      );
    });
  },
  getHistorialMeses2(id_ficha, anyo) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') fecha, MONTH(avanceactividades.fecha) mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialestados ON historialestados.Fichas_id_ficha = fichas.id_ficha AND historialestados.fecha_inicial <= avanceactividades.fecha AND avanceactividades.fecha < historialestados.fecha_final LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? and year(avanceactividades.fecha)= ? GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%b') order by DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01')",
        [id_ficha, anyo],
        (err, res) => {
          if (err) {
            reject(err.code);
          }
          resolve(res);
        }
      );
    });
  },
  getHistorialResumen(id_ficha, fecha, callback) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT CONCAT('C-', componentes.numero) nombre, componentes.nombre componente_nombre, componentes.presupuesto, DAY(avanceactividades.fecha) dia, SUM(avanceactividades.valor * partidas.costo_unitario) valor, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 porcentaje FROM  fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') = DATE_FORMAT(?, '%Y-%m-01') GROUP BY componentes.id_componente , DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') order by day(avanceactividades.fecha)",
        [id_ficha, fecha],
        (err, res) => {
          if (err) {
            reject(err.code);
          } else if (res.length == 0) {
            reject("vacio");
          } else {
            // callback(null,res)
            //calculando ultimo dia
            var fecha_array = fecha.split("-");
            var month = fecha_array[1] - 1;
            var year = fecha_array[0];
            var lastDate = new Date(year, month + 1, 0).getDate();
            var dia_inicial = res[0].dia;
            var dia_final = res[res.length - 1].dia;
            // console.log("rango de dias",dia_inicial,dia_final);

            //creando data inicial
            var series = [];
            var listaItems = [];
            var leyenda = [];
            for (let i = 0; i < res.length; i++) {
              const avance = res[i];
              if (listaItems.indexOf(avance.nombre) === -1) {
                series.push({
                  name: avance.nombre,
                  data: [],
                });
                leyenda.push({
                  numero: avance.nombre,
                  componente_nombre: avance.componente_nombre,
                  presupuesto: avance.presupuesto,
                  valor: avance.valor,
                  porcentaje: avance.porcentaje,
                });
                listaItems.push(avance.nombre);
              } else {
                for (let j = 0; j < leyenda.length; j++) {
                  const comp = leyenda[j];
                  if (comp.numero == avance.nombre) {
                    comp.valor += avance.valor;
                    comp.porcentaje += avance.porcentaje;
                    break;
                  }
                }
              }
            }
            //llenando de ceros
            var categories = [];
            for (let i = dia_inicial; i <= dia_final; i++) {
              categories.push(i);
              for (let j = 0; j < series.length; j++) {
                const componente = series[j];
                componente.data.push(0);
              }
            }

            //llenando datos de avance

            for (let i = 0; i < res.length; i++) {
              const avance = res[i];
              for (let j = 0; j < series.length; j++) {
                const componente = series[j];
                // console.log("avance",avance.nombre,componente.name,avance.dia);

                if (avance.nombre == componente.name && avance.valor != null) {
                  componente.data[avance.dia - dia_inicial] = Number(
                    avance.valor.toFixed(2)
                  );
                  break;
                }
              }
            }
            //formateando leyenda
            for (let i = 0; i < leyenda.length; i++) {
              const comp = leyenda[i];
              comp.presupuesto = tools.formatoSoles(comp.presupuesto);
              comp.valor = tools.formatoSoles(comp.valor);
              comp.porcentaje = tools.formatoSoles(comp.porcentaje);
            }
            resolve({
              categories,
              series,
              leyenda,
            });
          }
        }
      );
    });
  },
  getDiasEjecutadosMes(id_ficha, anyo, mes) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT DAY(avanceactividades.fecha) dia FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? GROUP BY DAY(avanceactividades.fecha) ORDER BY DAY(avanceactividades.fecha)",
        [id_ficha, anyo, mes],
        (err, res) => {
          if (err) {
            reject(err.code);
          }
          resolve(res);
        }
      );
    });
  },
  getHistorialResumenMensual(id_ficha, anyo, mes, diasEjecutados) {
    return new Promise((resolve, reject) => {
      var query =
        "SELECT componentes.*, SUM(avanceactividades.valor * partidas.costo_unitario) valor, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 porcentaje,";
      for (
        let i = diasEjecutados[0].dia;
        i <= diasEjecutados[diasEjecutados.length - 1].dia;
        i++
      ) {
        query += `SUM(IF(DAY(avanceactividades.fecha) = ${i}, avanceactividades.valor * partidas.costo_unitario, 0)) d${i},`;
      }
      query = query.slice(0, -1);
      query +=
        " FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? GROUP BY componentes.id_componente ORDER BY componentes.id_componente";
      pool.query(query, [id_ficha, anyo, mes], (err, res) => {
        if (err) {
          reject(err.code);
        }
        resolve(res);
      });
    });
  },
  getHistorialComponentes(id_ficha, fecha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "/*************** por componentes********************/ SELECT componentes.id_componente, componentes.numero, componentes.nombre nombre_componente, SUM(avanceactividades.valor * partidas.costo_unitario) componente_total_soles, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 componente_total_porcentaje FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') = DATE_FORMAT(?, '%Y-%m-01') GROUP BY componentes.id_componente",
        [id_ficha, fecha],
        (err, res) => {
          if (err) {
            reject(err.code);
          } else if (res.length == 0) {
            reject("vacio");
          } else {
            for (let i = 0; i < res.length; i++) {
              const componente = res[i];
              componente.componente_total_soles = formato(
                componente.componente_total_soles
              );
              componente.componente_total_porcentaje = formato(
                componente.componente_total_porcentaje
              );
            }
            resolve(res);
          }
        }
      );
    });
  },
  getHistorialComponentes2(id_ficha, anyo, mes) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT componentes.id_componente, componentes.numero, componentes.nombre nombre_componente, SUM(avanceactividades.valor * partidas.costo_unitario) componente_total_soles, SUM(avanceactividades.valor * partidas.costo_unitario) / componentes.presupuesto * 100 componente_total_porcentaje FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? GROUP BY componentes.id_componente",
        [id_ficha, anyo, mes],
        (err, res) => {
          if (err) {
            reject(err.code);
          }
          resolve(res);
        }
      );
    });
  },
  getHistorialFechas(id_componente, fecha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT DATE_FORMAT(avanceactividades.fecha, '%W %d de %M del %Y') fecha_larga, SUM(avanceactividades.valor * partidas.costo_unitario) fecha_total_soles, SUM(avanceactividades.valor * partidas.costo_unitario)/tb_presupuesto.presupuesto*100 fecha_total_porcentaje, DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') fecha FROM fichas LEFT JOIN (SELECT componentes.fichas_id_ficha id_ficha, SUM(presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND componentes.id_componente = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') = DATE_FORMAT(?, '%Y-%m-01') GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d')",
        [id_componente, fecha],
        (err, res) => {
          if (err) {
            reject(err.code);
          } else if (res.length == 0) {
            reject("vacio");
          } else {
            for (let i = 0; i < res.length; i++) {
              const fecha = res[i];
              fecha.fecha_total_soles = formato(fecha.fecha_total_soles);
              fecha.fecha_total_porcentaje = formato(
                fecha.fecha_total_porcentaje
              );
            }
            resolve(res);
          }
        }
      );
    });
  },
  getHistorialFechas2(anyo, mes, id_componente) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT avanceactividades.fecha, SUM(avanceactividades.valor * partidas.costo_unitario) fecha_total_soles, SUM(avanceactividades.valor * partidas.costo_unitario) / presupuesto_costo_directo.presupuesto * 100 fecha_total_porcentaje, DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') fecha FROM fichas LEFT JOIN (SELECT componentes.fichas_id_ficha id_ficha, SUM(presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) presupuesto_costo_directo ON presupuesto_costo_directo.id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? AND componentes.id_componente = ? GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d')",
        [anyo, mes, id_componente],
        (err, res) => {
          if (err) {
            reject(err.code);
          }
          resolve(res);
        }
      );
    });
  },
  getHistorialDias(id_componente, fecha) {
    return new Promise((resolve, reject) => {
      var query = `
      SELECT
    partidas.item,
    partidas.descripcion descripcion_partida,
    TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida,
    actividades.nombre nombre_actividad,
    avanceactividades.descripcion descripcion_actividad,
    avanceactividades.observacion,
    avanceactividades.valor valor,
    partidas.costo_unitario,
    avanceactividades.valor * partidas.costo_unitario parcial
FROM
    fichas
        LEFT JOIN
    (SELECT
        componentes.fichas_id_ficha id_ficha,
            SUM(presupuesto) presupuesto
    FROM
        componentes
    GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.id_ficha = fichas.id_ficha
        LEFT JOIN
    componentes ON componentes.fichas_id_ficha = fichas.id_ficha
        LEFT JOIN
    partidas ON partidas.componentes_id_componente = componentes.id_componente
        LEFT JOIN
    actividades ON actividades.Partidas_id_partida = partidas.id_partida
        LEFT JOIN
    avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
        LEFT JOIN
    historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad
WHERE
    historialactividades.estado IS NULL
        AND COALESCE(avanceactividades.valor, 0) != 0
        AND componentes.id_componente = ${id_componente}
        AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') = DATE_FORMAT("${fecha}", '%Y-%m-%d')`;
      pool.query(query, [id_componente, fecha], (err, res) => {
        if (err) {
          reject(err.code);
        } else {
          resolve(res);
        }
      });
    });
  },
  getHistorialDias2(id_componente, fecha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partidas.item, partidas.descripcion descripcion_partida, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, actividades.nombre nombre_actividad, avanceactividades.descripcion descripcion_actividad, avanceactividades.observacion, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * avanceactividades.valor valor, partidas.costo_unitario, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) * avanceactividades.valor * partidas.costo_unitario parcial FROM fichas LEFT JOIN (SELECT componentes.fichas_id_ficha id_ficha, SUM(presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.id_ficha = fichas.id_ficha LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND componentes.id_componente = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d')",
        [id_componente, fecha],
        (err, res) => {
          if (err) {
            reject(err.code);
          }
          resolve(res);
        }
      );
    });
  },
  getHistorialComponenteChart(id_componente, fecha, callback) {
    pool.query(
      "SELECT CONCAT('C-', componentes.numero) nombre, DAY(avanceactividades.fecha) dia, SUM(avanceactividades.valor * partidas.costo_unitario) valor FROM  fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL AND COALESCE(avanceactividades.valor, 0) != 0 AND componentes.id_componente = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-01') = DATE_FORMAT(?, '%Y-%m-01') GROUP BY componentes.id_componente , DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') ORDER BY DAY(avanceactividades.fecha)",
      [id_componente, fecha],
      (err, res) => {
        if (err) {
          console.log(err);
          callback(err.code);
        } else if (res.length == 0) {
          console.log("vacio");
          callback(null, "vacio");
        } else {
          //calculando ultimo dia
          var fecha_array = fecha.split("-");
          var month = fecha_array[1] - 1;
          var year = fecha_array[0];
          var lastDate = new Date(year, month + 1, 0).getDate();

          //creando data inicial
          var series = [];
          var listaItems = [];
          for (let i = 0; i < res.length; i++) {
            const avance = res[i];
            if (listaItems.indexOf(avance.nombre) === -1) {
              series.push({
                name: avance.nombre,
                data: [],
              });
              listaItems.push(avance.nombre);
            }
          }
          //llenando de ceros
          var categories = [];
          for (let i = 1; i <= lastDate; i++) {
            categories.push(i);
            for (let j = 0; j < series.length; j++) {
              const componente = series[j];
              componente.data.push(0);
            }
          }

          //llenando datos de avance

          for (let i = 0; i < res.length; i++) {
            const avance = res[i];
            for (let j = 0; j < series.length; j++) {
              const componente = series[j];
              console.log("avance", avance.nombre, componente.name);

              if (avance.nombre == componente.name && avance.valor != null) {
                componente.data[avance.dia - 1] = Number(
                  avance.valor.toFixed(2)
                );
                break;
              }
            }
          }

          callback(null, {
            categories,
            series,
          });
        }
      }
    );
  },
  getHistorialRegresionLineal(id_ficha, callback) {
    pool.query(
      "/*********avance por dia***************/ SELECT id_ficha, date_format(avanceactividades.fecha,'%Y-%m-%d') fecha, SUM(valor * costo_unitario) avance FROM fichas left join componentes on componentes.fichas_id_ficha= fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida inner JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE month(avanceactividades.fecha) = month(now()) and fichas.id_ficha = ? GROUP BY fichas.id_ficha, date_format(avanceactividades.fecha,'%Y-%m-%d') ",
      id_ficha,
      (err, res) => {
        if (err) {
          console.log(err);
          callback(err.code);
        } else if (res.length == 0) {
          console.log("vacio");
          callback(null, "vacio");
        } else {
          var lastDay = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            0
          ).getDate();
          var fechasData = getDaysInMonth(lastDay);
          var dias = [];
          var avances1 = [];
          var fecha_actual = false;

          for (let i = 0; i < res.length; i++) {
            var dia1 = res[i].fecha.split("-");
            dia1 = dia1[2];

            for (let j = 0; j < fechasData.yarray.length; j++) {
              const dia2 = fechasData.xarray[j];
              if (dia1 == dia2) {
                fechasData.yarray[j] = res[i].avance;
                break;
              }
            }
          }
          fechasData.regresion = regresionLineal(fechasData);
          callback(null, fechasData);
        }
      }
    );
  },
  getHistorialSemanalFechas(id_ficha, fecha_inicial, fecha_final) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') fecha, SUM(avanceactividades.valor * partidas.costo_unitario) fecha_total_soles, SUM(avanceactividades.valor * partidas.costo_unitario) / tb_presupuesto.presupuesto * 100 fecha_total_porcentaje FROM componentes LEFT JOIN (SELECT componentes.fichas_id_ficha id_ficha, SUM(presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.id_ficha = componentes.fichas_id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND componentes.fichas_id_ficha = ? AND avanceactividades.fecha > ? AND avanceactividades.fecha <= ? GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d')",
        [id_ficha, fecha_inicial, fecha_final],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  getHistorialSemanalComponentes(id_ficha, fecha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT componentes.numero, componentes.nombre, componentes.id_componente, SUM(avanceactividades.valor * partidas.costo_unitario) componente_total_soles, SUM(avanceactividades.valor * partidas.costo_unitario) / tb_presupuesto.presupuesto * 100 componente_total_porcentaje FROM componentes LEFT JOIN (SELECT componentes.fichas_id_ficha id_ficha, SUM(presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.id_ficha = componentes.fichas_id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND componentes.fichas_id_ficha = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d') GROUP BY componentes.id_componente",
        [id_ficha, fecha],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  getHistorialSemanalDias(id_componente, fecha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT avanceactividades.id_AvanceActividades, partidas.id_partida, partidas.item, partidas.descripcion descripcion_partida, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, actividades.nombre nombre_actividad, avanceactividades.descripcion descripcion_actividad, avanceactividades.observacion, avanceactividades.valor, partidas.costo_unitario, avanceactividades.valor * partidas.costo_unitario parcial, partidas.rendimiento FROM componentes LEFT JOIN (SELECT componentes.fichas_id_ficha id_ficha, SUM(presupuesto) presupuesto FROM componentes GROUP BY componentes.fichas_id_ficha) tb_presupuesto ON tb_presupuesto.id_ficha = componentes.fichas_id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND componentes.id_componente = ? AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d') ",
        [id_componente, fecha],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  getEstadoRevisadoFecha(fecha, id_ficha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT count(*) revisado FROM fechas_revisadas WHERE fecha_revisada = ? and fichas_id_ficha = ?;",
        [fecha, id_ficha],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res[0]);
        }
      );
    });
  },
  postEstadoRevisadoFecha(fecha, id_ficha) {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO fechas_revisadas (fecha_revisada, fichas_id_ficha) VALUES (?,?);",
        [fecha, id_ficha],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  putAvanceActividades(valor, id_AvanceActividades) {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE avanceactividades SET valor = ? WHERE id_AvanceActividades = ?",
        [valor, id_AvanceActividades],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
  actualizarAvanceFisicoAcumulado({ id_ficha }) {
    console.log("inicio!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    return new Promise(async (resolve, reject) => {
      var query = `
    SELECT
        SUM(avanceactividades.valor * partidas.costo_unitario) avance
    FROM
        componentes
            LEFT JOIN
        partidas ON partidas.componentes_id_componente = componentes.id_componente
            LEFT JOIN
        actividades ON actividades.Partidas_id_partida = partidas.id_partida
            LEFT JOIN
        avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad
    WHERE
        componentes.fichas_id_ficha = ${id_ficha}
    `;

      var response = await pool.query(query, (error, res) => {
        if (error) {
          reject(error);
        }
        var avance = res[0].avance || 0;
        console.log("avance", res[0].avance);
        var query2 = `
      INSERT INTO fichas_datosautomaticos
        (avancefisico_acumulado, fichas_id_ficha)
      VALUES (${avance}, ${id_ficha})
       ON DUPLICATE key UPDATE avancefisico_acumulado = VALUES(avancefisico_acumulado)
      `;
        pool.query(query2, (error, res) => {
          if (error) {
            reject(error);
          }
          console.log("res", res);
          resolve(res);
        });
      });
    });
  },
  getAvanceActividades(id_AvanceActividades) {
    return new Promise((resolve, reject) => {
      pool.query(
        "select * from avanceactividades where id_AvanceActividades = ?;",
        [id_AvanceActividades],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res[0]);
        }
      );
    });
  },
  postAvanceActividadesLog(
    accion,
    valor_old,
    valor_new,
    id_acceso,
    id_AvanceActividades
  ) {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO avanceactividades_log (accion, valor_old, valor_new, accesos_id_acceso, id_AvanceActividades) VALUES (?,?,?,?,?);",
        [accion, valor_old, valor_new, id_acceso, id_AvanceActividades],
        (error, res) => {
          if (error) {
            reject(error);
          }
          resolve(res);
        }
      );
    });
  },
};
