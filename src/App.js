const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');

// const cors =require('cors');

const PORT = process.env.PORT || 9000


//open cors
var corsOptions = {
	origin: 'http://localhost:9009',
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

//settings
app.set('port',PORT);

//middleares
app.use(morgan('dev'));
	//entender jason
app.use(bodyParser.json({limit: '200kb'}));
morganBody(app);
 
//routes 
require('./routes/rutasProcesosIniciales')(app);
require('./routes/rutasProcesosGerenciales')(app);
require('./routes/rutasProcesosFisicos')(app);
// require('./routes/rutasProcesosFinancieros')(app);



app.listen(app.get('port'),()=>{
	console.log('running in port', PORT);
})