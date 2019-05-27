const User = require('../models/m.get.valGeneral');

module.exports = (app)=>{
    // valorizacionesgenerales
    app.post('/getValGeneralAnyos',async (req,res)=>{
        try {
            var anyos = await User.getValGeneralAnyos(req.body.id_ficha)
            var periodos = await User.getValGeneralPeriodos(req.body.id_ficha,anyos[anyos.length -1].anyo,"FALSE")
            var componentes  = await User.getValGeneralComponentes(req.body.id_ficha)
            var resumen = await User.getValGeneralResumenPeriodo(req.body.id_ficha,periodos[periodos.length-1].fecha_inicial,periodos[periodos.length-1].fecha_final,true)

            periodos[periodos.length-1].resumen = resumen
            periodos[periodos.length-1].componentes = componentes
            anyos[anyos.length-1].periodos = periodos
            res.json(anyos);
        } catch (error) {
            res.status(204).json(error)
        }
        	        
    })
    app.post('/getValGeneralPeriodos',async (req,res)=>{
        try {
            var periodos = await User.getValGeneralPeriodos(req.body.id_ficha,req.body.anyo,"FALSE")
            res.json(periodos)
        } catch (error) {
            res.status(204).json(error)
        }
    })
    app.post('/getValGeneralComponentes',async (req,res)=>{
        try {
            var componentes = await User.getValGeneralComponentes(req.body.id_ficha)
            res.json(componentes)
        } catch (error) {
            res.status(204).json(error)
        }
    })
    app.post('/getValGeneralResumenPeriodo',async (req,res)=>{
        try {
            var resumen = await User.getValGeneralResumenPeriodo(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,true)
            res.json(resumen)
        } catch (error) {
            res.status(204).json(error)
        }
    })
    app.post('/getValGeneralPartidas',async (req,res)=>{
        try {
            var partidas = await User.getValGeneralPartidas(req.body.id_componente,req.body.fecha_inicial,req.body.fecha_final)
            res.json(partidas)
        } catch (error) {
            res.status(204).json(error)
        }
    })

    //valorizaciones Mayor metrado
    app.post('/getValGeneraMayoresMetradoslAnyos',async (req,res)=>{
        try {
            var anyos  = await User.getValGeneraMayoresMetradoslAnyos(req.body.id_ficha,'Mayor Metrado')
            var periodos  = await User.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha,anyos[anyos.length-1].anyo,'Mayor Metrado')
            var resumen  = await User.getValGeneralMayoresMetradosResumenPeriodo(req.body.id_ficha,periodos[periodos.length-1].fecha_inicial,periodos[periodos.length-1].fecha_final,'Mayor Metrado')
            var componentes  = await User.getValGeneralMayoresMetradosComponentes(periodos[periodos.length-1].fecha_inicial,periodos[periodos.length-1].fecha_final,req.body.id_ficha,'Mayor Metrado')

            periodos[periodos.length-1].resumen = resumen
            periodos[periodos.length-1].componentes = componentes
            anyos[anyos.length-1].periodos = periodos
            res.json(anyos);	

        } catch (error) {
            res.status(204).json(error)
        }
    })
    app.post('/getValGeneralMayoresMetradosPeriodos',async (req,res)=>{
        try {
            var periodos  = await User.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha,req.body.anyo,'Mayor Metrado')
            res.json(periodos)
        } catch (error) {
            res.status(204).json(error)
        }                   
        
    })
    app.post('/getValGeneralMayoresMetradosComponentes',async (req,res)=>{
        try {
            var componentes  = await User.getValGeneralMayoresMetradosComponentes(req.body.fecha_inicial,req.body.fecha_final,req.body.id_ficha,'Mayor Metrado')
            res.json(componentes)
        } catch (error) {
            console.log(error);
            res.status(204).json(error)
        } 
    })
    app.post('/getValGeneralMayoresMetradosResumenPeriodo',async (req,res)=>{
        try {
            var resumen  = await User.getValGeneralMayoresMetradosResumenPeriodo(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,'Mayor Metrado')
            res.json(resumen)
        } catch (error) {
            console.log(error);
            res.status(204).json(error)
        } 
    })
    app.post('/getValGeneralMayoresMetradosPartidas',async(req,res)=>{
        try {
            var partidas  = await User.getValGeneralMayoresMetradosPartidas(req.body.id_componente,req.body.fecha_inicial,req.body.fecha_final,'Mayor Metrado')
            res.json(partidas)
        } catch (error) {
            console.log(error);
            res.status(204).json(error)
        } 
    })
    //valorizaciones partidaNUEVA 
    app.post('/getValGeneraPartidaNuevaAnyos',async (req,res)=>{
        try {
            var anyos  = await User.getValGeneraMayoresMetradoslAnyos(req.body.id_ficha,'Partida Nueva')
            var periodos  = await User.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha,anyos[anyos.length-1].anyo,'Partida Nueva')
            var resumen  = await User.getValGeneralMayoresMetradosResumenPeriodo(req.body.id_ficha,periodos[periodos.length-1].fecha_inicial,periodos[periodos.length-1].fecha_final,'Partida Nueva')
            var componentes  = await User.getValGeneralMayoresMetradosComponentes(periodos[periodos.length-1].fecha_inicial,periodos[periodos.length-1].fecha_final,req.body.id_ficha,'Partida Nueva')

            periodos[periodos.length-1].resumen = resumen
            periodos[periodos.length-1].componentes = componentes
            anyos[anyos.length-1].periodos = periodos
            res.json(anyos);	
            
        } catch (error) {
            res.status(204).json(error)
        }
    })
    app.post('/getValGeneralPartidaNuevaPeriodos',async (req,res)=>{
        try {
            var periodos  = await User.getValGeneralMayoresMetradosPeriodos(req.body.id_ficha,req.body.anyo,'Partida Nueva')
            res.json(periodos)
        } catch (error) {
            res.status(204).json(error)
        }                   
        
    })
    app.post('/getValGeneralPartidaNuevaComponentes',async (req,res)=>{
        try {
            var componentes  = await User.getValGeneralMayoresMetradosComponentes(req.body.fecha_inicial,req.body.fecha_final,req.body.id_ficha,'Partida Nueva')
            res.json(componentes)
        } catch (error) {
            console.log(error);
            res.status(204).json(error)
        } 
    })
    app.post('/getValGeneralPartidaNuevaResumenPeriodo',async (req,res)=>{
        try {
            var resumen  = await User.getValGeneralMayoresMetradosResumenPeriodo(req.body.id_ficha,req.body.fecha_inicial,req.body.fecha_final,'Partida Nueva')
            res.json(resumen)
        } catch (error) {
            console.log(error);
            res.status(204).json(error)
        } 
    })
    app.post('/getValGeneralPartidaNuevaPartidas',async(req,res)=>{
        try {
            var partidas  = await User.getValGeneralMayoresMetradosPartidas(req.body.id_componente,req.body.fecha_inicial,req.body.fecha_final,'Partida Nueva')
            res.json(partidas)
        } catch (error) {
            console.log(error);
            res.status(204).json(error)
        } 
    })
}
