const User = require("../models/m.get.dificultades");
const tools = require("../../../../../utils/format");
var fs = require("fs");
var formidable = require("formidable");
module.exports = (app) => {
  app.post("/getDificultades", async (req, res) => {
    try {
      var data = await User.getDificultades(req.body.id_ficha, req.body.tipo);
      res.json(data);
    } catch (error) {
      res.status(200).json(error);
    }
  });
  app.post("/postDificultades", async (req, res) => {
    try {
      var data = await User.postDificultades(req.body);
      console.log(data);
      if (data.affectedRows > 0) {
        res.json({ message: "registro exitoso" });
      } else {
        throw { message: "problema al registrar" };
      }
    } catch (error) {
      console.log(error);
      res.status(204).json({ message: "problema al registrar" });
    }
  });

  app.post("/getDificultadesComentarios", async (req, res) => {
    try {
      var data = await User.getDificultadesComentarios(
        req.body.dificultades_id
      );
      res.json(data);
    } catch (error) {
      console.log({ error });
      res.status(204).json(error);
    }
  });
  app.post("/postDificultadesComentarios", async (req, res) => {
    try {
      var data = await User.postDificultadesComentarios(
        req.body.comentario,
        req.body.dificultades_id,
        req.body.accesos_id_acceso
      );
      res.json(data);
    } catch (error) {
      console.log({ error });
      res.status(204).json(error);
    }
  });
  app.post("/postDificultadesComentariosVistos", async (req, res) => {
    try {
      var req_comentariosNoVistos = await User.getDificultadesComentariosNoVistos(
        req.body.id_acceso,
        req.body.id_dificultad
      );
      var idComentariosNoVistos = [];
      console.log(
        "datos",
        req.body.id_acceso,
        req.body.id_dificultad,
        req_comentariosNoVistos
      );

      req_comentariosNoVistos.forEach((element) => {
        idComentariosNoVistos.push([req.body.id_acceso, element.id]);
      });
      console.log(idComentariosNoVistos);
      if (idComentariosNoVistos.length > 0) {
        var req_comentariosVistos = await User.postDificultadesComentariosVistos(
          idComentariosNoVistos
        );
      }
      res.json({ message: "mensajes visteados exitosamente" });
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
  app.post("/getDificultadesComentariosNoVistosFicha", async (req, res) => {
    try {
      var data = await User.getDificultadesComentariosNoVistosFicha(
        req.body.id_acceso,
        req.body.id_ficha,
        req.body.tipo
      );
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(204).json(error);
    }
  });
};
