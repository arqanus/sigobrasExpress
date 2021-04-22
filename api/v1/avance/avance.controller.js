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
function obtenerCuadroMetrados(data) {
  return Model.obtenerCuadroMetrados(data);
}
function obtenerCuadroMetradosResumen(data) {
  return Model.obtenerCuadroMetradosResumen(data);
}
function avanceMetrados(data) {
  return Model.avanceMetrados(data);
}
function obtenerRecursosNombres(data) {
  return Model.obtenerRecursosNombres(data);
}
function recursosParcial(data) {
  return Model.recursosParcial(data);
}
function eliminarImagen(data) {
  return Model.eliminarImagen(data);
}
module.exports = {
  obtenerAvanceByComponente,
  obtenerAvanceResumenAnual,
  obtenerAvanceAcumuladoAnual,
  obtenerValorizacionPartidas,
  obtenerCuadroMetrados,
  obtenerCuadroMetradosResumen,
  avanceMetrados,
  obtenerRecursosNombres,
  recursosParcial,
  eliminarImagen,
};
