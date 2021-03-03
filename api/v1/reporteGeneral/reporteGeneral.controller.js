const Model = require("./reporteGeneral.model");

function obtenerDatos(data) {
  return Model.obtenerDatos(data);
}
function actualizarDatos(data) {
  return Model.actualizarDatos(data);
}
function obtenerInterfazSeleccionada(data) {
  return Model.obtenerInterfazSeleccionada(data);
}
function actualizarInterfazSeleccionada(data) {
  return Model.actualizarInterfazSeleccionada(data);
}

module.exports = {
  obtenerDatos,
  actualizarDatos,
  obtenerInterfazSeleccionada,
  actualizarInterfazSeleccionada,
};
