const Model = require("./componentes.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function costoDirecto(data) {
  return Model.costoDirecto(data);
}
module.exports = {
  obtenerTodos,
  costoDirecto,
};
