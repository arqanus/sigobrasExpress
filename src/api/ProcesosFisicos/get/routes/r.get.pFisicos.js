const User = require('../models/m.get.pFisicos');

module.exports = function(app){
    app.post('/getComponentesPf',(req,res)=>{
		if (req.body.id_ficha == null ||req.body.id_ficha == "null"||req.body.id_ficha == "") {
			res.json("null");
		} else {
			User.getComponentes(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
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
