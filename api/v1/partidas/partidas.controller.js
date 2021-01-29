const Model = require("./partidas.model");

function obtenerByComponente(data) {
  return Model.obtenerByComponente(data);
}
function obtenerTotalPartidas(data) {
  return Model.obtenerTotalPartidas(data);
}
function obtenerById(data) {
  return Model.obtenerById(data);
}
module.exports = {
  obtenerByComponente,
  obtenerTotalPartidas,
  obtenerById,
};
