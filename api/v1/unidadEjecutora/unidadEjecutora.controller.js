const Model = require("./unidadEjecutora.model");

function obtenerTodosPublico(data) {
  return Model.obtenerTodosPublico(data);
}
module.exports = {
  obtenerTodosPublico,
};
