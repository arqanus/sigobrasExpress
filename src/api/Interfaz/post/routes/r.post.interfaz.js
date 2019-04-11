const User = require('../models/m.post.interfaz');


module.exports = function(app){
    app.post('/ActualizarEstado',(req,res)=>{
        User.ultimoEstadoObra(req.body.Fichas_id_ficha,(err,data)=>{							
            if(err){ res.status(204).json(err);}
            else{
                if(data.Estados_id_Estado == req.body.Estados_id_estado){
                    res.json("EstadoRepetido");	
                }else{                    
                    User.postHistorialEstados(req.body,(err,id_historial)=>{							
                        if(err){ res.status(204).json(err);}
                        else{	           
                            User.getestadoIdHistorialEstados(id_historial,(err,estado)=>{							
                                if(err){ res.status(204).json(err);}
                                else{                                    
                                    res.json(estado);	
                                }
            
                            })
                        }
            
                    })	
                }
                
            }

        })
		
		
    })
    app.post('/postHistorialEstadosObra',(req,res)=>{
        User.postHistorialEstadosObra(req.body,(err,data)=>{							
            if(err){ res.status(204).json(err);}
            else{
               res.json(data)
                
            }

        })
		
		
	})
}