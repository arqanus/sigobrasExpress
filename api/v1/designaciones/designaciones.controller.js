const Model = require("./designaciones.model");

function obtenerTodosByCargo(data) {
  return Model.obtenerTodosByCargo(data);
}
function actualizarById(data) {
  return Model.actualizarById(data);
}
function guardarDesignacion(data) {
  return Model.guardarDesignacion(data);
}
module.exports = {
  obtenerTodosByCargo,
  actualizarById,
  guardarDesignacion,
};
