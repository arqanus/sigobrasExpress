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
function obtenerUsuarioByIdAcceso(data) {
  return Model.obtenerUsuarioByIdAcceso(data);
}
function obtenerUsuarioByIdAcceso(data) {
  return Model.obtenerUsuarioByIdAcceso(data);
}
function ingresarUsuario(data) {
  return Model.ingresarUsuario(data);
}
function obtenerUsuariosByIdCargo(data) {
  return Model.obtenerUsuariosByIdCargo(data);
}
module.exports = {
  obtenerTodos,
  actualizarHabilitadoObra,
  actualizarTodo,
  obtenerUsuarioByIdAcceso,
  ingresarUsuario,
  obtenerUsuariosByIdCargo,
};
