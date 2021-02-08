const Model = require("./fuentesFinancieamiento.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function actualizarDatosLista(data) {
  return Model.actualizarDatosLista(data);
}
function eliminarById(data) {
  return Model.eliminarById(data);
}
module.exports = {
  obtenerTodos,
  actualizarDatosLista,
  eliminarById,
};
