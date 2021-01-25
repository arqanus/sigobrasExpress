const Model = require("./obrasAmpliacionesPresupuesto.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
module.exports = {
  obtenerTodos,
};
