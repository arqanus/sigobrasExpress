const winston = require("winston");
const config = require("../config");

/*
  Transportes disponibles: https://github.com/winstonjs/winston/blob/master/docs/transports.md

  Niveles de Logs:
  error: 0
  warn: 1
  info: 2
  verbose: 3
  debug: 4
  silly: 5
*/

module.exports = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: "warn",
      json: false,
      handleExceptions: true,
      maxsize: "100mb", // 5 MB
      maxFiles: 5,
      filename: `${__dirname}/../logs/logs-de-aplicacion.log`,
      prettyPrint: (object) => {
        return JSON.stringify(object);
      },
    }),
    new winston.transports.Console({
      level: config.suprimirLogs ? "error" : "debug",
      handleExceptions: true,
      json: false,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      prettyPrint: (object) => {
        return JSON.stringify(object);
      },
    }),
  ],
});
