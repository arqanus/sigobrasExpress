const Model = require("./interfazPermisos.model");

function obtenerDatos(data) {
  return Model.obtenerDatos(data);
}
function actualizarDatos(data) {
  return Model.actualizarDatos(data);
}
function obtenerPermisoInterfaz(data) {
  return Model.obtenerPermisoInterfaz(data);
}
module.exports = {
  obtenerDatos,
  actualizarDatos,
  obtenerPermisoInterfaz,
};
