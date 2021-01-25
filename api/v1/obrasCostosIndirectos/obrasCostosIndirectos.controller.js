const Model = require("./obrasCostosIndirectos.model");

function obtenerTodosFromAmpliaciones(data, ampliaciones) {
  return Model.obtenerTodosFromAmpliaciones(data, ampliaciones);
}
module.exports = {
  obtenerTodosFromAmpliaciones,
};
