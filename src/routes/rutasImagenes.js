const User = require('../models/procesosGerenciales');
var formidable = require('formidable');    
var util = require('util');
var fs = require('fs');

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

    
    app.post('/imagenesActividad', function(req, res, next) {
      
      var dir = '/imagenesActividades/'
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      
      var form = new formidable.IncomingForm();
      form.uploadDir = dir;
      
      form.parse(req, function(err, fields, files) {
          if (err) next(err);
          var obraFolder = dir+"/"+fields.codigo_obra
          
          if (!fs.existsSync(obraFolder)){
            fs.mkdirSync(obraFolder);
          }  // TODO: make sure my_file and project_id exist    
                    
          fs.rename(files.foto.path, obraFolder+"/"+fields.id_acceso+"_"+fields.id_actividad+"_"+fecha()+".jpg", function(err) {
              if (err) next(err);
              res.end();
          });
      });
    });
}