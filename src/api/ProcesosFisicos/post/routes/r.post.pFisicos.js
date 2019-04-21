const User = require('../models/m.post.pFisicos');
const User2 = require('../../get/models/m.get.pFisicos');
var formidable = require('formidable');    
// var util = require('util');
var fs = require('fs');
// var path = require('path');

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
function datetime(){
  var today = new Date();
  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  return date+'_'+time;
}

module.exports = function(app){

  app.post('/postNuevaActividadMayorMetrado',(req,res)=>{
		if (req.body.partidas_id_partida == null) {
			res.json("null")
		} else {
			User.postActividad(req.body,(err,id_actividad)=>{
				if(err){ res.status(204).json(err);}
				else{				
          var historialActividad = {
            estado:"Mayor Metrado",
            Actividades_id_actividad:id_actividad
          }
					User.posthistorialActividades(historialActividad,(err,id_historial)=>{
            if(err){ res.status(204).json(err);}
            else{
              
              User2.getPartidas(null,id_actividad,(err,partida)=>{
                if(err){ res.status(204).json(err);}
                else{
                  
                  User2.getActividades(partida[0].id_partida,(err,actividades)=>{
                    if(err){ res.status(204).json(err);}
                    else{
                      User2.getPartidasMayorMetradoAvance(partida[0].id_partida,(err,mayorMetrado)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            mayorMetrado = mayorMetrado||{}
                            res.json(
                                {
                                  "partida":partida[0],
                                  "mayor_metrado":{
                                      "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                      "mm_avance_costo": mayorMetrado.avance_costo||0,
                                      "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                      "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                      "mm_porcentaje": mayorMetrado.porcentaje||0
                                  },
                                  "actividades":actividades
                                }
                            );
                        }
                      })	
                    }
                  })
                }
              })
            }
          })
				}
			})
		}			
		
  })
  
  app.post('/avanceActividad', (req, res)=>{    
       
    
 
        //ruta de la carpeta public de imagenes
      var dir = __dirname+'/../../../../public/'
      //crear ruta si no existe
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
        
      var form = new formidable.IncomingForm();
      //se configura la ruta de guardar
      form.uploadDir = dir;
        
      form.parse(req, function(err, fields, files) {
          
        if(fields.valor<=0){
          res.json("valor no permitido")
        }else
        {
          console.log("accesos_id_acceso :",fields.accesos_id_acceso);
          console.log("codigo_obra :",fields.codigo_obra);
          console.log("Actividades_id_actividad :",fields.Actividades_id_actividad);
          console.log("valor :",fields.valor);
          console.log("foto :",fields.foto);
          console.log("observacion :",fields.observacion);
          console.log("descripcion :",fields.descripcion); 

          if (err){
            res.json(err)
          }
          //folder de la obra
          var obraFolder = dir+"/"+fields.codigo_obra
          
          if (!fs.existsSync(obraFolder)){
            fs.mkdirSync(obraFolder);
          }  // TODO: make sure my_file and project_id exist  
          
          
          var ruta = "/"+fields.accesos_id_acceso+"_"+fields.Actividades_id_actividad+"_"+datetime()+".jpg"
          //files foto
          if(files.foto){
            fs.rename(files.foto.path,obraFolder+ruta , function(err) {
              if (err){
                res.json(err)
              }
              
              var avanceActividad = {
            
                "Actividades_id_actividad":fields.Actividades_id_actividad,
                "valor":fields.valor,
                "imagen":"/static/"+fields.codigo_obra+ruta,
                "imagenAlt":fields.codigo_obra,
                "descripcion":fields.descripcion,
                "observacion":fields.observacion,
                "accesos_id_acceso":fields.accesos_id_acceso
              }
              User.postAvanceActividad(avanceActividad,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                  
                  User2.getPartidas(null,avanceActividad.Actividades_id_actividad,(err,partida)=>{
                    if(err){ res.status(204).json(err);}
                    else{
                      
                      User2.getActividades(partida[0].id_partida,(err,actividades)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                          User2.getPartidasMayorMetradoAvance(partida[0].id_partida,(err,mayorMetrado)=>{
                            if(err){ res.status(204).json(err);}
                            else{
                                mayorMetrado = mayorMetrado||{}
                                res.json(
                                    {
                                      "partida":partida[0],
                                      "mayor_metrado":{
                                          "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                          "mm_avance_costo": mayorMetrado.avance_costo||0,
                                          "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                          "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                          "mm_porcentaje": mayorMetrado.porcentaje||0
                                      },
                                      "actividades":actividades
                                    }
                                );
                            }
                          })	
                        }
                      })
                    }
                  })
                }
              })
            }); 
          }else{
            var avanceActividad = {
            
              "Actividades_id_actividad":fields.Actividades_id_actividad,
              "valor":fields.valor,                
              "imagenAlt":fields.codigo_obra,
              "descripcion":fields.descripcion,
              "observacion":fields.observacion,
              "accesos_id_acceso":fields.accesos_id_acceso
            }
            User.postAvanceActividad(avanceActividad,(err,data)=>{
              if(err){ res.status(204).json(err);}
              else{
                
                User2.getPartidas(null,avanceActividad.Actividades_id_actividad,(err,partida)=>{
                  if(err){ res.status(204).json(err);}
                  else{
                    
                    User2.getActividades(partida[0].id_partida,(err,actividades)=>{
                      if(err){ res.status(204).json(err);}
                      else{
                        User2.getPartidasMayorMetradoAvance(partida[0].id_partida,(err,mayorMetrado)=>{
                          if(err){ res.status(204).json(err);}
                          else{
                              mayorMetrado = mayorMetrado||{}
                              res.json(
                                  {
                                    "partida":partida[0],
                                    "mayor_metrado":{
                                        "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                        "mm_avance_costo": mayorMetrado.avance_costo||0,
                                        "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                        "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                        "mm_porcentaje": mayorMetrado.porcentaje||0
                                    },
                                    "actividades":actividades
                                  }
                              );
                          }
                        })	
                      }
                    })
                  }
                })
              }
            })
          }
        }
        
                  
      });
    
    
 
                    
          
  })
  app.post('/avanceActividadCorte', (req, res)=>{    
    var dir = __dirname+'/../../../../public/'
    //crear ruta si no existe
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
      
    var form = new formidable.IncomingForm();
    //se configura la ruta de guardar
    form.uploadDir = dir;
      
    form.parse(req, function(err, fields, files) {
      console.log("accesos_id_acceso :",fields.accesos_id_acceso);
      console.log("codigo_obra :",fields.codigo_obra);
      console.log("Actividades_id_actividad :",fields.Actividades_id_actividad);
      console.log("valor :",fields.valor);
      console.log("foto :",fields.foto);
      console.log("observacion :",fields.observacion);
      console.log("descripcion :",fields.descripcion); 

      if (err){
        res.json(err)
      }
      //folder de la obra
      var obraFolder = dir+"/"+fields.codigo_obra
      
      if (!fs.existsSync(obraFolder)){
        fs.mkdirSync(obraFolder);
      }  // TODO: make sure my_file and project_id exist  
      
      
      var ruta = "/"+fields.accesos_id_acceso+"_"+fields.Actividades_id_actividad+"_"+datetime()+".jpg"
      //files foto
      if(files.foto){
        fs.rename(files.foto.path,obraFolder+ruta , function(err) {
          if (err){
            res.json(err)
          }
          
          var avanceActividad = {
        
            "Actividades_id_actividad":fields.Actividades_id_actividad,
            "valor":fields.valor,
            "imagen":"/static/"+fields.codigo_obra+ruta,
            "imagenAlt":fields.codigo_obra,
            "descripcion":fields.descripcion,
            "observacion":fields.observacion,
            "accesos_id_acceso":fields.accesos_id_acceso
          }
          User.postAvanceActividad(avanceActividad,(err,data)=>{
            if(err){ res.status(204).json(err);}
            else{
              
              User2.getPartidas(null,avanceActividad.Actividades_id_actividad,(err,partida)=>{
                if(err){ res.status(204).json(err);}
                else{
                  
                  User2.getActividades(partida[0].id_partida,(err,actividades)=>{
                    if(err){ res.status(204).json(err);}
                    else{
                      User2.getPartidasMayorMetradoAvance(partida[0].id_partida,(err,mayorMetrado)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            mayorMetrado = mayorMetrado||{}
                            res.json(
                                {
                                  "partida":partida[0],
                                  "mayor_metrado":{
                                      "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                      "mm_avance_costo": mayorMetrado.avance_costo||0,
                                      "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                      "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                      "mm_porcentaje": mayorMetrado.porcentaje||0
                                  },
                                  "actividades":actividades
                                }
                            );
                        }
                      })	
                    }
                  })
                }
              })
            }
          })
        }); 
      }else{
        var avanceActividad = {
        
          "Actividades_id_actividad":fields.Actividades_id_actividad,
          "valor":fields.valor,                
          "imagenAlt":fields.codigo_obra,
          "descripcion":fields.descripcion,
          "observacion":fields.observacion,
          "accesos_id_acceso":fields.accesos_id_acceso
        }
        User.postAvanceActividad(avanceActividad,(err,data)=>{
          if(err){ res.status(204).json(err);}
          else{
            
            User2.getPartidas(null,avanceActividad.Actividades_id_actividad,(err,partida)=>{
              if(err){ res.status(204).json(err);}
              else{
                
                User2.getActividades(partida[0].id_partida,(err,actividades)=>{
                  if(err){ res.status(204).json(err);}
                  else{
                    User2.getPartidasMayorMetradoAvance(partida[0].id_partida,(err,mayorMetrado)=>{
                      if(err){ res.status(204).json(err);}
                      else{
                          mayorMetrado = mayorMetrado||{}
                          res.json(
                              {
                                "partida":partida[0],
                                "mayor_metrado":{
                                    "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                    "mm_avance_costo": mayorMetrado.avance_costo||0,
                                    "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                    "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                    "mm_porcentaje": mayorMetrado.porcentaje||0
                                },
                                "actividades":actividades
                              }
                          );
                      }
                    })	
                  }
                })
              }
            })
          }
        })
      }
                
    });
    
 
                    
          
  })
  app.post('/avanceActividadActualizacion', (req, res)=>{    
    var dir = __dirname+'/../../../../public/'
    //crear ruta si no existe
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
      
    var form = new formidable.IncomingForm();
    //se configura la ruta de guardar
    form.uploadDir = dir;
      
    form.parse(req, function(err, fields, files) {
      console.log("accesos_id_acceso :",fields.accesos_id_acceso);
      console.log("codigo_obra :",fields.codigo_obra);
      console.log("Actividades_id_actividad :",fields.Actividades_id_actividad);
      console.log("valor :",fields.valor);
      console.log("foto :",fields.foto);
      console.log("observacion :",fields.observacion);
      console.log("descripcion :",fields.descripcion); 
      console.log("descripcion :",fields.fecha); 

      if (err){
        res.json(err)
      }
      //folder de la obra
      var obraFolder = dir+"/"+fields.codigo_obra
      
      if (!fs.existsSync(obraFolder)){
        fs.mkdirSync(obraFolder);
      }  // TODO: make sure my_file and project_id exist  
      
      
      var ruta = "/"+fields.accesos_id_acceso+"_"+fields.Actividades_id_actividad+"_"+datetime()+".jpg"
      //files foto
      if(files.foto){
        fs.rename(files.foto.path,obraFolder+ruta , function(err) {
          if (err){
            res.json(err)
          }
          
          var avanceActividad = {
        
            "Actividades_id_actividad":fields.Actividades_id_actividad,
            "valor":fields.valor,
            "imagen":"/static/"+fields.codigo_obra+ruta,
            "imagenAlt":fields.codigo_obra,
            "descripcion":fields.descripcion,
            "observacion":fields.observacion,
            "accesos_id_acceso":fields.accesos_id_acceso,
            "fecha":fields.fecha
          }
          User.postAvanceActividad(avanceActividad,(err,data)=>{
            if(err){ res.status(204).json(err);}
            else{
              
              User2.getPartidas(null,avanceActividad.Actividades_id_actividad,(err,partida)=>{
                if(err){ res.status(204).json(err);}
                else{
                  
                  User2.getActividades(partida[0].id_partida,(err,actividades)=>{
                    if(err){ res.status(204).json(err);}
                    else{
                      User2.getPartidasMayorMetradoAvance(partida[0].id_partida,(err,mayorMetrado)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            mayorMetrado = mayorMetrado||{}
                            res.json(
                                {
                                  "partida":partida[0],
                                  "mayor_metrado":{
                                      "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                      "mm_avance_costo": mayorMetrado.avance_costo||0,
                                      "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                      "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                      "mm_porcentaje": mayorMetrado.porcentaje||0
                                  },
                                  "actividades":actividades
                                }
                            );
                        }
                      })	
                    }
                  })
                }
              })
            }
          })
        }); 
      }else{
        var avanceActividad = {
        
          "Actividades_id_actividad":fields.Actividades_id_actividad,
          "valor":fields.valor,                
          "imagenAlt":fields.codigo_obra,
          "descripcion":fields.descripcion,
          "observacion":fields.observacion,
          "accesos_id_acceso":fields.accesos_id_acceso,
          "fecha":fields.fecha
        }
        User.postAvanceActividad(avanceActividad,(err,data)=>{
          if(err){ res.status(204).json(err);}
          else{
            
            User2.getPartidas(null,avanceActividad.Actividades_id_actividad,(err,partida)=>{
              if(err){ res.status(204).json(err);}
              else{
                
                User2.getActividades(partida[0].id_partida,(err,actividades)=>{
                  if(err){ res.status(204).json(err);}
                  else{
                    User2.getPartidasMayorMetradoAvance(partida[0].id_partida,(err,mayorMetrado)=>{
                      if(err){ res.status(204).json(err);}
                      else{
                          mayorMetrado = mayorMetrado||{}
                          res.json(
                              {
                                "partida":partida[0],
                                "mayor_metrado":{
                                    "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                    "mm_avance_costo": mayorMetrado.avance_costo||0,
                                    "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                    "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                    "mm_porcentaje": mayorMetrado.porcentaje||0
                                },
                                "actividades":actividades
                              }
                          );
                      }
                    })	
                  }
                })
              }
            })
          }
        })
      }
                
    });
    
 
                    
          
  })


}