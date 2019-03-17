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
//ingresoObra
require('./ingresoDatos/ingresoObra/routes/route')(app);

require('./routes/rutasProcesosIniciales')(app);
require('./routes/rutasProcesosGerenciales')(app);
require('./routes/rutasProcesosFisicos')(app);
require('./routes/rutasProcesosInformes')(app);
require('./routes/rutasImagenes')(app);
// require('./routes/rutasProcesosFinancieros')(app);



app.listen(app.get('port'),()=>{
	console.log('running in port', PORT);
})