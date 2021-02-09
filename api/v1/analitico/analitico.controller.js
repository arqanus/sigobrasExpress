const Model = require("./analitico.model");

function obtenerResumen(data) {
  return Model.obtenerResumen(data);
}
function actualizarResumen(data) {
  return Model.actualizarResumen(data);
}
function eliminarResumen(data) {
  return Model.eliminarResumen(data);
}
function actualizarResumenAnual(data) {
  return Model.actualizarResumenAnual(data);
}
function actualizarResumenMensual(data) {
  return Model.actualizarResumenMensual(data);
}
module.exports = {
  obtenerResumen,
  actualizarResumen,
  eliminarResumen,
  actualizarResumenAnual,
  actualizarResumenMensual,
};
