const Accesos = require("./accesos.model");

function obtenerTodos() {
  return Accesos.obtenerTodos();
}
function existe(data) {
  return Accesos.existe(data);
}
function crear(data) {
  return Accesos.crear(data);
}
function obtenerUno(data) {
  return Accesos.obtenerUno(data);
}
function obtenerById(data) {
  return Accesos.obtenerById(data);
}
function asignarObra(data) {
  return Accesos.asignarObra(data);
}
function obtenerLastId(data) {
  return Accesos.obtenerLastId(data);
}
module.exports = {
  obtenerTodos,
  existe,
  crear,
  obtenerUno,
  obtenerById,
  asignarObra,
  obtenerLastId,
};
