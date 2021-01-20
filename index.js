const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morganBody = require("morgan-body");
const express = require("express");
require("dotenv").config();

const pool = require("./config/db.config");
const errorHandler = require("./api/libs/errorHandler");
const config = require("./config");
const logger = require("./utils/logger");
const authJWT = require("./api/libs/auth");
const v1 = require("./api/v1/index.route");

const app = express();

const passport = require("passport");
passport.use(authJWT);

// compressing api response
app.use(compression());

// logger
app.use(morgan("dev"));
// logger body
morganBody(app);

//cors enable
app.use(cors());

// security config
app.use(helmet());

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  morgan("short", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

//passport config
app.use(passport.initialize());

// database connection
pool.query(`USE ${process.env.DATABASE}`);
global.pool = pool;

//public folder
global.publicFolder = __dirname + "/public/";

// old routes
require("./api/v0/index.route")(app);

//v1 api
app.use("/v1", v1);

// port initialized
const PORT = process.env.PORT || 9000;

//static
app.use("/static", express.static("public"));

app.use(errorHandler.procesarErroresDeDB);
app.use(errorHandler.procesarErroresDeTamanioDeBody);
if (process.env.NODE_ENV === "prod") {
  app.use(errorHandler.erroresEnProducción);
} else {
  app.use(errorHandler.erroresEnDesarrollo);
}

const server = app.listen(PORT, () => {
  console.log("running in port", PORT);
});
// sockets
require("./services/socket")(server);
module.exports = {
  app,
  server,
};
