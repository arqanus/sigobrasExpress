const Model = require("./partidasImagenes.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}

function obtenerTodosTotal(data) {
  return Model.obtenerTodosTotal(data);
}
function obtenerTodosTotalFechas(data) {
  return Model.obtenerTodosTotalFechas(data);
}
function obtenerTodosAnyoMeses(data) {
  return Model.obtenerTodosAnyoMeses(data);
}
function obtenerComponentes(data) {
  return Model.obtenerComponentes(data);
}
function dataById(data) {
  return Model.dataById(data);
}
function eliminarImagen(data) {
  return Model.eliminarImagen(data);
}

module.exports = {
  obtenerTodos,
  obtenerTodosTotal,
  obtenerTodosTotalFechas,
  obtenerTodosAnyoMeses,
  obtenerComponentes,
  dataById,
  eliminarImagen,
};
