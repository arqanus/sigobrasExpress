const User = require('../models/model');

module.exports = function(app){
    app.post('/nuevaObra',(req,res)=>{
		var g_total_presu = req.body.g_total_presu
		var id_estado = req.body.id_estado
		var componentes = req.body.componentes
		var fecha_final = req.body.fecha_final
		// console.log("fecha final",fecha_final);
		
		// delete req.body.g_total_presu;
		delete req.body.id_estado;
		delete req.body.componentes;
		delete req.body.fecha_final;		
		User.postObra(req.body,(err,id_ficha)=>{
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
						User.postHistorialEstados(Historial,(err,data)=>{							
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
											
										res.json("Exit")							
										/**eliminado postpresupuesto */
										
										
										
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
        var componentes = req.body.componentes
        var id_ficha = req.body.id_ficha
        var data_procesada = [];								
        for(var i = 0; i < componentes.length; i++){
            var componente = [];
            componente.push(componentes[i]["0"]);
            componente.push(componentes[i]["1"]);
            componente.push(componentes[i]["2"]);									
            data_procesada.push(componente);
        }		
        // res.json(data_procesada)
        User.postComponentes(data_procesada,(err,idComponente)=>{
            if(err) {res.status(204).json(err);}
            else{
                var presupuestos = []
                for (let i = 0; i < componentes.length; i++) {
                    var presupuesto = []
                    presupuesto.push(componentes[i]["2"]);
                    
                    presupuesto.push(id_ficha)
                    presupuestos.push(presupuesto);
                    
                }	
                // res.json(presupuestos)
                User.postPresupuestos(presupuestos,(err,idpresupuesto)=>{
                    if(err) {res.status(204).json(err);}
                    else{
                        var idFichas={
                            "id_ficha":id_ficha,											
                            "componentes":[]
                        }
                        var historialComponentes = []
                        for (let i = 0; i < componentes.length; i++) {
                            idFichas.componentes.push(
                                {
                                    "numero":i+1,
                                    "idComponente":idComponente,
                                    "idPresupuesto":idpresupuesto
                                }
                            )
    
                            historialComponentes.push(
                                [													
                                    "oficial",
                                    idComponente
                                ]
                            )
    
                            idComponente+=1;
                            idpresupuesto+=1;
                            
                        }
                        User.postHistorialComponentes(historialComponentes,(err,data)=>{
                            if (err) {
                                
                                res.json(err);
                            }else{
    
                                res.json(idFichas)
                            }
                        })
                    }
                })
                
                
                
            }
    
            
        })
    
    })	
    //partidas
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
                element.componentes_id_componente,
                element.presupuestos_id_presupuesto
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
                var element = idPartida						
                var actividades = []
                var recursos = []
                for (let j = 0; j < data.length; j++,element+=1) {
                    // console.log("actividades")
                    //insertando idpartida
                    if(data[j].tipo == "partida"){
                        var obActividad = data[j].actividades
                        for (let k = 0; k < obActividad.length; k++) {
                            obActividad[k].push(element);
                            // obActividad[k].push(estado);
                        }
                        actividades = actividades.concat(obActividad)
    
                        // recursos agregando id partida
                        var obRecurso = data[j].recursos
                        // console.log("recursos")
                        for (let k = 0; k < obRecurso.length; k++) {
                            obRecurso[k].push(element);
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
                                res.json(errores);
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
                                            User.posthistorialActividades(historialActividad,(err,data)=>{
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
