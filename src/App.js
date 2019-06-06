
const morgan = require('morgan');
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');
var path = require('path');

const cors =require('cors');

const socket = require('socket.io');

var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync(path.resolve(__dirname + '/sslcert/server.key'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname + '/sslcert/server.cert'), 'utf8');

var credentials = {key: privateKey, cert: certificate};
const express = require('express');
var app = express();

const PORT = process.env.PORT || 9002


//open cors
var whitelist = ['http://localhost:9009']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
// app.use(cors(corsOptions))
app.use(cors())
//settings
app.set('port',PORT);

//middleares
app.use(morgan('dev'));
	//entender jason
app.use(bodyParser.json({limit: '1mb'}));
morganBody(app);

//static
app.use('/static', express.static(__dirname + '/public'));
 
//routes 
require('./api/Admin/get/routes/r.get.obras')(app);
require('./api/Admin/get/routes/r.get.users')(app);
require('./api/Admin/post/routes/r.post.obras')(app);
require('./api/Admin/post/routes/r.post.users')(app);
require('./api/Admin/put/routes/r.put.users')(app);
require('./api/Admin/delete/routes/r.delete.obras')(app);


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


require('./api/ProcesosFisicos/post/routes/r.post.pFisicos')(app);
require('./api/ProcesosFisicos/put/routes/r.put.pFisicos')(app);


require('./api/ProcesosFinancieros/post/routes/r.post.Pfinancieros')(app);
require('./api/ProcesosFinancieros/get/routes/r.get.Pfinancieros')(app);

require('./api/Reportes/get/routes/r.get.reportes')(app);
require('./api/Reportes/post/routes/r.post.reportes')(app);

require('./api/GestionTareas/get/routes/r.get.GT')(app);
require('./api/GestionTareas/post/routes/r.post.GT')(app);
require('./api/GestionTareas/put/routes/r.put.GT')(app);

// var server = https.createServer(credentials, app).listen(PORT, () => {
//   console.log('Listening...',PORT)
// })



//defecto
const server = app.listen(app.get('port'),()=>{
	console.log('running in port', PORT);
})
// // set up a route to redirect http to https
// app.get('*', (req, res) =>{  
//   res.redirect('https://localhost:10000' + req.url);
// })
// var server = https.createServer(credentials, app).listen(9000, () => {
//   console.log('Listening...',PORT)
// })



// Set up socket.io
const io = socket(server);
let online = 0;


io.on('connection', (socket) => {
  online++;
  console.log(`Socket ${socket.id} connected.`);
  console.log(`Online: ${online}`);
  io.emit('visitors', online);
  socket.on("tareas_comentarios", (data) => {
    Tareas_online++
    console.log(data);
    console.log("id_tarea",data.id_tarea);
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
});