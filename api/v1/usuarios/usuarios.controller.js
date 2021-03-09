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
function obtenerUsuarioPorDNI(data) {
  return Model.obtenerUsuarioPorDNI(data);
}
function guardarUsuario(data) {
  return Model.guardarUsuario(data);
}
module.exports = {
  obtenerTodos,
  actualizarHabilitadoObra,
  actualizarTodo,
  obtenerUsuarioByIdAcceso,
  ingresarUsuario,
  obtenerUsuariosByIdCargo,
  obtenerUsuarioPorDNI,
  guardarUsuario,
};
