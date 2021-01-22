const Joi = require("joi");
const log = require("../../../utils/logger");

const blueprintSectoresPublicos = Joi.object().keys({
  id_unidadEjecutora: Joi.string().regex(/^\d+$/),
  id_acceso: Joi.string(),
});

let validarEstructura = (req, res, next) => {
  const resultado = blueprintSectoresPublicos.validate(req.query, {
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
    log.info(erroresDeValidacion, req.query);
    res.status(400).send("estructura incorrecta");
  }
};

module.exports = {
  validarEstructura,
};
