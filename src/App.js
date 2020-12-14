
const morgan = require('morgan');
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');
var path = require('path');

const cors = require('cors');

const socket = require('socket.io');

var fs = require('fs');
var https = require('https');
const express = require('express');
var app = express();
const PORT = process.env.PORT || 9000
var compression = require('compression');
app.use(cors())
//settings
app.set('port', PORT);

//middleares
app.use(morgan('dev'));
//entender jason
app.use(bodyParser.json({ limit: '50mb' }));
morganBody(app);

//use compression 
app.use(compression());
//static
app.use('/static', express.static(__dirname + '/public'));
//apis reusables
require('./api/Reusable/r.avances')(app);
require('./api/Reusable/r.datosGenerales')(app);

//apis notificacioanes
require('./api/Notificaciones/r.notificaciones')(app);

//interf gerencial
require('./api/InterfazGerencial/get/routes/r.get.InterfazGerencial')(app);
//routes Admin
require('./api/Admin/get/routes/r.get.obras')(app);
require('./api/Admin/get/routes/r.get.users')(app);
require('./api/Admin/post/routes/r.post.obras')(app);
require('./api/Admin/post/routes/r.post.users')(app);
require('./api/Admin/put/routes/r.put.users')(app);
require('./api/Admin/delete/routes/r.delete.obras')(app);
require('./api/Admin/routes/r.obra')(app);


require('./api/Interfaz/post/routes/r.post.interfaz')(app);
require('./api/Interfaz/get/routes/r.get.interfaz')(app);
require('./api/Interfaz/put/routes/r.put.interfaz')(app);

require('./api/Inicio/get/routes/r.get.Inicio')(app);
require('./api/Inicio/post/routes/r.post.Inicio')(app);
require('./api/Inicio/delete/routes/r.del.Inicio')(app);

require('./api/ProcesosFisicos/get/routes/r.get.historial')(app);
require('./api/ProcesosFisicos/get/routes/r.get.historialImagenes')(app);
require('./api/ProcesosFisicos/get/routes/r.get.materiales')(app);
require('./api/ProcesosFisicos/get/routes/r.get.pFisicos')(app);
require('./api/ProcesosFisicos/get/routes/r.get.valGeneral')(app);
require('./api/ProcesosFisicos/get/routes/r.get.gantt')(app);
require('./api/ProcesosFisicos/get/routes/r.get.dificultades')(app);
require('./api/ProcesosFisicos/Valorizaciones/routes/r.valorizacionPrincipal')(app);


require('./api/ProcesosFisicos/post/routes/r.post.pFisicos')(app);
require('./api/ProcesosFisicos/put/routes/r.put.pFisicos')(app);


require('./api/ProcesosFinancieros/post/routes/r.post.Pfinancieros')(app);
require('./api/ProcesosFinancieros/get/routes/r.get.Pfinancieros')(app);

require('./api/Reportes/get/routes/r.get.reportes')(app);
require('./api/Reportes/post/routes/r.post.reportes')(app);

require('./api/GestionTareas/get/routes/r.get.GT')(app);
require('./api/GestionTareas/post/routes/r.post.GT')(app);
require('./api/GestionTareas/put/routes/r.put.GT')(app);

////////////////////////////////////////////////////////////////////////////
require('./api/Planner/get/routes/r.get.Proyeccion')(app);

//procesos gerenciales

require('./api/ProcesosGerenciales/get/routes/r.get.comunicados')(app);
require('./api/ProcesosGerenciales/get/routes/r.get.recursospersonal')(app);
require('./api/ProcesosGerenciales/get/routes/r.get.infobras')(app);
require('./api/ProcesosGerenciales/get/routes/r.get.plazos')(app);
require('./api/ProcesosGerenciales/get/routes/r.get.curvaS')(app);
//gestion documentaria
require('./api/GestionDocumentaria/routes/r.gestionDocumentaria')(app);
//defecto
const server = app.listen(app.get('port'), () => {
  console.log('running in port', PORT);
})

// Set up socket.io
const io = socket(server);
let online = 0;

io.on('connection', (socket) => {
  online++;
  console.log(`Socket ${socket.id} connected.`);
  console.log(`Online: ${online}`);
  io.emit('visitors', online);
  socket.on("tareas_comentarios", (data) => {
    console.log(data);
    console.log("id_tarea", data.id_tarea);
    socket.broadcast.emit(data.id_tarea, data.data)
    // io.emit(data.id_tarea, data.data)
  }
  );
  socket.on('disconnect', () => {
    online--;
    console.log(`Socket ${socket.id} disconnected.`);
    console.log(`Online: ${online}`);
    io.emit('visitor exits', online);
  });
  socket.on("partidas_comentarios_post", (data) => {
    console.log("data", data);
    socket.broadcast.emit("partidas_comentarios_get-" + data.id_partida, data.id_partida)
    socket.broadcast.emit("partidas_comentarios_novistos_get-" + data.id_partida, data.id_partida)
  });
  socket.on("partidas_comentarios_notificacion_post", (data) => {
    console.log("data", data);
    socket.broadcast.emit("partidas_comentarios_notificacion_get-" + data.id_componente, data.id_componente)
  });
  socket.on("componentes_comentarios_notificacion_post", (data) => {
    console.log("data", data);
    socket.broadcast.emit("componentes_comentarios_notificacion_get-" + data.id_ficha, data.id_ficha)
  });
  socket.on("dificultades_comentarios_post", (data) => {
    console.log("data", data);
    socket.broadcast.emit("dificultades_comentarios_get-" + data.id_dificultad, data.id_dificultad)
  });
  socket.on("gestion_documentaria_principal", (data) => {
    console.log("data", data);
    socket.broadcast.emit("gestion_documentaria_" + data.id_ficha)
  });
  socket.on("gestion_documentaria_mensaje_principal", (data) => {
    console.log("data", data);
    socket.broadcast.emit("gestion_documentaria_mensaje" + data.id_mensaje)
  });

});