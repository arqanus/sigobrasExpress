const User = require('./m.CostosIndirectos');

module.exports = function (app) {
    app.get('/costosIndirectos', async (req, res) => {
        try {
            var data = await User.getCostosIndirectos(req.query)
            console.log(req.query);
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: err.code })
        }
    })
    app.get('/costosIndirectosAdicionales', async (req, res) => {
        try {
            var response = await User.getAmpliacionPresupuesto(req.query)
            var response2 = await User.getCostosIndirectosAdicionales(req.query,response)
            res.json({cantidad:response.length,data:response2})
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: err.code })
        }
    })
    app.post('/costosIndirectos', async (req, res) => {
        try {
            var data = await User.postCostosIndirectos(req.body)
            res.json(data)
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: err.code })
        }
    })
    app.delete('/costoIndirecto',async(req,res)=>{
		try {
			var data = await User.deleteCostoIndirecto(req.body)
			res.json(data);
		} catch (error) {
			res.status(400).json(error)
		}
    })
    app.put('/costoIndirecto', async (req, res) => {
        try {
            var message = ""
            var response = await User.putCostoIndirecto(req.body)
            if (response.affectedRows>0) {
                message = "Actualizado con exito"
                res.status(200).json({message})
                return 
            }else{
                message = "Hubo un problema"
                res.status(400).json({message})
                return
            }
        } catch (error) {
            console.log(error);
            res.status(400).json('error');
        }
    })
}