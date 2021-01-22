const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const log = require("../../../utils/logger");
const validarUsuario = require("./accesos.validate").validarUsuario;
const validarPedidoDeLogin = require("./accesos.validate").validarPedidoDeLogin;
const config = require("../../../config");
const accesoController = require("./accesos.controller");

const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const {
  DatosDeUsuarioYaEnUso,
  CredencialesIncorrectas,
} = require("./accesos.error");

const accesosRouter = express.Router();

function transformarBodyALowercase(req, res, next) {
  req.body.usuario && (req.body.usuario = req.body.usuario.toLowerCase());
  next();
}
accesosRouter.get(
  "/",
  procesarErrores(async (req, res) => {
    var response = await accesoController.obtenerTodos();
    res.json(response);
  })
);
accesosRouter.post(
  "/",
  [validarUsuario, transformarBodyALowercase],
  procesarErrores(async (req, res) => {
    let nuevoUsuario = req.body;
    var usuarioExiste = await accesoController.existe(nuevoUsuario);
    if (usuarioExiste) {
      log.warn(
        `username [${nuevoUsuario.username}] ya existen en la base de datos`
      );
      throw new DatosDeUsuarioYaEnUso();
    } else {
      var hash = await bcrypt.hash(nuevoUsuario.password, 10);
      await accesoController.crear({
        ...nuevoUsuario,
        hash,
      });
      res.status(201).send("Usuario creado exitósamente.");
    }
  })
);
accesosRouter.post(
  "/login",
  [validarPedidoDeLogin, transformarBodyALowercase],
  procesarErrores(async (req, res) => {
    let usuarioNoAutenticado = req.body;

    let usuarioRegistrado = await accesoController.obtenerUno(
      usuarioNoAutenticado
    );
    if (!usuarioRegistrado) {
      log.info(
        `Usuario [${usuarioNoAutenticado.usuario}] no existe. No pudo ser autenticado`
      );
      throw new CredencialesIncorrectas();
    }

    let passwordCorrecto = await bcrypt.compare(
      usuarioNoAutenticado.password,
      usuarioRegistrado.password
    );
    if (passwordCorrecto) {
      let token = jwt.sign(
        { id: usuarioRegistrado.id_acceso },
        config.jwt.secreto,
        {
          expiresIn: config.jwt.tiempoDeExpiración,
        }
      );
      log.info(
        `Usuario ${usuarioNoAutenticado.usuario} completo autenticación exitosamente.`
      );
      res.status(200).json({ token, id_acceso: usuarioRegistrado.id_acceso });
    } else {
      log.info(
        `Usuario ${usuarioNoAutenticado.usuario} no completo autenticación. Contraseña incorrecta`
      );
      throw new CredencialesIncorrectas();
    }
  })
);
accesosRouter.put(
  "/",
  [validarUsuario, transformarBodyALowercase],
  procesarErrores(async (req, res) => {
    let nuevoUsuario = req.body;
    var usuarioExiste = await accesoController.existe(nuevoUsuario);
    if (usuarioExiste) {
      log.warn(
        `username [${nuevoUsuario.username}] ya existen en la base de datos`
      );
      throw new DatosDeUsuarioYaEnUso();
    } else {
      var hash = await bcrypt.hash(nuevoUsuario.password, 10);
      await accesoController.crear({
        ...nuevoUsuario,
        hash,
      });
      res.status(201).send("Usuario creado exitósamente.");
    }
  })
);
module.exports = accesosRouter;
