const Model = require("./obrasEstados.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
module.exports = {
  obtenerTodos,
};
