const Model = require("./obras.model");

function obtenerTodosPublico(data) {
  return Model.obtenerTodosPublico(data);
}
function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function obtenerTodosResumen(data) {
  return Model.obtenerTodosResumen(data);
}
module.exports = {
  obtenerTodosPublico,
  obtenerTodos,
  obtenerTodosResumen,
};
