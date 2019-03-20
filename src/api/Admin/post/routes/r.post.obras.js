const User = require('../models/m.post.obras');

module.exports = function(app){
    app.post('/postTipoObras',(req,res)=>{
		
		User.postTipoObra(req.body.data,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
		
	
	
		
	})
	app.post('/postUnidadEjecutora',(req,res)=>{
		
		User.postUnidadEjecutora(req.body.data,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
		
	
	
		
    })
    app.post('/postEstado',(req,res)=>{
		
		User.postEstado(req.body,(err,data)=>{
			
			if(err) res.status(204).json(err);
			res.status(200).json(data);
		})
	})
    app.post('/nuevaObra',(req,res)=>{
        console.log("newobra");
        
		var g_total_presu = req.body.g_total_presu
		var id_estado = req.body.id_estado
		var componentes = req.body.componentes
		var fecha_final = req.body.fecha_final
		// console.log("fecha final",fecha_final);
		
		// delete req.body.g_total_presu;
		delete req.body.id_estado;
		delete req.body.componentes;
		delete req.body.fecha_final;		
		User.postFicha(req.body,(err,id_ficha)=>{
			if(err) {res.status(204).json(err);}
			else{
				var plazoEjecucion={
					"FechaEjecucion":fecha_final,
					"fichas_id_ficha":id_ficha,
				}
				User.postPlazoEjecucion(plazoEjecucion,(err,data)=>{
					if(err) {res.status(204).json(err);}
					else{
						var Historial = {											
							"Fichas_id_ficha":id_ficha,
							"Estados_id_estado":id_estado,
						}
						User.postHistorialEstado(Historial,(err,data)=>{							
							if(err){ res.status(204).json(err);}
							else{
								var data_procesada = [];								
								for(var i = 0; i < componentes.length; i++){
									var componente = [];
									componente.push(componentes[i]["0"]);
									componente.push(componentes[i]["1"]);
									componente.push(componentes[i]["2"]);	
									componente.push(id_ficha);								
									data_procesada.push(componente);
								}		
								// console.log(data_procesada);
								User.postComponentes(data_procesada,(err,idComponente)=>{
									if(err) {res.status(204).json(err);}
									else{	
                                        var dataComponentes={
                                            "componentes":[]
                                        }
                                        var idcomptemp = idComponente

                                        				
                                        for (let i = 0; i < componentes.length; i++) {
                                            dataComponentes.componentes.push(
                                                {
                                                "numero": i+1,
                                                "idComponente": idcomptemp,
                                                }
                                            )
                                            idcomptemp++                                            
                                        }
										res.json(dataComponentes)									
										
										
									}
		
									
								})	
							}
		
						})
					}
					
						
				})

					
					
				
			}
			
			
        })	
    })
    app.post('/postComponentes',(req,res)=>{       
        User.postComponentes(req.body,(err,idComponente)=>{
            if(err) {res.status(204).json(err);}
            else{
                res.json("exito")                   
            }              
        })    
    })	    
    app.post('/nuevasPartidas',(req,res)=>{
        var errores=[]
        
        var listaPartidas = []
        // console.log("body",req.body)
        // console.log("ruta")
        var data = req.body.data
        var estado = req.body.estado   
        
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            const obPartida = [
                element.tipo,
                element.item,
                element.descripcion,
                element.unidad_medida,
                element.metrado,
                element.costo_unitario,
                element.equipo,
                element.rendimiento,
                element.componentes_id_componente
                
            ]
            listaPartidas.push(obPartida)
        }
        
        User.postPartidas(listaPartidas,(err,idPartida)=>{
            if(err){
                errores.push(
                    {
                        "PostPartidas":"partida",
                        "error":err
                    }
                )
                res.json(err);
            }
            else{
                // res.json(idPartida);
                            
                // console.log("partidas insertadas")
                // res.json(idPartida)
                var tempIdpartida = idPartida						
                var actividades = []
                var recursos = []
                for (let j = 0; j < data.length; j++,tempIdpartida+=1) {
                    // console.log("actividades")
                    //insertando idpartida
                    if(data[j].tipo == "partida"){
                        var obActividad = data[j].actividades
                        for (let k = 0; k < obActividad.length; k++) {
                            obActividad[k].push(tempIdpartida);
                            // obActividad[k].push(estado);
                        }
                        actividades = actividades.concat(obActividad)
    
                        // recursos agregando id partida
                        var obRecurso = data[j].recursos
                        // console.log("recursos")
                        for (let k = 0; k < obRecurso.length; k++) {
                            obRecurso[k].push(tempIdpartida);
                        }
                        recursos = recursos.concat(obRecurso)
                    }				
                }
                // console.log("actividades",actividades);
                
                User.postActividades(actividades,(err,id_actividad)=>{
                    if(err){
                        errores.push(
                            {
                                "elemento":"actividad",
                                "error":err
                            }
                        )						
                    }
                    else{
                        User.postRecursos(recursos,(err,idrecursos)=>{
                            if(err){
                                errores.push(
                                    {
                                        "elemento":"recursos",
                                        "error":err
                                    }
                                )
                                res.status(204).json(errores);
                            }
                            else{
                                if(estado == "oficial"){
                                    res.json("exito")
                                }else{
                                    var element = idPartida
                                    var historialpartidas = []
                                    for (let i = 0; i < data.length; i++) {
                                        
                                        var historial=[										
                                            estado,
                                            element
                                        ]
                                        historialpartidas.push(historial)	
                                        element+=1
                                    }
                                    
                                    
                                    
                                    User.postHistorialPartidas(historialpartidas,(err,data)=>{
                                        if (err) {
                                            errores.push(
                                                {
                                                    "elemento":"historial de partidas",
                                                    "error":err
                                                }
                                            )
                                            res.json(errores);
                                        }else{
                                            
                                            var historialActividad = {						
                                                "estado":"Partida Nueva",
                                                "actividades_id_actividad":id_actividad
                                            }
                                            User.posthistorialActividad(historialActividad,(err,data)=>{
                                                if(err){ res.status(204).json(err);}
                                                else{
                                                    res.json(data)
                                                }
                                            })
                                        }
                                    })
    
                                }
                                
                                
                            }
                        })
                    }
                })
                    
                                
            }
        })	
    })
   
	
}