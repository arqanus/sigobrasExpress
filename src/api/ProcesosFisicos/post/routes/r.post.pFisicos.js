const User = require('../models/m.post.pFisicos');
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
  app.post('/avanceActividad',(req,res)=>{
      var a =""
      var anyo_ingreso =""
      var mes_ingreso =""
      var dia_ingreso =""
      var d =""
      var mes_actual =""
      var dia_actual =""
      var anyo_actual =""
      if (req.body.fecha){
          a = req.body.fecha.split("-")	
          anyo_ingreso = a[0]		
          mes_ingreso = a[1]
          dia_ingreso = a[2]
          d = new Date();
          mes_actual = d.getMonth()+1;
          dia_actual = d.getDate();
          anyo_actual = d.getFullYear();
      }
              
  
      if(req.body.valor <=0 ||req.body.valor == ""){
          res.status(204).json("valor no permitido");
      }else if(req.body.fecha&&(anyo_actual!=anyo_ingreso||mes_actual!=mes_ingreso||dia_ingreso > dia_actual)){		
          
          res.status(200).send("fecha invalida")					
          
      }else{			
          User.getIdHistorial(req.body.id_ficha,(err,data)=>{
              if(err){ res.status(204).json(err);}
              else{
                  delete req.body.id_ficha
                  req.body.historialEstados_id_historialEstado = data.id_historialEstado                    
                  
                  User.postAvanceActividad(req.body,(err,data)=>{
                      if(err){ res.status(204).json(err);}
                      else{
                        
                        User.getPartidasbyIdActividad(req.body.Actividades_id_actividad,(err,partida)=>{
                            if(err){ res.status(204).json(err);}
                            else{
                              
                              User.getActividadesbyIdActividad(partida[0].id_partida,(err,actividades)=>{
                                if(err){ res.status(204).json(err);}
                                else{
                                    res.json(
                                      {
                                        "partida":partida[0],
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
  app.post('/avanceActividadCorte',(req,res)=>{
      if (req.body.id_ficha == null) {
          res.json("null");
      } else {
        User.getIdHistorial(req.body.id_ficha,(err,data)=>{
          if(err){ res.status(204).json(err);}
          else{
              delete req.body.id_ficha
              req.body.historialEstados_id_historialEstado = data.id_historialEstado                    
              
              User.postAvanceActividad(req.body,(err,data)=>{
                  if(err){ res.status(204).json(err);}
                  else{
                    
                    User.getPartidasbyIdActividad(req.body.Actividades_id_actividad,(err,partida)=>{
                      if(err){ res.status(204).json(err);}
                      else{
                        
                        User.getActividadesbyIdActividad(partida[0].id_partida,(err,actividades)=>{
                          if(err){ res.status(204).json(err);}
                          else{
                              res.json(
                                {
                                  "partida":partida[0],
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
  app.post('/postNuevaActividadMayorMetrado',(req,res)=>{
		if (req.body.partidas_id_partida == null) {
			res.json("null")
		} else {
			User.postActividad(req.body,(err,id_actividad)=>{
				if(err){ res.status(204).json(err);}
				else{
					var historialActividad = {						
						"estado":"Mayor Metrado",
						"actividades_id_actividad":id_actividad
					}
					User.posthistorialActividades(historialActividad,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
              
              User.getPartidasbyIdActividad(id_actividad,(err,partida)=>{
                  if(err){ res.status(204).json(err);}
                  else{
                    User.getActividadesbyIdActividad(partida[0].id_partida,(err,actividades)=>{
                      if(err){ res.status(204).json(err);}
                      else{
                          res.json(
                            {
                              "partida":partida[0],
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
  app.post('/postActividadMayorMetrado',(req,res)=>{
		var actividad = req.body.actividad
		if (actividad.partidas_id_partida == null) {
			res.json("null")
		}else{
			User.postActividad(actividad,(err,id_actividad)=>{
				if(err){ res.status(204).json(err);}
				else{
					var historialActividad = {						
						"estado":"Mayor Metrado",
						"actividades_id_actividad":id_actividad
					}
					User.posthistorialActividades(historialActividad,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
							var avanceActividad = req.body.avanceActividad
							avanceActividad.Actividades_id_actividad = id_actividad
							var id_ficha = avanceActividad.id_ficha
							
							User.getIdHistorial(id_ficha,(err,data)=>{
								console.log("idhistorial");
								if(err||data.length==0){ res.status(204).json(err);}
								else{
									delete avanceActividad.id_ficha
									avanceActividad.historialEstados_id_historialEstado = data.id_historialEstado
									
									
									User.postAvanceActividad(avanceActividad,(err,data)=>{
										console.log("avance");
										
										if(err){ res.status(204).json(err);}
										else{
                      User.getPartidasbyIdActividad(id_actividad,(err,partida)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                          User.getActividadesbyIdActividad(id_actividad,(err,actividades)=>{
                            if(err){ res.status(204).json(err);}
                            else{
                                res.json(
                                  {
                                    "partida":partida,
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
		}			
		
	})
  app.post('/imagenesActividad', function(req, res, next) {
    
    
    
      var dir = __dirname+'/../../../../public/'
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
            var ruta = "/"+fields.id_acceso+"_"+fields.id_actividad+"_"+datetime()+".jpg"
            fs.rename(files.foto.path,obraFolder+ruta , function(err) {
              if (err) next(err);
              
              User.getIdHistorial(fields.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                  
                  var historialEstados_id_historialEstado = data.id_historialEstado
                  var imagen = {
                
                    "Actividades_id_actividad":fields.id_actividad,
                    "imagen":"/static/"+fields.codigo_obra+ruta,
                    "imagenAlt":fields.codigo_obra,
                    "descripcion":"IMAGEN",
                    "observacion":"IMAGEN",                
                    "fecha":new Date(fecha()),
                    "historialEstados_id_historialEstado":historialEstados_id_historialEstado
                  }
                  User.postAvanceActividad(imagen,(err,data)=>{
                    if(err){ res.status(204).json(err);}
                    else{
                      console.log("Date",datetime());
                      
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
                    
          
  })
  //aantiguos
  app.post('/avanceActividadOld',(req,res)=>{
		var a =""
		var anyo_ingreso =""
		var mes_ingreso =""
		var dia_ingreso =""
		var d =""
		var mes_actual =""
		var dia_actual =""
		var anyo_actual =""
		if (req.body.fecha){
			a = req.body.fecha.split("-")	
			anyo_ingreso = a[0]		
			mes_ingreso = a[1]
			dia_ingreso = a[2]
			d = new Date();
			mes_actual = d.getMonth()+1;
			dia_actual = d.getDate();
			anyo_actual = d.getFullYear();
		}
				

		if(req.body.valor <=0 ||req.body.valor == ""){
			res.status(204).json("valor no permitido");
		}else if(req.body.fecha&&(anyo_actual!=anyo_ingreso||mes_actual!=mes_ingreso||dia_ingreso > dia_actual)){		
			
			res.status(200).send("fecha invalida")					
			
		}else{			
			User.getIdHistorial(req.body.id_ficha,(err,data)=>{
				if(err||data.length==0){ res.status(204).json(err);}
				else{
					delete req.body.id_ficha
					req.body.historialEstados_id_historialEstado = data.id_historialEstado
					
					
					User.postAvanceActividad(req.body,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
							User.getAvanceById(req.body.Actividades_id_actividad,(err,data)=>{
								if(err){ res.status(204).json(err);}
								else{
									res.json(data);	
								}
							})
							
						}
					})
				}
			})
		}
		

	})
	app.post('/avanceActividadCorteOld',(req,res)=>{
		if (req.body.id_ficha == null) {
			res.json("null");
		} else {
			User.getIdHistorial(req.body.id_ficha,(err,data)=>{
				if(err||data.length==0){ res.status(204).json(err);}
				else{
					delete req.body.id_ficha
					req.body.historialEstados_id_historialEstado = data.id_historialEstado
					
					var id_actividad = req.body.Actividades_id_actividad
					User.postAvanceActividad(req.body,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
							User.getAvanceById(req.body.Actividades_id_actividad,(err,data)=>{
								if(err){ res.status(204).json(err);}
								else{
									res.json(data);	
								}
							})
							
						}
					})
				}
			})
		}
		
		
		

  })
  app.post('/postNuevaActividadMayorMetradoOld',(req,res)=>{
		if (req.body.partidas_id_partida == null) {
			res.json("null")
		} else {
			User.postActividad(req.body,(err,id_actividad)=>{
				if(err){ res.status(204).json(err);}
				else{
					var historialActividad = {						
						"estado":"Mayor Metrado",
						"actividades_id_actividad":id_actividad
					}
					User.posthistorialActividades(historialActividad,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
              
              User.getPartidasbyIdActividad(id_actividad,(err,partida)=>{
                  if(err){ res.status(204).json(err);}
                  else{
                    User.getAvanceById(id_actividad,(err,data)=>{
                      if(err){ res.status(204).json(err);}
                      else{
                        res.json(data);	
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
  app.post('/postActividadMayorMetradoOld',(req,res)=>{
		var actividad = req.body.actividad
		if (actividad.partidas_id_partida == null) {
			res.json("null")
		}else{
			User.postActividad(actividad,(err,id_actividad)=>{
				if(err){ res.status(204).json(err);}
				else{
					var historialActividad = {						
						"estado":"Mayor Metrado",
						"actividades_id_actividad":id_actividad
					}
					User.posthistorialActividades(historialActividad,(err,data)=>{
						if(err){ res.status(204).json(err);}
						else{
							var avanceActividad = req.body.avanceActividad
							avanceActividad.Actividades_id_actividad = id_actividad
							var id_ficha = avanceActividad.id_ficha
							
							User.getIdHistorial(id_ficha,(err,data)=>{
								console.log("idhistorial");
								if(err||data.length==0){ res.status(204).json(err);}
								else{
									delete avanceActividad.id_ficha
									avanceActividad.historialEstados_id_historialEstado = data.id_historialEstado
									
									
									User.postAvanceActividad(avanceActividad,(err,data)=>{
										console.log("avance");
										
										if(err){ res.status(204).json(err);}
										else{
                      User.getPartidasbyIdActividad(id_actividad,(err,partida)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                          User.getAvanceById(id_actividad,(err,data)=>{
                            if(err){ res.status(204).json(err);}
                            else{
                              res.json(data);	
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
		}			
		
	})
}