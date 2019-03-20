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
                    // res.json(componentes[0].id_componente)
                    User.getPartidasActividades(componentes[0].id_componente,(err,partidas)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            res.json(
                                {
                                    "componentes":componentes,
                                    "partidas":partidas
                                }
                            );	
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
					res.json(data);	
				}
			})
		}
    })
    
    app.post('/getComponentesPNuevas',(req,res)=>{
		if (req.body.id_ficha == null ||req.body.id_ficha == "null"||req.body.id_ficha == "") {
			res.json("null");
		} else {
			User.getComponentesPNuevas(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
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
			User.getActividadesPNuevas(req.body.id_partida,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
	})
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
}