const log = require("../../utils/logger");
const { StatusCodes } = require("http-status-codes");
const Errors = require("./error");

exports.procesarErrores = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.procesarErroresDeDB = (err, req, res, next) => {
  if (err.sqlMessage) {
    log.error(`Ocurrió un error INTERNAL_SERVER_ERROR [${err.sqlMessage}] `);
    err.message = err.code;
    err.status = StatusCodes.INTERNAL_SERVER_ERROR;
  }
  next(err);
};

exports.procesarErroresDeTamanioDeBody = (err, req, res, next) => {
  if (err.status === 413) {
    log.error(
      `Request enviada a la aruta ${req.path} excedio el limite de tamanio. Reuqest no sera procesado`
    );
    err.message = `El body enviado en el request a la ruta ${req.path} pasa el limite de tamanio. Maximo tamanio permitido es ${err.limit} bytes.`;
  }
  next(err);
};

exports.erroresEnProducción = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
  });
};

exports.erroresEnDesarrollo = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    stack: err.stack || "",
  });
};
