const Model = require("./analiticoCostos.model");

function obtenerCostos(data) {
  return Model.obtenerCostos(data);
}
function guardarCostos(data) {
  return Model.guardarCostos(data);
}
function asignarCostosObra(data) {
  return Model.asignarCostosObra(data);
}
function predecirCostos(data) {
  return Model.predecirCostos(data);
}
module.exports = {
  obtenerCostos,
  guardarCostos,
  asignarCostosObra,
  predecirCostos,
};
