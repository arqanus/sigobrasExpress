const User = require('../models/m.post.pFisicos');

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
                if(err||data.length==0){ res.status(204).json(err);}
                else{
                    delete req.body.id_ficha
                    req.body.historialEstados_id_historialEstado = data[0].id_historialEstado
                    
                    
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
    app.post('/avanceActividadCorte',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null");
        } else {
            User.getIdHistorial(req.body.id_ficha,(err,data)=>{
                if(err||data.length==0){ res.status(204).json(err);}
                else{
                    delete req.body.id_ficha
                    req.body.historialEstados_id_historialEstado = data[0].id_historialEstado
                    
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
    app.post('/postActividadMayorMetrado',(req,res)=>{
		var actividad = req.body.actividad
		if (actividad.partidas_id_partida == null) {
			res.json("null")
		}else{
			User.postActividadMayorMetrado(actividad,(err,id_actividad)=>{
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
									avanceActividad.historialEstados_id_historialEstado = data[0].id_historialEstado
									
									
									User.postAvanceActividad(avanceActividad,(err,data)=>{
										console.log("avance");
										
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
	app.post('/postNuevaActividadMayorMetrado',(req,res)=>{
		if (req.body.partidas_id_partida == null) {
			res.json("null")
		} else {
			User.postActividadMayorMetrado(req.body,(err,id_actividad)=>{
				if(err){ res.status(204).json(err);}
				else{
					var historialActividad = {						
						"estado":"Mayor Metrado",
						"actividades_id_actividad":id_actividad
					}
					User.posthistorialActividades(historialActividad,(err,data)=>{
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