const Model = require("./avanceActividades.model");

function avanceObra(data) {
  return Model.avanceObra(data);
}
module.exports = {
  avanceObra,
};
