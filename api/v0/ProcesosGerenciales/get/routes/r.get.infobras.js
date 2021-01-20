const User = require("../models/m.get.infobras");
const Format = require("../../../../../utils/format");
module.exports = (app) => {
  app.post("/infobras", async (peticion, respuesta) => {
    try {
      var req_costoDirecto = await User.presupuestoCostoDirecto(
        peticion.body.id_ficha
      );
      var costo_directo = req_costoDirecto.costo_directo;
      var data = await User.infobras(peticion.body.id_ficha);
      data[0].porcentaje_acumulado = data[0].acumulado_hoy / costo_directo;
      data[0].saldo = costo_directo - data[0].acumulado_hoy;
      data[0].porcentaje_saldo = data[0].saldo / costo_directo;
      //format
      data[0].acumulado_hoy = Format.formatoSoles(data[0].acumulado_hoy);
      data[0].porcentaje_acumulado = Format.formatoSoles(
        data[0].porcentaje_acumulado
      );
      data[0].saldo = Format.formatoSoles(data[0].saldo);
      data[0].porcentaje_saldo = Format.formatoSoles(data[0].porcentaje_saldo);
      respuesta.json(data);
    } catch (error) {
      console.log(error);
      respuesta.status(204).json(error);
    }
  });
};
