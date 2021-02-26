const Model = require("./informesUbicaciones.model");

function obtenerDatos(data) {
  return Model.obtenerDatos(data);
}
function actualizarDatos(data) {
  return Model.actualizarDatos(data);
}
module.exports = {
  obtenerDatos,
  actualizarDatos,
};
