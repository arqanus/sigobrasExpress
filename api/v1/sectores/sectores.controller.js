const Model = require("./sectores.model");

function obtenerTodosPublico(data) {
  return Model.obtenerTodosPublico(data);
}
function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
module.exports = {
  obtenerTodosPublico,
  obtenerTodos,
};
