const User = require("../models/m.get.curvaS");
module.exports = (app) => {
  app.post("/getAnyosEjecutados", async (req, res) => {
    try {
      var data = await User.getAnyosEjecutados(req.body.id_ficha);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getPeriodosEjecutados", async (req, res) => {
    try {
      // revision de registro en el anyo requerido
      var data = await User.getRegistrosAnyoCurvaS(
        req.body.anyo,
        req.body.id_ficha
      );
      if (data.length == 0) {
        var data = await User.getPeriodosEjecutados(
          req.body.anyo,
          req.body.id_ficha
        );
        for (let i = 0; i < data.length; i++) {
          var fecha_final = "";
          const element = data[i];
          if (i < data.length - 1) {
            fecha_final = data[i + 1].fecha_inicial;
          } else {
            Date.prototype.formatMMDDYYYY = function () {
              return (
                this.getFullYear() +
                "-" +
                (this.getMonth() + 1) +
                "-" +
                this.getDate()
              );
            };

            fecha_final = new Date(
              parseInt(req.body.anyo) + 1,
              0,
              1
            ).formatMMDDYYYY();
          }
          var req_montoEjecutado = await User.getMontoEjecutadoPeriodo(
            element.fecha_inicial,
            fecha_final,
            req.body.id_ficha
          );
          data[i].ejecutado_monto = req_montoEjecutado[0].ejecutado_monto;
        }
        res.json({ data, message: "consulta exitosa" });
      } else {
        res.json({ data: [], message: "se encontraron registros anteriores" });
      }
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/postDataCurvaS", async (req, res) => {
    try {
      var dataProcesada = [];
      req.body.forEach((element) => {
        dataProcesada.push([
          element.fecha_inicial,
          element.programado_monto,
          element.financiero_monto,
          element.ejecutado_monto,
          element.observacion,
          element.estado_codigo,
          element.fichas_id_ficha,
          element.tipo || "PERIODO",
          element.anyo,
          element.mes,
        ]);
      });
      var data = await User.postDataCurvaS(dataProcesada);
      console.log(data);
      if (data.affectedRows > 0) {
        res.json({ message: "registro exitoso" });
      } else {
        res.json({ message: "hubo un problema con el registro" });
      }
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getDataCurvaS", async (req, res) => {
    try {
      var data = await User.getDataCurvaS(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getDataCurvaSAnyos", async (req, res) => {
    try {
      var data = await User.getDataCurvaSAnyos(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getDataCurvaSAcumulados", async (req, res) => {
    try {
      var data = await User.getDataCurvaSAcumulados(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getDataCurvaSAcumuladosByAnyo", async (req, res) => {
    try {
      var data = await User.getDataCurvaSAcumuladosByAnyo(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getDataCurvaSAcumuladosByAnyo2", async (req, res) => {
    try {
      var data = await User.getDataCurvaSAcumuladosByAnyo2(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/putFinancieroCurvaS", async (req, res) => {
    try {
      var data = await User.putFinancieroCurvaS(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/putProgramadoCurvaSbyId", async (req, res) => {
    try {
      var data = await User.putProgramadoCurvaSbyId(
        req.body.id,
        req.body.programado_monto
      );
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/putEjecutadoMonto", async (req, res) => {
    try {
      var req_fecha_final = await User.getFechaFinalCurvaS(
        req.body.fecha_inicial,
        req.body.id_ficha
      );
      // se genera fecha final
      var fecha_final = "";
      if (req_fecha_final[0]) {
        fecha_final = req_fecha_final[0].fecha_final;
      } else {
        var fecha = req.body.fecha_inicial.split("-");
        var anyo = fecha[0];
        fecha_final = Number(anyo) + 1 + "-01-01";
      }
      //se obtiene el monto ejecutado de ese periodo
      req_montoEjecutado = await User.getMontoEjecutadoPeriodo(
        req.body.fecha_inicial,
        fecha_final,
        req.body.id_ficha
      );
      //se actualiza el monto ejecutado en la curva s
      req_updataeMontoEjecutado = await User.putEjecutadoCurvaS(
        req_montoEjecutado[0].ejecutado_monto,
        req.body.fecha_inicial,
        req.body.id_ficha
      );
      var fechaTemp = req.body.fecha_inicial.split("-");
      var currDate = new Date();
      if (
        fechaTemp[0] != currDate.getFullYear() ||
        fechaTemp[1] != currDate.getMonth() + 1
      ) {
        req_updataeMontoEjecutado = await User.putProgramadoCurvaS(
          req_montoEjecutado[0].ejecutado_monto,
          req.body.fecha_inicial,
          req.body.id_ficha
        );
      }
      res.json(req_montoEjecutado[0]);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getRegistroNoUbicados", async (req, res) => {
    try {
      var data = await User.getRegistroNoUbicados(req.body.id_ficha);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getAnyosNoRegistradosCurvaS", async (req, res) => {
    try {
      var data = await User.getAnyosNoRegistradosCurvaS(req.body.id_ficha);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getDataObra", async (req, res) => {
    try {
      var data = await User.getDataObra(req.body.id_ficha);
      res.json(data[0]);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/deletePeriodoCurvaS", async (req, res) => {
    try {
      var data = await User.deletePeriodoCurvaS(req.body.id);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getPimData", async (req, res) => {
    try {
      var data = await User.getPimData(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/getCurvaSPin", async (req, res) => {
    try {
      var data = await User.getCurvaSPin(req.body.id_ficha, req.body.anyo);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
  app.post("/postCurvaSPin", async (req, res) => {
    try {
      var dataTemp = [];
      req.body.forEach((element) => {
        dataTemp.push([element.id_ficha, element.anyo, element.monto]);
      });
      var data = await User.postCurvaSPin(dataTemp);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json({ error: error.code });
    }
  });
};
