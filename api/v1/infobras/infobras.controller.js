const Model = require("./infobras.model");

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
