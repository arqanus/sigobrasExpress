const Model = require("./avanceActividades.model");

function obtenerAvanceByComponente(data) {
  return Model.obtenerAvanceByComponente(data);
}
module.exports = {
  obtenerAvanceByComponente,
};
