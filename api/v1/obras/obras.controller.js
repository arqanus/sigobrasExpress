const Model = require("./obras.model");

function obtenerTodosPublico(data) {
  return Model.obtenerTodosPublico(data);
}
module.exports = {
  obtenerTodosPublico,
};
