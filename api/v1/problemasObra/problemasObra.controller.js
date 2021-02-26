const Model = require("./problemasObra.model");

function obtenerDatos(data) {
  return Model.obtenerDatos(data);
}
function actualizarDatos(data) {
  return Model.actualizarDatos(data);
}
function eliminarData(data) {
  return Model.eliminarData(data);
}
module.exports = {
  obtenerDatos,
  actualizarDatos,
  eliminarData,
};
