const Model = require("./tiposComprobantesAsignados.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function predecir(data) {
  return Model.predecir(data);
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

module.exports = { obtenerTodos, predecir, guardar, eliminar, actualizar };
