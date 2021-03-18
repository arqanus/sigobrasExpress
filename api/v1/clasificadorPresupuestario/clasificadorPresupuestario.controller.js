const Model = require("./clasificadorPresupuestario.model");

function obtenerDatos(data) {
  return Model.obtenerDatos(data);
}
function obtenerDatosAnalitico(data) {
  return Model.obtenerDatosAnalitico(data);
}
function predecirDatosAnalitico(data) {
  return Model.predecirDatosAnalitico(data);
}
module.exports = {
  obtenerDatos,
  obtenerDatosAnalitico,
  predecirDatosAnalitico,
};
