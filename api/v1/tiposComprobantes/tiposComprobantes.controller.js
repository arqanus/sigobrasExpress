const Model = require("./tiposComprobantes.model");

function obtenerTodos(data) {
  return Model.obtenerTodos(data);
}

module.exports = { obtenerTodos };
