const User = require('../models/m.get.historial');

module.exports = function(app){
    //gethistorial
    app.post('/getHistorialAnyos',async(req,res)=>{
        try {
            var anyos = await User.getHistorialAnyos(req.body.id_ficha)
            var meses = await User.getHistorialMeses(req.body.id_ficha,anyos[anyos.length-1].anyo)
            var resumen = await User.getHistorialAnyosResumen(req.body.id_ficha,anyos[anyos.length-1].anyo)
            var componentes = await User.getHistorialComponentes(req.body.id_ficha,meses[meses.length-1].fecha)
            meses[meses.length-1].componentes = componentes
            meses[meses.length-1].resumen = resumen
            anyos[anyos.length-1].meses = meses
            res.json(anyos);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialAnyosResumen',async(req,res)=>{
        try {
            var data = await User.getHistorialAnyosResumen(req.body.id_ficha,req.body.anyo)
            res.json(data)
        } catch (error) {
            console.log(error)
            res.status(400).json(error)
        }
    })
    app.post('/getHistorialMeses',async(req,res)=>{
        try {
            var meses = await User.getHistorialMeses(req.body.id_ficha,req.body.anyo)
            res.json(meses);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialResumen',async(req,res)=>{
        try {
            var resumen = await User.getHistorialResumen(req.body.id_ficha,req.body.fecha)
            res.json(resumen);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialComponentes',async(req,res)=>{
        try {
            var componentes = await User.getHistorialComponentes(req.body.id_ficha,req.body.fecha)
            res.json(componentes);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialFechas',async(req,res)=>{
        try {
            var fechas = await User.getHistorialFechas(req.body.id_componente,req.body.fecha)
            res.json(fechas);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialDias',async(req,res)=>{
        try {
            var historial = await User.getHistorialDias(req.body.id_componente,req.body.fecha)
            res.json(historial);
        } catch (error) {
            res.status(400).json(error);
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

