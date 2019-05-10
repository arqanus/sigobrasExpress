const User = require('../models/m.get.materiales');

module.exports = function(app){
		app.post('/getmaterialesResumen',async(req,res)=>{
			try {
				var getmaterialesResumen = await  User.getmaterialesResumen(req.body.id_ficha,req.body.tipo)
				res.json(getmaterialesResumen)
			} catch (error) {
				res.status(400).json(error);	
			}
		})
		app.post('/getmaterialesResumenChart',async(req,res)=>{
			try {
				// var getmaterialesResumen = await  User.getmaterialesResumen(req.body.id_ficha,req.body.tipo)
				res.json(
					""
				)
			} catch (error) {
				res.status(400).json(error);	
			}
		})
    app.post('/getmaterialescomponentes',async(req,res)=>{
			try {
				var componentes = await  User.getmaterialescomponentes(req.body.id_ficha)
				var partidas = await  User.getmaterialespartidacomponente(componentes[0].id_componente)
				componentes[0].partidas = partidas
				res.json(componentes);
			} catch (error) {
				res.status(400).json(error);	
			}
		})
		app.post('/getmaterialescomponentesResumen',async(req,res)=>{
			try {
				var data = await  User.getmaterialescomponentesResumen(req.body.id_componente,req.body.tipo)
				res.json(data);
			} catch (error) {
				res.status(400).json(error);	
			}
    })
    app.post('/getmaterialespartidacomponente',async(req,res)=>{
			try {
				var data = await  User.getmaterialespartidacomponente(req.body.id_componente)
				res.json(data);
			} catch (error) {
				res.status(400).json(error);	
			}
		})
	
    app.post('/getmaterialespartidaTipos',async(req,res)=>{
			try {
				var data = await  User.getmaterialespartidaTipos(req.body.id_partida)
				res.json(data);
			} catch (error) {
				res.status(400).json(error);	
			}
    })
    app.post('/getmaterialespartidaTiposLista',async(req,res)=>{
			try {
				var data = await User.getmaterialespartidaTiposLista (req.body.id_partida,req.body.tipo)
				res.json(data);
			} catch (error) {
				res.status(400).json(error);	
			}
		})
		
}