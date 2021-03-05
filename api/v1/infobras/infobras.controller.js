const Model = require("./infobras.model");

function obtenerDatos(data) {
  return Model.obtenerDatos(data);
}
function actualizarDatos(data) {
  return Model.actualizarDatos(data);
}
function obtenerDescripcion(data) {
  return Model.obtenerDescripcion(data);
}
function actualizarDescripcion(data) {
  return Model.actualizarDescripcion(data);
}
function eliminarDescripcion(data) {
  return Model.eliminarDescripcion(data);
}
function guardarDescripcion(data) {
  return Model.guardarDescripcion(data);
}

module.exports = {
  obtenerDatos,
  actualizarDatos,
  obtenerDescripcion,
  actualizarDescripcion,
  eliminarDescripcion,
  guardarDescripcion,
};
