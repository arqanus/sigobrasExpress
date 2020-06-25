const User = require('../models/m.get.plazos');

module.exports = (app) => {
    app.post('/getPlazos', async (req, res) => {
        try {
            var plazosPadre = await User.getPlazos(req.body.id_ficha,1)
            var plazos = []
            for (let i = 0; i < plazosPadre.length; i++) {
                const padre = plazosPadre[i];
                var hijo = await User.getPlazos(req.body.id_ficha,2,padre.idplazos_historial)
                plazos.push(padre)
                plazos = plazos.concat(hijo)
            }
            // console.log("plazos",plazos);
            
            res.json(plazos)
        } catch (err) {
            console.log(err);
            res.status(204).json(err)
        }
    })
    app.post('/putPlazos', async (req, res) => {
        try {
            var padre_id = 0
            for (let i = 0; i < req.body.length; i++) {
                const padre = req.body[i];
                
                if(padre[2]==1){
                    padre_id = padre[0]
                    // console.log("padre_id",padre_id);
                    // console.log("padre",padre);
                    var padre_res = await User.putPlazos([padre])
                    if(padre_id == null){
                        padre_id = padre_res.insertId
                    }
                    // console.log("padre_id",padre_id);
                }else{
                    padre[padre.length-1] = padre_id
                    // console.log("hijo",padre);
                    var padre_res = await User.putPlazos([padre])                                     
                }
                // console.log(padre_res);
                
            }
            res.json("exito")
        } catch (err) {
            console.log(err);
            res.status(204).json(err)
        }
    })
    app.post('/deletePlazos', async (req, res) => {
        try {
            var data = await User.deletePlazos(req.body.idplazos_historial)
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(204).json(err)
        }
    })
    app.post('/getPlazosTipo', async (req, res) => {
        try {
            var data = await User.getPlazosTipo(req.body.nivel)
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(204).json(err)
        }
    })
}