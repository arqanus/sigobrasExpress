const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');

const cors =require('cors');

const PORT = process.env.PORT || 9000


//open cors
app.use(cors());

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