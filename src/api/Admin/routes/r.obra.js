const User = require('../models/m.obra');

module.exports = function (app) {
    //gethistorial
    app.put('/fichas', async (req, res) => {
        try {
            var message = ""
            var response = await User.putFichas(req.body)
            if (response.affectedRows>0) {
                message = "Actualizado con exito"
                res.status(200).json({message})
                return 
            }else{
                message = "Hubo un problema"
                res.status(400).json({message})
                return
            }
            res.json(response);
        } catch (error) {
            console.log(error);
            res.status(400).json('error');
        }
    })
}