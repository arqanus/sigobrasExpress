const Model = require("./componentes.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
module.exports = {
  obtenerTodos,
};
