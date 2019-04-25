const User = require('../models/m.get.historial');

module.exports = function(app){
    //gethistorial
    app.post('/getHistorialAnyos',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {			
            User.getHistorialAnyos(req.body.id_ficha,(err,anyos)=>{
                if(err){ res.status(204).json(err);}
                else{
                    User.getHistorialMeses(req.body.id_ficha,anyos[anyos.length-1].anyo,(err,meses)=>{
                        if(err){ res.status(204).json(err);}
                        else{
                            User.getHistorialResumen(req.body.id_ficha,meses[meses.length-1].fecha,(err,resumen)=>{
                                if(err){ res.status(204).json(err);}
                                else{
                                    User.getHistorialComponentes(req.body.id_ficha,meses[meses.length-1].fecha,(err,componentes)=>{
                                        if(err){ res.status(204).json(err);}
                                        else{
                                            meses[meses.length-1].componentes = componentes
                                            meses[meses.length-1].resumen = resumen
                                            anyos[anyos.length-1].meses = meses
                                            // anyos[0].meses = meses
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
    app.post('/getHistorialMeses',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {			
            User.getHistorialMeses(req.body.id_ficha,req.body.anyo,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }


    })
    app.post('/getHistorialResumen',(req,res)=>{
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {			
            User.getHistorialResumen(req.body.id_ficha,req.body.fecha,(err,data)=>{
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
            User.getHistorialComponentes(req.body.id_ficha,req.body.fecha,(err,data)=>{
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
            User.getHistorialFechas(req.body.id_componente,req.body.fecha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }


    })
    app.post('/getHistorialDias',(req,res)=>{
        if (req.body.id_componente == null) {
            res.json("null")
        } else {			
            User.getHistorialDias(req.body.id_componente,req.body.fecha,(err,data)=>{
                if(err){ res.status(204).json(err);}
                else{
                    res.json(data);	
                }
            })
        }


    })
    app.post('/getHistorialComponenteChart',(req,res)=>{
        if (req.body.id_componente == null) {
            res.json("null")
        } else {			
            User.getHistorialComponenteChart(req.body.id_componente,req.body.fecha,(err,data)=>{
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
    
}

