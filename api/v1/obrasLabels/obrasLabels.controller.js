const Model = require("./obrasLabels.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
function crearLabel(data) {
  return Model.crearLabel(data);
}
function obtenerTodosByObra(data) {
  return Model.obtenerTodosByObra(data);
}
function obtenerCantidadByObra(data) {
  return Model.obtenerCantidadByObra(data);
}

function agregarLabelObra(data) {
  return Model.agregarLabelObra(data);
}
function quitarLabelObra(data) {
  return Model.quitarLabelObra(data);
}
module.exports = {
  obtenerTodos,
  crearLabel,
  obtenerTodosByObra,
  agregarLabelObra,
  quitarLabelObra,
  obtenerCantidadByObra,
};
