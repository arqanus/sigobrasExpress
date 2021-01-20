const passportJWT = require("passport-jwt");

const log = require("../../utils/logger");
const config = require("../../config");
const accesoController = require("../v1/accesos/accesos.controller");

let jwtOption = {
  secretOrKey: config.jwt.secreto,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = new passportJWT.Strategy(jwtOption, (jwtPayload, next) => {
  accesoController
    .obtenerById({ id_acceso: jwtPayload.id })
    .then((usuario) => {
      if (!usuario) {
        log.info(
          `JWT token no es valido. Usuario con id ${jwtPayload.id} no existe`
        );
        next(null, false);
        return;
      }
      log.info(`Usuario ${usuario.usuario}  suministro un token valido`);
      next(null, {
        usuario: usuario.usuario,
        id_acceso: usuario.id_acceso,
      });
    })
    .catch((err) => {
      log.error("Error ocurrio al tratar de validar un token", err);
      next(err);
    });
});
