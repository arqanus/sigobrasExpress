const Model = require("./presupuestosAprobados.model");

function obtenerPresupuestosAprobados(data) {
  return Model.obtenerPresupuestosAprobados(data);
}
function guardarPresupuestoAprobado(data) {
  return Model.guardarPresupuestoAprobado(data);
}
function actualizarPresupuestoAprobado(data) {
  return Model.actualizarPresupuestoAprobado(data);
}
module.exports = {
  obtenerPresupuestosAprobados,
  guardarPresupuestoAprobado,
  actualizarPresupuestoAprobado,
};
