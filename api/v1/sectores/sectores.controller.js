const Model = require("./sectores.model");

function obtenerTodosPublico(data) {
  return Model.obtenerTodosPublico(data);
}
module.exports = {
  obtenerTodosPublico,
};
