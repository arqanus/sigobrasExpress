const User = require('../models/m.get.historial');
const Tools = require('../../../../tools/format');

module.exports = function (app) {
    //gethistorial
    app.post('/getHistorialAnyos', async (req, res) => {
        try {
            var anyos = await User.getHistorialAnyos(req.body.id_ficha)
            var meses = await User.getHistorialMeses(req.body.id_ficha, anyos[anyos.length - 1].anyo)
            var resumen = await User.getHistorialAnyosResumen(req.body.id_ficha, anyos[anyos.length - 1].anyo)
            var componentes = await User.getHistorialComponentes(req.body.id_ficha, meses[meses.length - 1].fecha)
            meses[meses.length - 1].componentes = componentes
            meses[meses.length - 1].resumen = resumen
            anyos[anyos.length - 1].meses = meses
            res.json(anyos);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialAnyosResumen', async (req, res) => {
        try {
            var meses = await User.getHistorialMeses2(req.body.id_ficha, req.body.anyo)
            var categories = []
            meses.forEach(element => {
                categories.push(Tools.monthNames[element.mes - 1])
            });
            var data = await User.getHistorialAnyosResumen2(req.body.id_ficha, req.body.anyo, meses)
            data.categories = categories
            res.json(data)
        } catch (error) {
            console.log(error)
            res.status(400).json(error)
        }
    })
    app.post('/getHistorialMeses', async (req, res) => {
        try {
            var meses = await User.getHistorialMeses(req.body.id_ficha, req.body.anyo)
            res.json(meses);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialResumen', async (req, res) => {
        try {
            var resumen = await User.getHistorialResumen(req.body.id_ficha, req.body.fecha)
            res.json(resumen);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialComponentes', async (req, res) => {
        try {
            var componentes = await User.getHistorialComponentes(req.body.id_ficha, req.body.fecha)
            res.json(componentes);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialFechas', async (req, res) => {
        try {
            var fechas = await User.getHistorialFechas(req.body.id_componente, req.body.fecha)
            res.json(fechas);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialDias', async (req, res) => {
        try {
            var historial = await User.getHistorialDias(req.body.id_componente, req.body.fecha)
            res.json(historial);
        } catch (error) {
            res.status(400).json(error);
        }
    })
    app.post('/getHistorialComponenteChart', (req, res) => {
        if (req.body.id_componente == null) {
            res.json("null")
        } else {
            User.getHistorialComponenteChart(req.body.id_componente, req.body.fecha, (err, data) => {
                if (err) { res.status(204).json(err); }
                else {
                    res.json(data);
                }
            })
        }


    })
    app.post('/getHistorialRegresionLineal', (req, res) => {
        if (req.body.id_ficha == null) {
            res.json("null")
        } else {
            User.getHistorialRegresionLineal(req.body.id_ficha, (err, data) => {
                if (err) { res.status(204).json(err); }
                else {
                    res.json(data);
                }
            })
        }


    })
    app.post('/getHistorialSemanas', async (req, res) => {
        function shortDate(fecha) {
            var fecha_temp = (fecha)
            var options = { year: 'numeric', month: "2-digit", day: "2-digit" };
            return fecha_temp.toLocaleDateString("es-ES", options)
        }
        try {
            var mes = req.body.mes - 1
            var d = new Date(req.body.anyo, mes, 1),
                month = mes,
                mondays = [],
                periodos = []
            // Get the first Monday in the month
            while (d.getDay() !== 1) {
                d.setDate(d.getDate() + 1);
            }

            // Get all the other Mondays in the month
            var fecha_inicial = shortDate(new Date(req.body.anyo, mes, 0))
            var semana = 1
            while (d.getMonth() === month) {
                mondays.push(new Date(d.getTime()));
                if (periodos.length > 0) {
                    fecha_inicial = periodos[periodos.length - 1].fecha_final
                }
                periodos.push(
                    {
                        "fecha_inicial": fecha_inicial,
                        "fecha_final": shortDate(new Date(d.getTime())),
                        "semana": semana
                    }
                )
                d.setDate(d.getDate() + 7);
                semana++

            }
            periodos.push(
                {
                    "fecha_inicial": periodos[periodos.length - 1].fecha_final,
                    "fecha_final": shortDate(new Date(req.body.anyo, mes + 1, 0)),
                    "semana": semana
                }
            )
            if (
                periodos[periodos.length - 1].fecha_final == periodos[periodos.length - 1].fecha_inicial) {
                console.log("pop");
                periodos.pop()
            }
            //revisar si tienen metrados
            for (let index = 0; index < periodos.length; index++) {
                const item = periodos[index];
                var data = await User.getHistorialSemanalComponentes(req.body.id_ficha, item.fecha_inicial, item.fecha_final)
                console.log(data);
                if (data.length == 0) {
                    periodos.splice(index, 1);
                    index--;
                }
            };
            res.json(periodos)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    })
  
    app.post('/getHistorialSemanalFechas', async (req, res) => {
        try {
            var data = await User.getHistorialSemanalFechas(req.body.id_ficha, req.body.fecha_inicial, req.body.fecha_final)
            
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    });
    app.post('/getHistorialSemanalComponentes', async (req, res) => {
        try {
            var data = await User.getHistorialSemanalComponentes(req.body.id_ficha, req.body.fecha)
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    });
    app.post('/getHistorialSemanalDias', async (req, res) => {
        try {
            var data = await User.getHistorialSemanalDias(req.body.id_componente, req.body.fecha)
            
            res.json(data)
        } catch (error) {
            console.log(error);
            res.status(204).json({ error: error.code })
        }
    });
}

