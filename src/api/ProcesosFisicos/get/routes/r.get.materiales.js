const User = require('../models/m.get.materiales');

module.exports = function(app){
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
    app.post('/getmaterialespartidaTipos',(req,res)=>{
		if (req.body.id_partida== null) {
			res.json("null");
		} else {
			User.getmaterialespartidaTipos (req.body.id_partida,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getmaterialespartidaTiposLista',(req,res)=>{
		if (req.body.id_partida== null) {
			res.json("null");
		} else {
			User.getmaterialespartidaTiposLista (req.body.id_partida,req.body.tipo,(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getmaterialesResumenManoDeObra',(req,res)=>{
		if (req.body.id_ficha== null) {
			res.json("null");
		} else {
			User.getmaterialesResumen(req.body.id_ficha,'Mano de Obra',(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getmaterialesResumenMateriales',(req,res)=>{
		if (req.body.id_ficha== null) {
			res.json("null");
		} else {
			User.getmaterialesResumen(req.body.id_ficha,'Materiales',(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
    })
    app.post('/getmaterialesResumenEquipos',(req,res)=>{
		if (req.body.id_ficha== null) {
			res.json("null");
		} else {
			User.getmaterialesResumen(req.body.id_ficha,'Equipos',(err,data)=>{
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}
			})
		}
		})
		app.post('/getmaterialesResumenAvanceManoDeObra',async(req,res)=>{
			try {
				var materialesResumen = await User.getmaterialesResumenAvance(req.body.id_ficha,'Mano de Obra')	
				res.json(materialesResumen)
			} catch (error) {
				res.status(400).json(error)
			}
		})
		app.post('/getmaterialesResumenAvanceMateriales',async(req,res)=>{
			try {
				var materialesResumen = await User.getmaterialesResumenAvance(req.body.id_ficha,'Materiales')	
				res.json(materialesResumen)
			} catch (error) {
				res.status(400).json(error)
			}
		})
		app.post('/getmaterialesResumenAvanceEquipos',async(req,res)=>{
			try {
				var materialesResumen = await User.getmaterialesResumenAvance(req.body.id_ficha,'Equipos')	
				res.json(materialesResumen)
			} catch (error) {
				res.status(400).json(error)
			}
		})
}