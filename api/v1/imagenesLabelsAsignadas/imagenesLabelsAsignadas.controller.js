const Model = require("./imagenesLabelsAsignadas.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function guardar(data) {
  return Model.guardar(data);
}
function actualizar(data) {
  return Model.actualizar(data);
}
function eliminar(data) {
  return Model.eliminar(data);
}

module.exports = {
  obtenerTodos,
  guardar,
  actualizar,
  eliminar,
};
