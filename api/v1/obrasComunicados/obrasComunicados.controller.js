const Model = require("./obrasComunicados.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}
module.exports = {
  obtenerTodos,
};
