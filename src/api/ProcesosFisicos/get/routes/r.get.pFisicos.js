const User = require('../models/m.get.pFisicos');

module.exports = function(app){
    app.post('/getPartidasCompletas',(req,res)=>{
		if (req.body.id_ficha == null ||req.body.id_ficha == "null"||req.body.id_ficha == "") {
			res.json("null");
		} else {
			User.getPartidasCompletas(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
                    res.json(data)
				}
			})
		}
    })
    app.post('/getComponentes',(req,res)=>{
		if (req.body.id_ficha == null ||req.body.id_ficha == "null"||req.body.id_ficha == "") {
			res.json("null");
		} else {
			User.getComponentes(req.body.id_ficha,(err,componentes)=>{
				if(err){ res.status(204).json(err);}
				else{
                    User.getPartidas(componentes[0].id_componente,(err,partidas)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            componentes[0].partidas = partidas
                            res.json(componentes);	
                        }
                    })
                   
				}
			})
		}
    })
    app.post('/getPartidas',(req,res)=>{
		if (req.body.id_componente == null ||req.body.id_componente == "null"||req.body.id_componente == "") {
			res.json("null");
		} else {
			User.getPartidas(req.body.id_componente,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getActividades',(req,res)=>{
		if (req.body.id_partida == null ||req.body.id_partida == "null"||req.body.id_partida == "") {
			res.json("null");
		} else {
			User.getActividades(req.body.id_partida,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
                    User.getPartidasMayorMetradoAvance(req.body.id_partida,(err,mayorMetrado)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            mayorMetrado = mayorMetrado||{}
                            res.json(
                                {
                                    "mayor_metrado":{
                                        "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                        "mm_avance_costo": mayorMetrado.avance_costo||0,
                                        "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                        "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                        "mm_porcentaje": mayorMetrado.porcentaje||0
                                    },
                                    "actividades":data
                                }
                            );
                        }
                    })	
				}
			})
		}
    })
    
    app.post('/getComponentesPNuevas',(req,res)=>{
        
        if (req.body.id_ficha == null) {
			res.json("null");
		} else {
			User.getComponentesPNuevas(req.body.id_ficha,(err,componentes)=>{
                if(err == "vacio"){
                    res.json(err)
                }
				else if(err){ res.status(204).json(err);}
				else{
                    console.log("pasa componentes nuevos");
                
                    User.getPartidasPNuevas(componentes[0].id_componente,(err,partidas)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            componentes[0].partidas = partidas
                            res.json(componentes);	
                        }
                    })
                   
				}
			})
		}
    })
    app.post('/getPartidasPNuevas',(req,res)=>{
		if (req.body.id_componente == null ||req.body.id_componente == "null"||req.body.id_componente == "") {
			res.json("null");
		} else {
			User.getPartidasPNuevas(req.body.id_componente,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getActividadesPNuevas',(req,res)=>{
		if (req.body.id_partida == null ||req.body.id_partida == "null"||req.body.id_partida == "") {
			res.json("null");
		} else {
			User.getActividades(req.body.id_partida,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
                    User.getPartidasMayorMetradoAvance(req.body.id_partida,(err,mayorMetrado)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            mayorMetrado = mayorMetrado||{}
                            res.json(
                                {
                                    "mayor_metrado":{
                                        "mm_avance_metrado": mayorMetrado.avance_metrado||0,
                                        "mm_avance_costo": mayorMetrado.avance_costo||0,
                                        "mm_metrados_saldo": mayorMetrado.metrados_saldo||0,
                                        "mm_metrados_costo_saldo": mayorMetrado.metrados_costo_saldo||0,
                                        "mm_porcentaje": mayorMetrado.porcentaje||0
                                    },
                                    "actividades":data
                                }
                            );
                        }
                    })	
				}
			})
		}
    })
    //gethistorial
    app.post('/getHistorial',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {			
            User.getHistorial(req.body.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
    
    
    })
    app.post('/getHistorialComponentes',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {			
            User.getHistorialComponentes(req.body.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
    
    
    })
    app.post('/getHistorialFechas',(req,res)=>{
        if (req.body.id_componente == null) {
            res.json("null")
        } else {			
            User.getHistorialFechas(req.body.id_componente,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
    
    
    })
    app.post('/getHistorialFechasHistorial',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {			
            User.getHistorial(req.body.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
    
    
    })  
    app.post('/getHistorialRegresionLineal',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {			
            User.getHistorialRegresionLineal(req.body.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
    
    
    })

    //old apis
    app.post('/getValGeneral',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneral(req.body.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
    })
    app.post('/getValGeneralPartidasNuevas',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneralExtras(req.body.id_ficha,"Partida Nueva",(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }			
        
    })
    app.post('/getValGeneralMayorMetrado',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneralExtras(req.body.id_ficha,"Mayor Metrado",(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }			
        
    })  
    // valorizacionesgenerales
    app.post('/getValGeneralAnyos',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneralAnyos(req.body.id_ficha,(err,anyos)=>{
                if(err){ res.status(204).json(err);}
                else{
                    User.getValGeneralPeriodos(req.body.id_ficha,anyos[0].anyo,(err,periodos)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            User.getValGeneralResumenPeriodo(req.body.id_ficha,periodos[0].fecha_inicial,periodos[0].fecha_final,(err,resumen)=>{
                                if(err){ res.status(204).json(err);}
                                else{
                                    User.getValGeneralComponentes(req.body.id_ficha,(err,componentes)=>{
                                        if(err){ res.status(204).json(err);}
                                        else{
                                            periodos[0].resumen = resumen
                                            periodos[0].componentes = componentes
                                            anyos[0].periodos = periodos
                                            res.json(anyos);	
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
    app.post('/getValGeneralPeriodos',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneralPeriodos(req.body.id_ficha,req.body.anyo,(err,periodos)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(periodos)
                }
            })
        }            
        
    })
    app.post('/getValGeneralComponentes',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneralComponentes(req.body.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
            
        
    })
    app.post('/getValGeneralResumenPeriodo',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneralResumenPeriodo(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
            
        
    })
    app.post('/getValGeneralPartidas',(req,res)=>{
        if (req.body.id_componente == null) {
            res.json("null")
        } else {
            User.getValGeneralPartidas(req.body.id_componente,req.body.fecha_inicial,req.body.fecha_final,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
            
        
    })
    // app.post('/getValGeneralAnyos',(req,res)=>{
    //     if (req.body.id_ficha == null) {
    //         res.json("null")
    //     } else {
    //         User.getValGeneraMayoresMetradoslAnyos(req.body.id_ficha,'principal',(err,anyos)=>{
    //             if(err){ res.status(204).json(err);}
    //             else{
    //                 // res.json(anyos)
    //                 User.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha,anyos[0].anyo,'principal',(err,periodos)=>{
    //                     if(err){ res.status(204).json(err);}
    //                     else{
    //                         User.getValGeneralMayoresMetradosResumenPeriodo(req.body.id_ficha,periodos[0].fecha_inicial,periodos[0].fecha_final,'principal',(err,resumen)=>{
    //                             if(err){ res.status(204).json(err);}
    //                             else{
                                    
    //                                 User.getValGeneralMayoresMetradosComponentes(periodos[0].fecha_inicial,periodos[0].fecha_final,req.body.id_ficha,'principal',(err,componentes)=>{
    //                                     // res.json(periodos)
    //                                     if(err){ res.status(204).json(err);}
    //                                     else{
    //                                         periodos[0].resumen = resumen
    //                                         periodos[0].componentes = componentes
    //                                         anyos[0].periodos = periodos
    //                                         res.json(anyos);	
    //                                     }
    //                                 })
    //                             }
    //                         })
                           
                            
                            
    //                     }
    //                 })
    //             }
    //         })
    //     }            
        
    // })
    // app.post('/getValGeneralPeriodos',(req,res)=>{
    //     if (req.body.id_ficha == null) {
    //         res.json("null")
    //     } else {
    //         User.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha,req.body.anyo,'principal',(err,periodos)=>{
    //             if(err){ res.status(204).json(err);}
    //             else{
    //                 res.json(periodos)
    //             }
    //         })
    //     }            
        
    // })
    // app.post('/getValGeneralComponentes',(req,res)=>{
    //     if (req.body.id_ficha == null) {
    //         res.json("null")
    //     } else {
    //         // res.json("test")
    //         User.getValGeneralMayoresMetradosComponentes(req.body.fecha_inicial,req.body.fecha_final,req.body.id_ficha,'principal',(err,data)=>{
    //             if(err){ res.status(204).json(err);}
    //             else{
    //                 res.json(data);	
    //             }
    //         })
    //     }
            
        
    // })
    // app.post('/getValGeneralResumenPeriodo',(req,res)=>{
    //     if (req.body.id_ficha == null) {
    //         res.json("null")
    //     } else {
    //         User.getValGeneralMayoresMetradosResumenPeriodo(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,'principal',(err,data)=>{
    //             if(err){ res.status(204).json(err);}
    //             else{
    //                 res.json(data);	
    //             }
    //         })
    //     }
            
        
    // })
    // app.post('/getValGeneralPartidas',(req,res)=>{
    //     if (req.body.id_componente == null) {
    //         res.json("null")
    //     } else {
    //         User.getValGeneralMayoresMetradosPartidas(req.body.id_componente,req.body.fecha_inicial,req.body.fecha_final,'principal',(err,data)=>{
    //             if(err){ res.status(204).json(err);}
    //             else{
    //                 res.json(data);	
    //             }
    //         })
    //     }
            
        
    // })
    //valorizaciones Mayor metrado
    app.post('/getValGeneraMayoresMetradoslAnyos',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneraMayoresMetradoslAnyos(req.body.id_ficha,'Mayor Metrado',(err,anyos)=>{
                if(err){ res.status(204).json(err);}
                else{
                    // res.json(anyos)
                    User.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha,anyos[0].anyo,'Mayor Metrado',(err,periodos)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            User.getValGeneralMayoresMetradosResumenPeriodo(req.body.id_ficha,periodos[0].fecha_inicial,periodos[0].fecha_final,'Mayor Metrado',(err,resumen)=>{
                                if(err){ res.status(204).json(err);}
                                else{
                                    
                                    User.getValGeneralMayoresMetradosComponentes(periodos[0].fecha_inicial,periodos[0].fecha_final,req.body.id_ficha,'Mayor Metrado',(err,componentes)=>{
                                        // res.json(periodos)
                                        if(err){ res.status(204).json(err);}
                                        else{
                                            periodos[0].resumen = resumen
                                            periodos[0].componentes = componentes
                                            anyos[0].periodos = periodos
                                            res.json(anyos);	
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
    app.post('/getValGeneralMayoresMetradosPeriodos',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha,req.body.anyo,'Mayor Metrado',(err,periodos)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(periodos)
                }
            })
        }            
        
    })
    app.post('/getValGeneralMayoresMetradosComponentes',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            // res.json("test")
            User.getValGeneralMayoresMetradosComponentes(req.body.fecha_inicial,req.body.fecha_final,req.body.id_ficha,'Mayor Metrado',(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
            
        
    })
    app.post('/getValGeneralMayoresMetradosResumenPeriodo',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneralMayoresMetradosResumenPeriodo(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,'Mayor Metrado',(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
            
        
    })
    app.post('/getValGeneralMayoresMetradosPartidas',(req,res)=>{
        if (req.body.id_componente == null) {
            res.json("null")
        } else {
            User.getValGeneralMayoresMetradosPartidas(req.body.id_componente,req.body.fecha_inicial,req.body.fecha_final,'Mayor Metrado',(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
            
        
    })
      //valorizaciones partidaNUEVA 
    app.post('/getValGeneraPartidaNuevalAnyos',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneraMayoresMetradoslAnyos(req.body.id_ficha,'Partida Nueva',(err,anyos)=>{
                if(err){ res.status(204).json(err);}
                else{
                    // res.json(anyos)
                    User.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha,anyos[0].anyo,'Partida Nueva',(err,periodos)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            User.getValGeneralMayoresMetradosResumenPeriodo(req.body.id_ficha,periodos[0].fecha_inicial,periodos[0].fecha_final,'Partida Nueva',(err,resumen)=>{
                                if(err){ res.status(204).json(err);}
                                else{
                                    
                                    User.getValGeneralMayoresMetradosComponentes(periodos[0].fecha_inicial,periodos[0].fecha_final,req.body.id_ficha,'Partida Nueva',(err,componentes)=>{
                                        // res.json(periodos)
                                        if(err){ res.status(204).json(err);}
                                        else{
                                            periodos[0].resumen = resumen
                                            periodos[0].componentes = componentes
                                            anyos[0].periodos = periodos
                                            res.json(anyos);	
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
    app.post('/getValGeneralPartidaNuevaPeriodos',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha,req.body.anyo,'Partida Nueva',(err,periodos)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(periodos)
                }
            })
        }            
        
    })
    app.post('/getValGeneralPartidaNuevaComponentes',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            // res.json("test")
            User.getValGeneralMayoresMetradosComponentes(req.body.fecha_inicial,req.body.fecha_final,req.body.id_ficha,'Partida Nueva',(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
            
        
    })
    app.post('/getValGeneralPartidaNuevaResumenPeriodo',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getValGeneralMayoresMetradosResumenPeriodo(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,'Partida Nueva',(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
            
        
    })
    app.post('/getValGeneralPartidaNuevaPartidas',(req,res)=>{
        if (req.body.id_componente == null) {
            res.json("null")
        } else {
            User.getValGeneralMayoresMetradosPartidas(req.body.id_componente,req.body.fecha_inicial,req.body.fecha_final,'Partida Nueva',(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }
            
        
    })
    
    
    //recursos
    app.post('/getActividadesDuracion',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getActividadesDuracion(req.body.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }			
        
    })
    app.post('/getMaterialesPorObra',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getMaterialesPorObra(req.body.id_ficha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }			
        
    })
    //imagenes
    app.post('/getImagenesComponentes',(req,res)=>{
		if (req.body.id_ficha == null ||req.body.id_ficha == "null"||req.body.id_ficha == "") {
			res.json("null");
		} else {
			User.getImagenesComponentes(req.body.id_ficha,(err,componentes)=>{
                if(err){ res.status(204).json(err);}
                else if(componentes == "vacio"){
                    res.json(componentes)
                }
				else{                    
                    User.getImagenesPartidas(componentes[0].id_componente,(err,partidas)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            componentes[0].partidas = partidas
                            res.json(componentes);	
                        }
                    })
                   
				}
			})
		}
    })
    app.post('/getImagenesPartidas',(req,res)=>{
		if (req.body.id_componente == null ||req.body.id_componente == "null"||req.body.id_componente == "") {
			res.json("null");
		} else {
			User.getImagenesPartidas(req.body.id_componente,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getImagenesListaPorPartida',(req,res)=>{
		if (req.body.id_partida == null) {
			res.json("null");
		} else {
			User.getImagenesListaPorPartida(req.body.id_partida,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getImagenesPrimeraImagenPartida',(req,res)=>{
		if (req.body.id_partida == null) {
			res.json("null");
		} else {
			User.getImagenesPrimeraImagenPartida(req.body.id_partida,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getImagenesUltimaImagenPartida',(req,res)=>{
		if (req.body.id_partida == null) {
			res.json("null");
		} else {
			User.getImagenesUltimaImagenPartida(req.body.id_partida,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getmaterialescomponentes',(req,res)=>{
		if (req.body.id_ficha == null) {
			res.json("null");
		} else {
			User.getmaterialescomponentes(req.body.id_ficha,(err,componentes)=>{
				if(err){ res.status(204).json(err);}
				else{
					User.getmaterialespartidacomponente(componentes[0].id_componente,(err,partidas)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            componentes[0].partidas = partidas
                            res.json(componentes);
                        }
                    })	
				}
			})
		}
    })

    app.post('/getmaterialespartidacomponente',(req,res)=>{
		if (req.body.id_componente== null) {
			res.json("null");
		} else {
			User.getmaterialespartidacomponente(req.body.id_componente,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })

    app.post('/getmaterialespartida',(req,res)=>{
		if (req.body.id_partida== null) {
			res.json("null");
		} else {
			User.getmaterialespartida (req.body.id_partida,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })

    
}
