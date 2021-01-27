const Model = require("./usuarios.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function actualizarHabilitadoObra(data) {
  return Model.actualizarHabilitadoObra(data);
}
function actualizarTodo(data) {
  return Model.actualizarTodo(data);
}
module.exports = {
  obtenerTodos,
  actualizarHabilitadoObra,
  actualizarTodo,
};
