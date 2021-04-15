const Model = require("./comprobantesAsignados.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function guardar(data) {
  return Model.guardar(data);
}
function eliminar(data) {
  return Model.eliminar(data);
}
function actualizar(data) {
  return Model.actualizar(data);
}
function avanceMensual(data) {
  return Model.avanceMensual(data);
}

module.exports = { obtenerTodos, guardar, eliminar, actualizar, avanceMensual };
