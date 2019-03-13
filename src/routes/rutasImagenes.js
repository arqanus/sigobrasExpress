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

    
    app.post('/imagenesActividad', function(req, res, next) {
      
      
      
      var dir = __dirname+'/../../../imagenesActividades/'
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
          if(files.foto){
            fs.rename(files.foto.path, obraFolder+"/"+fields.id_acceso+"_"+fields.id_actividad+"_"+fecha()+".jpg", function(err) {
              if (err) next(err);
              User.getIdHistorial(fields.id_ficha,(err,data)=>{
                if(err||data.length==0){ res.status(204).json(err);}
                else{
                  
                  var historialEstados_id_historialEstado = data[0].id_historialEstado
                  var imagen = {
                
                    "Actividades_id_actividad":fields.id_actividad,
                    "imagen":fields.codigo_obra+"/"+fields.id_acceso+"_"+fields.id_actividad+"_"+fecha()+".jpg",
                    "descripcion":"IMAGEN",
                    "observacion":"IMAGEN",                
                    "fecha":new Date(fecha()),
                    "historialEstados_id_historialEstado":historialEstados_id_historialEstado
                  }
                  User.postAvanceActividad(imagen,(err,data)=>{
                    if(err){ res.status(204).json(err);}
                    else{
                      res.end("exito");                      
                    }
                  })      
                  
            
                }
              })

              
              
            });
          }else{
            res.json("FOTO VACIA")
            
      
          }
        });
                    
          
    });

    app.post('/getImagen', function(req, res){

      var ruta  = __dirname+'/../../../imagenesActividades/'+"E001/11_17332_03-13-2019.jpg"
      res.sendFile(path.resolve(ruta));
      
    });
    
}