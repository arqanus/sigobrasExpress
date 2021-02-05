const Model = require("./analitico.model");

function obtenerResumen(data) {
  return Model.obtenerResumen(data);
}
module.exports = {
  obtenerResumen,
};
