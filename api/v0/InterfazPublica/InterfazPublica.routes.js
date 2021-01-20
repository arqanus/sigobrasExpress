const User = require("./InterfazPublica.model");
module.exports = function (app) {
  app.get("/obras/publicas", async (req, res) => {
    try {
      res.json("exito");
    } catch (error) {
      res.status(500).json({ message: "error" });
    }
  });
};
