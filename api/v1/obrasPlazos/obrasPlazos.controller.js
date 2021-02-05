const Model = require("./obrasPlazos.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
module.exports = {
  obtenerTodos,
};
