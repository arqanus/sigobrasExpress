const Model = require("./analitico.model");

function obtenerResumen(data) {
  return Model.obtenerResumen(data);
}
function actualizarResumen(data) {
  return Model.actualizarResumen(data);
}
function eliminarResumen(data) {
  return Model.eliminarResumen(data);
}
function actualizarResumenAnual(data) {
  return Model.actualizarResumenAnual(data);
}
function actualizarResumenMensual(data) {
  return Model.actualizarResumenMensual(data);
}
function obtenerPresupuestAnalitico(data) {
  return Model.obtenerPresupuestAnalitico(data);
}
function actualizarPresupuestAnalitico(data) {
  return Model.actualizarPresupuestAnalitico(data);
}
function actualizarPresupuestAnaliticoMonto(data) {
  return Model.actualizarPresupuestAnaliticoMonto(data);
}
function obtenerPresupuestAnaliticoAnyos(data) {
  return Model.obtenerPresupuestAnaliticoAnyos(data);
}
function obtenerPresupuestAnaliticoAvanceAnual(data) {
  return Model.obtenerPresupuestAnaliticoAvanceAnual(data);
}
function obtenerPresupuestAnaliticoAvanceMensual(data) {
  return Model.obtenerPresupuestAnaliticoAvanceMensual(data);
}
function actualizarAvanceAnualMonto(data) {
  return Model.actualizarAvanceAnualMonto(data);
}
function actualizarAvanceMensualMonto(data) {
  return Model.actualizarAvanceMensualMonto(data);
}
function getAllidsByObra(data) {
  return Model.getAllidsByObra(data);
}
function obtenerPresupuestAnaliticoPimAsignado(data) {
  return Model.obtenerPresupuestAnaliticoPimAsignado(data);
}
function actualizarPim(data) {
  return Model.actualizarPim(data);
}
function getDataEspecifica(data) {
  return Model.getDataEspecifica(data);
}
function eliminarEspecifica(data) {
  return Model.eliminarEspecifica(data);
}
module.exports = {
  obtenerResumen,
  actualizarResumen,
  eliminarResumen,
  actualizarResumenAnual,
  actualizarResumenMensual,
  obtenerPresupuestAnalitico,
  actualizarPresupuestAnalitico,
  actualizarPresupuestAnaliticoMonto,
  obtenerPresupuestAnaliticoAnyos,
  obtenerPresupuestAnaliticoAvanceAnual,
  obtenerPresupuestAnaliticoAvanceMensual,
  actualizarAvanceAnualMonto,
  actualizarAvanceMensualMonto,
  getAllidsByObra,
  obtenerPresupuestAnaliticoPimAsignado,
  actualizarPim,
  getDataEspecifica,
  eliminarEspecifica,
};
