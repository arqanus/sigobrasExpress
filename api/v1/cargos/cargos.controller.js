const Model = require("./cargos.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function obtenerTodosByObra(data) {
  return Model.obtenerTodosByObra(data);
}

module.exports = {
  obtenerTodos,
  obtenerTodosByObra,
};
