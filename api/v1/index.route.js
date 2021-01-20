const accesos = require("./accesos/accesos.routes");
const obras = require("./obras/obras.routes");
const unidadEjecutora = require("./unidadEjecutora/unidadEjecutora.routes");
const sectores = require("./sectores/sectores.routes");
const obrasComunicados = require("./obrasComunicados/obrasComunicados.routes");
const componentes = require("./componentes/componentes.routes");

const express = require("express");
const router = express.Router();

router.use("/accesos", accesos);
router.use("/obras", obras);
router.use("/unidadEjecutora", unidadEjecutora);
router.use("/sectores", sectores);
router.use("/obrasComunicados", obrasComunicados);
router.use("/componentes", componentes);

module.exports = router;
