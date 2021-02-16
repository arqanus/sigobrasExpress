const Model = require("./designaciones.model");

function obtenerTodosByCargo(data) {
  return Model.obtenerTodosByCargo(data);
}
function actualizarById(data) {
  return Model.actualizarById(data);
}

module.exports = {
  obtenerTodosByCargo,
  actualizarById,
};
