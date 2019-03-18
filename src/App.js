const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');

const cors =require('cors');

const PORT = process.env.PORT || 9000


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
app.use(bodyParser.json({limit: '200kb'}));
morganBody(app);
 
//routes 
require('./api/Admin/get/routes/r.get.obras')(app);
require('./api/Admin/get/routes/r.get.users')(app);
require('./api/Admin/post/routes/r.post.obras')(app);
require('./api/Admin/post/routes/r.post.users')(app);
require('./api/ProcesosFisicos/get/routes/r.get.pFisicos')(app);
require('./api/ProcesosFisicos/post/routes/r.post.pFisicos')(app);
require('./api/Interfaz/post/routes/r.post.interfaz')(app);
require('./api/Interfaz/get/routes/r.get.interfaz')(app);
require('./api/ProcesosGerenciales/get/routes/r.get.Pgerenciales')(app);
require('./api/Reportes/get/routes/r.get.reportes')(app);
require('./api/Reportes/post/routes/r.post.reportes')(app);
require('./api/ProcesosFinancieros/post/routes/r.post.Pfinancieros')(app);
require('./api/ProcesosFinancieros/get/routes/r.get.Pfinancieros')(app);

// require('./routes/rutasProcesosIniciales')(app);
// require('./routes/rutasProcesosGerenciales')(app);
// require('./routes/rutasProcesosFisicos')(app);
// require('./routes/rutasProcesosInformes')(app);
// require('./routes/rutasImagenes')(app);
// require('./routes/rutasProcesosFinancieros')(app);



app.listen(app.get('port'),()=>{
	console.log('running in port', PORT);
})