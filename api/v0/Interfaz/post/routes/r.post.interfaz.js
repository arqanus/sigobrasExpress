const User = require("../models/m.post.interfaz");

module.exports = function (app) {
  app.post("/ActualizarEstado", async (req, res) => {
    try {
      var id = await User.postHistorialEstados(req.body);
      var response = await User.getestadoIdHistorialEstados(id);
      req.body.id = id;
      console.log("body", req.body);
      await User.updateFichasDataAutomatica(req.body);
      res.json(response);
    } catch (error) {
      console.log(error);
      res.json(error.code);
    }
  });
  app.post("/postHistorialEstadosObra", (req, res) => {
    User.postHistorialEstadosObra(req.body, (err, data) => {
      if (err) {
        res.status(204).json(err);
      } else {
        res.json(data);
      }
    });
  });
};
