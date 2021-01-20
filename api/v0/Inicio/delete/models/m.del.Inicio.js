var month = new Array();
month[0] = "Enero";
month[1] = "Febrero";
month[2] = "Marzo";
month[3] = "Abril";
month[4] = "Mayo";
month[5] = "Junio";
month[6] = "Julio";
month[7] = "Agosto";
month[8] = "Setiembre";
month[9] = "Octubre";
month[10] = "Noviembre";
month[11] = "Diciembre";
function formato(data) {
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
function formatoPorcentaje(data) {
  // data = parseFloat(data)
  data = Number(data);
  if (isNaN(data)) {
    data = 0;
  }

  if (data == 100) {
    return data;
  } else if (Math.floor(data) == 99) {
    data = data.toLocaleString("es-PE", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  } else if (data < 1) {
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
function formatoFecha(fecha) {
  var currentDate = new Date(fecha);

  var date = currentDate.getDate();
  var month = currentDate.getMonth(); //Be careful! January is 0 not 1
  var year = currentDate.getFullYear();
  // return "2"
  return date + "-" + (month + 1) + "-" + year;
}
function formatoNumero(data) {
  // data = parseFloat(data)
  data = Number(data);
  if (isNaN(data)) {
    data = 0;
  } else if (data < 1) {
    data = data.toLocaleString("es-PE", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  } else {
    data = data.toFixed(4);
  }

  return data;
}
let userModel = {};
userModel.delCronogramaitem = (id_ficha, fecha, callback) => {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err);
    } else {
      conn.query(
        "delete from cronogramamensual where cronogramamensual.fichas_id_ficha = ? and cronogramamensual.mes = ?",
        [id_ficha, fecha],
        (err, res) => {
          if (err) {
            callback(err);
          } else {
            if (res.affectedRows > 0) {
              res = "eliminado";
            } else {
              res = "notFound";
            }
            callback(null, res);
            conn.destroy();
          }
        }
      );
    }
  });
};

module.exports = userModel;
