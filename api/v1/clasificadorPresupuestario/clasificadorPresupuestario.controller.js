const Model = require("./clasificadorPresupuestario.model");

function obtenerDatos(data) {
  return Model.obtenerDatos(data);
}
module.exports = {
  obtenerDatos,
};
