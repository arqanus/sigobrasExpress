const Joi = require("joi");
const log = require("../../../utils/logger");

const blueprintUsuario = Joi.object().keys({
  usuario: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).max(200).required(),
  id_cargo: Joi.required(),
  id_usuario: Joi.required(),
});

let validarUsuario = (req, res, next) => {
  let resultado = blueprintUsuario.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (resultado.error == undefined) {
    next();
  } else {
    let erroresDeValidacion = resultado.error.details.reduce(
      (acumulador, error) => {
        return acumulador + `[${error.message}]`;
      },
      ""
    );
    log.info(
      "Producto falló la validación",
      resultado.error.details.map((error) => error.message)
    );
    res
      .status(400)
      .send(
        `El usuario en el body debe especificar usuario y password. Errores en tu request: [${erroresDeValidacion}]`
      );
  }
};

const blueprintPedidoDeLogin = Joi.object().keys({
  usuario: Joi.string().required(),
  password: Joi.string().required(),
});

let validarPedidoDeLogin = (req, res, next) => {
  const resultado = blueprintPedidoDeLogin.validate(req.body, {
    abortEarly: false,
    convert: false,
  });
  if (resultado.error === undefined) {
    next();
  } else {
    let erroresDeValidacion = resultado.error.details.reduce(
      (acumulador, error) => {
        return acumulador + `[${error.message}]`;
      },
      ""
    );
    log.info(erroresDeValidacion);
    res
      .status(400)
      .send(
        "Login falló. Debes especificar el usuario y contraseña del usuario. Ambos deben strings."
      );
  }
};

module.exports = {
  validarPedidoDeLogin,
  validarUsuario,
};
