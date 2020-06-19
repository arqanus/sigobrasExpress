const User = require('../models/m.get.recursospersonal'); 

module.exports = (app) => {
    app.post('/SelectRecPersonalAnyos', async (peticion, respuesta) => {
        try {
            var data = await User.SelectRecPersonalAnyos(peticion.body.id_ficha)
                        
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })


    app.post('/SelectRecPersonalMeses', async (peticion, respuesta) => {
        try {
            var data = await User.SelectRecPersonalMeses(peticion.body.id_ficha, peticion.body.anyo)
                        
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })

    app.post('/SelectRecPersonalSemana', async (peticion, respuesta) => {
        try {
            var data = await User.SelectRecPersonalSemana(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes)
                        
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })


    app.post('/GastoManodeObra', async (peticion, respuesta) => {
        try {
            var fechasavance = await User.fechasavance(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes, peticion.body.semana)

            var PartidasSemanal = await User.PartidasSemanal(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes, peticion.body.semana, fechasavance)

            var cargosPersonal = await User.cargosPersonal(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes, peticion.body.semana)

            var cantidadPersonal = await User.cantidadPersonal(PartidasSemanal, cargosPersonal)
          
            respuesta.json(
                {
                    fechasavance,
                    cargosPersonal,
                    PartidasSemanal,
                    cantidadPersonal
                }
            )
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        }
    })



    app.post('/putresumengastomo',async(peticion,respuesta)=>{
        try {
           var data  = await User.putresumengastomo(peticion.body)
            
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        } 
    })


    
    app.get('/cargos_obreros',async(peticion,respuesta)=>{
        try {
           var data  = await User.listado_cargos()
            
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        } 
    })

    app.post('/historial_gasto_mo',async(peticion,respuesta)=>{
        try {
           var data  = await User.historial_gasto_mo(peticion.body.anyo, peticion.body.mes, peticion.body.semana, peticion.body.id_ficha )
            
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        } 
    })


    app.post('/chart_mo_dia',async(peticion,respuesta)=>{
        try {
           var gastoestimadoexptec_mo  = await User.gastoestimadoexptec_mo(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes)

           var SelectRecPersonalSemana  = await User.SelectRecPersonalSemana(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes)

           var gasto_dia_gore = []
            for (let i = 0; i < SelectRecPersonalSemana.length; i++) {
                const element = SelectRecPersonalSemana[i];
                var fechasavance = await User.fechasavance(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes, element.semana) 

                var gasto_semana_mo = await User.gasto_semana_mo(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes, element.semana)
                for (let j = 0; j < fechasavance.length; j++) {
                    const element2 = fechasavance[j];
                    element2.gasto_gore = gasto_semana_mo[0].gasto_semana_mo / fechasavance.length
                }
                console.log("FECHAS AVANCE", fechasavance);
                console.log("gasto semana", gasto_semana_mo);

                // gasto_dia_gore.concat(fechasavance)
                Array.prototype.push.apply(gasto_dia_gore, fechasavance)
                
                
            }

            console.log("GASTO DIA GORE", gasto_dia_gore);
            
            respuesta.json(
                {
                     gastoestimadoexptec_mo,
                     gasto_dia_gore
                }


            )
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        } 
    })



    app.post('/gastoestimadoexptec_mo_semana',async(peticion,respuesta)=>{
        try {
           var data  = await User.gastoestimadoexptec_mo_semana(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes)
            
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        } 
    })

    app.post('/gastoestimadogore_mo_semana',async(peticion,respuesta)=>{
        try {

            var SelectRecPersonalSemana  = await User.SelectRecPersonalSemana(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes)
            
            var data = []

            for (let i = 0; i < SelectRecPersonalSemana.length; i++) {
                const element = SelectRecPersonalSemana[i];
                var gastoestimadogore_mo_semana  = await User.gastoestimadogore_mo_semana(peticion.body.id_ficha, peticion.body.anyo, peticion.body.mes, element.semana) 
                console.log("data", gastoestimadogore_mo_semana);
                if (gastoestimadogore_mo_semana == null) {
                    console.log("ES NULL");
                    gastoestimadogore_mo_semana =  {
                        "gasto_semana_mo": 0,
                        "semana": element.semana
                    }
                }
                data.push(gastoestimadogore_mo_semana)
                
            }

                     
            respuesta.json(data)
        } catch (error) {
            console.log(error);
            respuesta.status(204).json(error)
        } 
    })

}