const User = require('../models/m.get.pFisicos');

module.exports = function(app){
    app.post('/listaPartidas',(req,res)=>{
		if (req.body.id_ficha == null ||req.body.id_ficha == "null"||req.body.id_ficha == "") {
			res.json("null");
		} else {
			User.getPartidas(req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
	})
    app.post('/listaPartidasNuevas',(req,res)=>{
        if (req.body.id_ficha == null ||req.body.id_ficha == "null"||req.body.id_ficha == "") {
            res.json("null");
        } else {
            User.getPartidasNuevas(req.body.id_ficha,(err,data)=>{
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
