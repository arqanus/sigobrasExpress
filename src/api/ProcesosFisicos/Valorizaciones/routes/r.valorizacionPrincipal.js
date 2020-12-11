const User = require('../models/m.valorizacionPrincipal');
module.exports = (app) => {
    app.post('/getValGeneralAnyos', async (req, res) => {
        try {
            var anyos = await User.getValGeneralAnyos(req.body.id_ficha)
            var periodos = await User.getValGeneralPeriodos(req.body.id_ficha, anyos[anyos.length - 1].anyo, "FALSE")
            var componentes = await User.getValGeneralComponentes(req.body.id_ficha)
            var resumen = await User.getValGeneralResumenPeriodo(req.body.id_ficha, periodos[periodos.length - 1].fecha_inicial, periodos[periodos.length - 1].fecha_final, true)

            periodos[periodos.length - 1].resumen = resumen
            periodos[periodos.length - 1].componentes = componentes
            anyos[anyos.length - 1].periodos = periodos
            res.json(anyos);
        } catch (error) {
            res.status(204).json(error)
        }

    })
}
