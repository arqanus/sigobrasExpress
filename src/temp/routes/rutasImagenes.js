const User = require('../models/procesosFisicos');
var formidable = require('formidable');    
var util = require('util');
var fs = require('fs');
var path = require('path');

function fecha(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return mm + '-' + dd + '-' + yyyy;
}


module.exports = function(app){

    
    

    app.post('/getImagen', function(req, res){

      var ruta  = __dirname+'/../../../imagenesActividades/'+"E001/11_17332_03-13-2019.jpg"
      res.sendFile(path.resolve(ruta));
      
    });
    
}