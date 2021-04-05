const Model = require("./avance.model");

function obtenerAvanceByComponente(data) {
  return Model.obtenerAvanceByComponente(data);
}
function obtenerAvanceResumenAnual(data) {
  return Model.obtenerAvanceResumenAnual(data);
}
function obtenerAvanceAcumuladoAnual(data) {
  return Model.obtenerAvanceAcumuladoAnual(data);
}
function obtenerValorizacionPartidas(data) {
  return Model.obtenerValorizacionPartidas(data);
}
module.exports = {
  obtenerAvanceByComponente,
  obtenerAvanceResumenAnual,
  obtenerAvanceAcumuladoAnual,
  obtenerValorizacionPartidas,
};
