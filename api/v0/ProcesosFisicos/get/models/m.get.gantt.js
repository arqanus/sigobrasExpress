const tools = require("../../../../../utils/format");

let userModel = {};

userModel.getGanttAnyos = (id_ficha, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query(
        "SELECT YEAR(avanceactividades.fecha) anyo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ? GROUP BY YEAR(avanceactividades.fecha)",
        id_ficha,
        (err, res) => {
          if (err) {
            console.log(err);
            callback(err.code);
          } else if (res.length == 0) {
            callback(null, "vacio");
            conn.destroy();
          } else {
            callback(null, res);
            conn.destroy();
          }
        }
      );
    }
  });
};
userModel.getGanttMeses = (id_ficha, year, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query(
        "SELECT DATE_FORMAT(avanceactividades.fecha, '%Y-%c-01') fecha, MONTHNAME(avanceactividades.fecha) nombre_mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%c-01')",
        [id_ficha, year],
        (err, res) => {
          if (err) {
            console.log(err);
            callback(err.code);
          } else if (res.length == 0) {
            callback(null, "vacio");
            conn.destroy();
          } else {
            callback(null, res);
            conn.destroy();
          }
        }
      );
    }
  });
};
userModel.getGanttComponentes = (id_ficha, fecha, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query(
        "SELECT componentes.id_componente, componentes.numero, componentes.nombre FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE fichas.id_ficha = ? AND DATE_FORMAT(?, '%Y-%m') = DATE_FORMAT(avanceactividades.fecha, '%Y-%m') GROUP BY componentes.id_componente",
        [id_ficha, fecha],
        (err, res) => {
          if (err) {
            console.log(err);
            callback(err.code);
          } else if (res.length == 0) {
            callback(null, "vacio");
            conn.destroy();
          } else {
            callback(null, res);
            conn.destroy();
          }
        }
      );
    }
  });
};
userModel.getGanttPartidasDias = (fecha) => {
  return new Promise((resolve, reject) => {
    var year = fecha.split("-")[0];
    var month = fecha.split("-")[1];
    var lastDay = new Date(year, month, 0).getDate();
    var dias = [];
    for (let i = 1; i <= lastDay; i++) {
      var tempDate = new Date(year, month - 1, i);
      var tempDate = tools.weekDay[tempDate.getDay()];
      dias.push(tempDate + " - " + i);
    }
    resolve(dias);
  });
};
userModel.getGanttPartidas = (id_componente, fecha) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT id_partida, item, partidas.descripcion, metrado, partidas.rendimiento, partidas.metrado / partidas.rendimiento duracion_dia, SUM(valor) avance_metrado, SUM(valor * costo_unitario) avance_dinero, metrado - SUM(valor) saldo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE DATE_FORMAT(avanceactividades.fecha, '%Y-%m') = DATE_FORMAT('2018-10-01', '%Y-%m') AND componentes.id_componente = 753 GROUP BY partidas.id_partida",
      [fecha, id_componente],
      (err, res) => {
        if (err) {
          reject(err.code);
        } else {
          var year = fecha.split("-")[0];
          var month = fecha.split("-")[1];
          var lastDay = new Date(year, month, 0).getDate();
          var dias = [];
          var partidas = [];
          var listaItems = [];
          for (let i = 0; i < res.length; i++) {
            const avance = res[i];
            if (listaItems.indexOf(avance.id_partida) === -1) {
              partidas.push({
                id_partida: avance.id_partida,
                item: avance.item,
                descripcion: avance.descripcion,
                metrado: avance.metrado,
                rendimiento: avance.rendimiento,
                duracion_dia: avance.duracion_dia,
                dia: avance.dia,
                avance_metrado: avance.avance_metrado,
                avance_dinero: avance.avance_dinero,
                saldo: avance.saldo,
              });
              listaItems.push(avance.id_partida);
            }
          }
          for (let i = 1; i <= lastDay; i++) {
            var tempDate = new Date(year, month - 1, i);
            console.log(tempDate);
            var tempDate = tools.weekDay[tempDate.getDay()];
            console.log(tempDate);
            dias.push(tempDate + " - " + i);
            for (let j = 0; j < res.length; j++) {
              const partida = res[j];
              if (i == 1) {
                partida.gantt = [];
              }
              partida.gantt.push({
                IndicadorRango: 0,
                ejecutado: 7,
                perdidas: 8,
                ganancias: true,
              });
            }
          }
          // callback(null,{
          //     dias:["L - 1", "M - 2", "M - 3", "J - 4", "V - 5", "S - 6", "D - 7", "L - 8", "M - 9", "M - 10", "J - 11", "V - 12", "S - 13", "D - 14", "L - 15", "M - 16", "M - 17", "J - 18", "V - 19", "S - 20", "D - 21"],
          //     partidas:[
          //         {
          //             "item": 1,
          //             "descripcion": "xt4nv4",
          //             "metrado": 8,
          //             "duracion_dias": 5,
          //             "avance":65656,
          //             "saldo":845454,
          //             "gant": [
          //             {
          //                 "IndicadorRango": 0,
          //                 "ejecutado": 7,
          //                 "perdidas": 8,
          //                 "ganancias": true
          //             }
          //         ]
          //         }
          //     ]
          // });
          resolve({
            dias,
            partidas,
          });
        }
      }
    );
  });
};
userModel.getGanttPartidasAvance = (id_componente, fecha) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "/*********avance por dia***************/ SELECT id_partida, item, partidas.descripcion, metrado, partidas.rendimiento, ROUND(partidas.metrado / partidas.rendimiento, 2) duracion_dia, day(avanceactividades.fecha) dia, SUM(valor) avance_metrado, ROUND(SUM(valor * costo_unitario), 2) avance_dinero, metrado - SUM(valor) saldo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE DATE_FORMAT(avanceactividades.fecha, '%Y-%m') = DATE_FORMAT(?, '%Y-%m') AND componentes.id_componente = ? GROUP BY partidas.id_partida , DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d')",
      [fecha, id_componente],
      (err, res) => {
        if (err) {
          reject(err.code);
        } else {
          var year = fecha.split("-")[0];
          var month = fecha.split("-")[1];
          var lastDay = new Date(year, month, 0).getDate();
          var dias = [];
          var partidas = [];
          var listaItems = [];
          for (let i = 0; i < res.length; i++) {
            const avance = res[i];
            if (listaItems.indexOf(avance.id_partida) === -1) {
              partidas.push({
                id_partida: avance.id_partida,
                item: avance.item,
                descripcion: avance.descripcion,
                metrado: avance.metrado,
                rendimiento: avance.rendimiento,
                duracion_dia: avance.duracion_dia,
                dia: avance.dia,
                avance_metrado: avance.avance_metrado,
                avance_dinero: avance.avance_dinero,
                saldo: avance.saldo,
              });
              listaItems.push(avance.id_partida);
            }
          }
          for (let i = 1; i <= lastDay; i++) {
            var tempDate = new Date(year, month - 1, i);
            console.log(tempDate);
            var tempDate = tools.weekDay[tempDate.getDay()];
            console.log(tempDate);
            dias.push(tempDate + " - " + i);
            for (let j = 0; j < res.length; j++) {
              const partida = res[j];
              if (i == 1) {
                partida.gantt = [];
              }
              partida.gantt.push({
                IndicadorRango: 0,
                ejecutado: 7,
                perdidas: 8,
                ganancias: true,
              });
            }
          }
          // callback(null,{
          //     dias:["L - 1", "M - 2", "M - 3", "J - 4", "V - 5", "S - 6", "D - 7", "L - 8", "M - 9", "M - 10", "J - 11", "V - 12", "S - 13", "D - 14", "L - 15", "M - 16", "M - 17", "J - 18", "V - 19", "S - 20", "D - 21"],
          //     partidas:[
          //         {
          //             "item": 1,
          //             "descripcion": "xt4nv4",
          //             "metrado": 8,
          //             "duracion_dias": 5,
          //             "avance":65656,
          //             "saldo":845454,
          //             "gant": [
          //             {
          //                 "IndicadorRango": 0,
          //                 "ejecutado": 7,
          //                 "perdidas": 8,
          //                 "ganancias": true
          //             }
          //         ]
          //         }
          //     ]
          // });
          resolve({
            dias,
            partidas,
          });
        }
      }
    );
  });
};

module.exports = userModel;
