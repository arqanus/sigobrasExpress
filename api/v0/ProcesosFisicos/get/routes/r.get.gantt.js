const User = require('../models/m.get.gantt');

module.exports = function(app){
    app.post('/getGanttAnyos',(req,res)=>{
		if (req.body.id_ficha== null) {
			res.json("null");
		} else {
			User.getGanttAnyos (req.body.id_ficha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getGanttMeses',(req,res)=>{
		if (req.body.id_ficha== null) {
			res.json("null");
		} else {
			User.getGanttMeses (req.body.id_ficha,req.body.anyo,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getGanttComponentes',(req,res)=>{
		if (req.body.id_ficha== null) {
			res.json("null");
		} else {
			User.getGanttComponentes (req.body.id_ficha,req.body.fecha,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getGanttPartidas',async(req,res)=>{
			var dias = await User.getGanttPartidasDias(req.body.fecha)
			var partidas = await User.getGanttPartidas(req.body.id_componente,req.body.fecha)
			res.json(
				{
					dias,
					partidas
				}
			)
    })
}