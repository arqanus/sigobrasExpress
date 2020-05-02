const User = require('../models/m.get.proyeccion'); //tiene que llamar al modelo
module.exports = (app) => {
    app.post('/AnyoInicial', async (peticion, respuesta) => {
        try {
            var data = await User.AnyoInicial(peticion.body.id_ficha)
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })

    // asigancion de listas sobre listas, pasar datos de una lista a otra lista (ojo entender la base de como funcionan las listas "arrays")
    app.post('/ComponentesProyeccion', async (peticion, respuesta) => {
        try {
            var componentes = await User.ComponentesProyeccion(peticion.body.id_ficha)
            for (let mes = 1; mes <= 12; mes++) {
                var componentesavance = await User.ComponentesProyeccionAvance(peticion.body.id_ficha, peticion.body.anyo, mes)
                
                var componentesexptec = await User.ComponentesProyeccionExptec(peticion.body.anyo, mes, peticion.body.id_ficha)  //ojo que la variable mes algo q se esta ejecutando internamente en la interfaz

                var proyeccionvariable = await User.ComponentesProyeccionVariable(peticion.body.anyo, mes, peticion.body.id_ficha)


                console.log(componentesavance);

                for (let j = 0; j < componentes.length; j++) {
                   
                        componentes[j]["M" + mes] = componentesavance[j].avance
                        
                        componentes[j]["MEXPT" + mes] = componentesexptec[j].proyeccion_exptec

                        componentes[j]["MPROVAR" + mes] = proyeccionvariable[j].proyeccion_variable

                }
            }

            //una ruta puede llamar a varios modelos ojo
            //console.log(peticion.body) //son para ver como trabaja la daTa si llega o no
            respuesta.json(componentes) //devuelve a la interfaz (se puede mandar en otros formatos.txt ) data es uso para el pedaso de codigo
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })



    app.post('/postproyeccion', async (peticion, respuesta) => {
        try {

            var cajamesanyocomponente = await User.verificarMesAnyoComponente(peticion.body.mes_anyo, peticion.body.id_componente)
            var estadodelarraycaja = false              
            if (cajamesanyocomponente.length == 0) {     //PRIMERO

                estadodelarraycaja = false
            } else {
                estadodelarraycaja = true
            }
            var data = 0
            // respuesta.json(estadodelarraycaja)
            if (estadodelarraycaja == true) {           // SEGUNDO
                data = await User.postProyeccionActualizar(peticion.body.proyeccion_exptec, peticion.body.mes_anyo, peticion.body.id_componente)
            } else {
                data = await User.postProyeccion(peticion.body.proyeccion_exptec, peticion.body.mes_anyo, peticion.body.id_componente)
            }
            
            respuesta.json(data) 
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })


// PARA INSERTAR VALORES DE LA PROYECCION VARIABLE************************************************************************************************************************************************************


    app.post('/postProyeccionVar', async (peticion, respuesta) => {
        try {

            var cajamesanyocomponente = await User.verificarMesAnyoComponenteVar(peticion.body.mes_anyo, peticion.body.id_componente)
            var estadodelarraycaja = false              
            if (cajamesanyocomponente.length == 0) {     //PRIMERO

                estadodelarraycaja = false
            } else {
                estadodelarraycaja = true
            }
            var data = 0
            // respuesta.json(estadodelarraycaja)
            if (estadodelarraycaja == true) {           // SEGUNDO
                data = await User.postProyeccionVarActualizar(peticion.body.proyeccion_variable, peticion.body.mes_anyo, peticion.body.id_componente)
            } else {
                data = await User.postProyeccionVar(peticion.body.proyeccion_variable, peticion.body.mes_anyo, peticion.body.id_componente)
            }


            //console.log(peticion.body) //son para ver como trabaja la daTa si llega o no
            respuesta.json(data) //devuelve a la interfaz (se puede mandar en otros formatos.txt ) data es uso para el pedaso de codigo
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })
                            // CHART AVANCE, EXP, VAR,

    app.post('/chartproyeccion', async (peticion, respuesta) => {
        try {

            var chartavance = await User.chart_avance(peticion.body.id_ficha, peticion.body.anyo,peticion.body.id_componente)
            chartavance = chartavance[0]
            var chartavancelista = [chartavance.ene, chartavance.feb, chartavance.mar, chartavance.abr, chartavance.may, chartavance.jun, chartavance.jul, chartavance.ago, chartavance.seti, chartavance.oct, chartavance.nov, chartavance.dic]

            // HAcer el modelo api de chart proyeccion 
            
            
            var chart_proyeccion = await User.chart_proyeccion( peticion.body.anyo, peticion.body.id_ficha, peticion.body.id_componente)
            chart_proyeccion = chart_proyeccion[0]
           
            var chartproyeccionlista = [chart_proyeccion.exp_ene, chart_proyeccion.exp_feb, chart_proyeccion.exp_mar, chart_proyeccion.exp_abr, chart_proyeccion.exp_may, chart_proyeccion.exp_jun, chart_proyeccion.exp_jul, chart_proyeccion.exp_ago, chart_proyeccion.exp_set, chart_proyeccion.exp_oct, chart_proyeccion.exp_nov, chart_proyeccion.exp_dic]

            var chartproyeccionvariablelista = [chart_proyeccion.var_ene, chart_proyeccion.var_feb, chart_proyeccion.var_mar, chart_proyeccion.var_abr, chart_proyeccion.var_may, chart_proyeccion.var_jun, chart_proyeccion.var_jul, chart_proyeccion.var_ago, chart_proyeccion.var_set, chart_proyeccion.var_oct, chart_proyeccion.var_nov, chart_proyeccion.var_dic]

            var data = {
                avance : chartavancelista,
                exptec : chartproyeccionlista,
                proyvar: chartproyeccionvariablelista
            }
            
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })

    app.post('/listaobras',async(peticion,respuesta)=>{
        try {
           var datos_listaobras  = await User.listaobrasModelo()
           //console.log(peticion.body) //son para ver como trabaja la daTa si llega o no
            respuesta.json(datos_listaobras) //devuelve a la interfaz (se puede mandar en otros formatos.txt )
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        } 
    })

    app.post('/putproyecciones',async(peticion,respuesta)=>{
        try {
           var data  = await User.putproyecciones(peticion.body)
            
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        } 
    })


}