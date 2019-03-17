const User = require('../models/m.get.obras');

module.exports = function(app){

    app.get('/listaObras',(req,res)=>{
        User.getObras((err,data)=>{
            if(err) res.status(204).json(err);
            res.json(data);	
        })
    })
    app.get('/listaEstados',(req,res)=>{	
		
		
		User.getEstados((err,data)=>{			
			if(err){
				res.status(204).json(err);
			} else{
				res.status(200).json(data);
			}
			
		})
	})
	app.post('/listaComponentesPorId',(req,res)=>{
		User.getComponentesById(req.body.id_ficha,(err,data)=>{
			if(err) {res.status(204).json(err);}
			else{
				res.json(data);	
			}
		})
	})
	app.get('/getTipoObras',(req,res)=>{
		
		User.getTipoObras((err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
		
	})
	app.get('/getUnidadEjecutora',(req,res)=>{
		
		User.getUnidadEjecutora((err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
	
	
		
	})
}