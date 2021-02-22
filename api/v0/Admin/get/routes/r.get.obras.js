const User = require("../models/m.get.obras");

module.exports = function (app) {
  app.post("/listaObras", async (req, res) => {
    try {
      var obras = await User.getObras(req.body);
      res.json(obras);
    } catch (error) {
      console.log(error);
      res.status(400).json(error.code);
    }
  });
  app.post("/getObra", async (req, res) => {
    try {
      var data = await User.getObra(req.body.id_ficha);
      res.json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/getComponentesPartidasTotal", async (req, res) => {
    try {
      var data = await User.getComponentesPartidasTotal(req.body);
      res.json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.get("/listaEstados", async (req, res) => {
    try {
      var estados = await User.getEstados();
      res.json(estados);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/listaComponentesPorId", async (req, res) => {
    try {
      var componentes = await User.getComponentesById(req.body.id_ficha);
      res.json(componentes);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.get("/getUnidadEjecutoras", async (req, res) => {
    try {
      var unidadesEjecutoras = await User.getUnidadEjecutora();
      res.json(unidadesEjecutoras);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.get("/getTipoAdministracion", async (req, res) => {
    try {
      var unidadesEjecutoras = await User.getTipoAdministracion();
      res.json(unidadesEjecutoras);
    } catch (error) {
      console.log(error);
      res.status(400).json(error.code);
    }
  });
  app.post("/getPartidasPorObra", async (req, res) => {
    try {
      var partidasporObra = await User.getPartidasPorObra(req.body.id_ficha);
      res.json(partidasporObra);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/getHistorialEstados", async (req, res) => {
    try {
      var historialEstados = await User.getHistorialEstados(req.body.id_ficha);
      res.json(historialEstados);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/getPersonalObra", async (req, res) => {
    try {
      var getPersonalObra = await User.getPersonalObra(req.body.id_ficha);
      res.json(getPersonalObra);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/getValGeneralTodosComponentes", async (req, res) => {
    try {
      var getValGeneralTodosComponentes = await User.getValGeneralTodosComponentes(
        req.body.id_ficha,
        req.body.fecha_inicial,
        req.body.fecha_final
      );
      res.json(getValGeneralTodosComponentes);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/getComponentesPartidasIngresadas", async (req, res) => {
    try {
      var data = await User.getComponentesPartidasIngresadas(req.body.id_ficha);
      res.json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/getCostosPresupuestales", async (req, res) => {
    try {
      var data = await User.getCostosPresupuestales(req.body.id_ficha);
      res.json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/getCostosPresupuestalesMontos", async (req, res) => {
    try {
      var data = await User.getCostosPresupuestalesMontos(req.body.id_ficha);
      res.json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/getResoluciones", async (req, res) => {
    try {
      var data = await User.getResoluciones(req.body.id_ficha);
      res.json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/getHistorialByFechas", async (req, res) => {
    try {
      var { id_componente, fecha_ini, fecha_fin } = req.body;
      var data = await User.getHistorialByFechas(
        id_componente,
        fecha_ini,
        fecha_fin
      );
      res.json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  //////////////////////////////////////////////////////////////////////////////////////////////////
  app.get("/prueba", async (req, res) => {
    try {
      var data = await User.prueba();
      res.json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/updateActividadesParcial", async (req, res) => {
    try {
      var data = await User.updateActividadesParcial(req.body);
      var data2 = await User.updatePartidasMetrado(req.body);
      res.json(data2);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.get("/partidasAll", async (req, res) => {
    try {
      var data = await User.getpartidasAll(req.query);
      res.json(data);
    } catch (error) {
      res.status(400).json(error);
    }
  });
};
