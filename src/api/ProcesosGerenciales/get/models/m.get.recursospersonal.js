const pool = require('../../../../db/connection');

let userModel = {};


userModel.SelectRecPersonalAnyos = (id_ficha) => {
    return new Promise((resolve, reject) => {
        var query = "SELECT YEAR(avanceactividades.fecha) anyo FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? GROUP BY YEAR(avanceactividades.fecha);"
        pool.query(query, [id_ficha], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado);

            }
        })
    })
}

userModel.SelectRecPersonalMeses = (id_ficha, anyo) => {
    return new Promise((resolve, reject) => {
        var query = "SELECT MONTH(avanceactividades.fecha) mes FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? GROUP BY MONTH(avanceactividades.fecha);"
        pool.query(query, [id_ficha, anyo], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado);

            }
        })
    })
}



userModel.SelectRecPersonalSemana = (id_ficha, anyo, mes) => {
    return new Promise((resolve, reject) => {
        var query = "SELECT FLOOR((DAYOFMONTH(avanceactividades.fecha) - 1) / 7) + 1 semana FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha)= ? GROUP BY FLOOR((DAYOFMONTH(avanceactividades.fecha) - 1) / 7) + 1;"
        pool.query(query, [id_ficha, anyo, mes], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado);

            }
        })
    })
}
// DATE_FORMAT(avanceactividades.fecha, "%Y-%m-%d") fecha
// avanceactividades.fecha

userModel.fechasavance = (id_ficha, anyo, mes, semana) => {
    return new Promise((resolve, reject) => {
        var query = "SELECT DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') fecha FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? AND FLOOR((DAYOFMONTH(avanceactividades.fecha) - 1) / 7) + 1 = ? GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') order by avanceactividades.fecha;"
        pool.query(query, [id_ficha, anyo, mes, semana], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado);

            }
        })
    })
}
// " FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente  LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? AND FLOOR((DAYOFMONTH(avanceactividades.fecha) - 1) / 7) + 1 = ? GROUP BY partidas.id_partida order by id_partida;"

userModel.PartidasSemanal = (id_ficha, anyo, mes, semana, fechasavance) => {
    return new Promise((resolve, reject) => {
        var query = "SELECT id_partida, '' tipo, partidas_mo.item, partidas_mo.descripcion, partidas_mo.unidad_medida, partidas_mo.rendimiento, partidas_mo.costo_unitario,"
        for (let i = 0; i < fechasavance.length; i++) {
            const fechaobjeto = fechasavance[i]
            query += "SUM(if(DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') = '" + fechaobjeto.fecha + "', avanceactividades.valor, 0)) metrado" + i + ","
        }
        query = query.substring(0, query.length - 1);
        query += " FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT partidas.* FROM partidas LEFT JOIN recursos ON recursos.Partidas_id_partida = partidas.id_partida WHERE recursos.tipo = 'Mano de Obra' GROUP BY id_partida) partidas_mo ON partidas_mo.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas_mo.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad  WHERE COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? AND FLOOR((DAYOFMONTH(avanceactividades.fecha) - 1) / 7) + 1 = ? GROUP BY partidas_mo.id_partida order by id_partida;"
         // resolve(query)
        console.log(query);
        
        pool.query(query, [id_ficha, anyo, mes, semana], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado);

            }
        })
    })
}

userModel.cargosPersonal = (id_ficha, anyo, mes, semana) => {
    return new Promise((resolve, reject) => {
        var query = "SELECT recursos.descripcion FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN recursos ON recursos.Partidas_id_partida = partidas.id_partida WHERE COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? AND FLOOR((DAYOFMONTH(avanceactividades.fecha) - 1) / 7) + 1 = ? AND recursos.tipo = 'Mano de Obra' GROUP BY recursos.descripcion;"
        pool.query(query, [id_ficha, anyo, mes, semana], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado);

            }
        })
    })
}

userModel.cantidadPersonal = (partidasSemana, cargos ) => {
    return new Promise((resolve, reject) => {
        var query = "SELECT id_partida, SUM(parcial) parcial_mo,"
        for (let i = 0; i < cargos.length; i++) {
            const cargoObjeto = cargos[i]
            query += "sum(IF(recursos.descripcion = '" + cargoObjeto.descripcion + "', recursos.cuadrilla, 0)) cargo_" + i + ","
        }
        query = query.substring(0, query.length - 1);
        query += " FROM partidas LEFT JOIN recursos ON recursos.Partidas_id_partida = partidas.id_partida WHERE partidas.id_partida in("
        for (let i = 0; i < partidasSemana.length; i++) {
            const partidaObjeto = partidasSemana[i];
            
            query += partidaObjeto.id_partida + ","
        }
        query = query.substring(0, query.length - 1);

        query += ") AND recursos.tipo = 'Mano de Obra' group by id_partida order by id_partida"
        
        // resolve(query)

        pool.query(query, (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado);

            }
        })
    })
}


userModel.putresumengastomo = (insertintogastomo) => { //nombra la query
    return new Promise((resolve, reject) => {
        var query = "INSERT INTO resumen_gasto_mo (idresumen_gasto_mo, anyo, mes, semana, cantidad_personal, costo_mo_gore, dias_trabajados, cargo, fichas_id_ficha) VALUES ? ON DUPLICATE KEY UPDATE cantidad_personal = values(cantidad_personal), costo_mo_gore = values(costo_mo_gore), dias_trabajados = values(dias_trabajados), cargo = values(cargo)"
        pool.query(query, [insertintogastomo], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado); //funcion que devuelve el resultado a la ruta
            }
        })
    })
}


userModel.listado_cargos = () => { //nombra la query
    return new Promise((resolve, reject) => {
        var query = "select * from cargos_obreros"
        pool.query(query, [], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado); //funcion que devuelve el resultado a la ruta
            }
        })
    })
}



userModel.historial_gasto_mo = (anyo, mes, semana, id_ficha) => { //nombra la query
    return new Promise((resolve, reject) => {
        var query = "SELECT idresumen_gasto_mo, cantidad_personal cantidad, cargo, costo_mo_gore costogore, dias_trabajados dias FROM resumen_gasto_mo where anyo = ? and mes = ? and semana = ? and fichas_id_ficha = ?;"
        pool.query(query, [anyo, mes, semana, id_ficha], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado); //funcion que devuelve el resultado a la ruta
            }
        })
    })
}


userModel.gasto_semana_mo = (id_ficha, anyo, mes, semana) => { 
    return new Promise((resolve, reject) => {
        var query = "SELECT sum(cantidad_personal * costo_mo_gore * dias_trabajados) gasto_semana_mo FROM resumen_gasto_mo WHERE fichas_id_ficha = ? and anyo = ? AND mes = ? AND semana = ?"
        pool.query(query, [id_ficha, anyo, mes, semana], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
            }
        })
    })
}


userModel.gastoestimadoexptec_mo = (id_ficha, anyo, mes) => { 
    return new Promise((resolve, reject) => {
        var query = "select sum(gasto_mo_exp) valor, fecha from (SELECT item, avanceactividades.fecha, sum(avanceactividades.valor) * parcial_mo gasto_mo_exp FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT partidas.*, SUM(parcial) parcial_mo FROM partidas LEFT JOIN recursos ON recursos.Partidas_id_partida = partidas.id_partida WHERE recursos.tipo = 'Mano de Obra' GROUP BY id_partida) partidas_mo ON partidas_mo.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas_mo.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') , id_partida) gasto_mo GROUP BY DATE_FORMAT(fecha, '%Y-%m-%d')"
        pool.query(query, [id_ficha, anyo, mes], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
            }
        })
    })
}


userModel.gastoestimadoexptec_mo_semana = (id_ficha, anyo, mes) => { 
    return new Promise((resolve, reject) => {
        var query = "SELECT SUM(gasto_mo_exp) valor, FLOOR((DAYOFMONTH(fecha) - 1) / 7) + 1 semana FROM (SELECT item, avanceactividades.fecha, SUM(avanceactividades.valor) * parcial_mo gasto_mo_exp FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT partidas.*, SUM(parcial) parcial_mo FROM partidas LEFT JOIN recursos ON recursos.Partidas_id_partida = partidas.id_partida WHERE recursos.tipo = 'Mano de Obra' GROUP BY id_partida) partidas_mo ON partidas_mo.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas_mo.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE COALESCE(avanceactividades.valor, 0) != 0 AND fichas.id_ficha = ? AND YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? GROUP BY DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') , id_partida) gasto_mo GROUP BY FLOOR((DAYOFMONTH(fecha) - 1) / 7) + 1"
        pool.query(query, [id_ficha, anyo, mes], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
            }
        })
    })
}


userModel.gastoestimadogore_mo_semana = (id_ficha, anyo, mes, semana) => { 
    return new Promise((resolve, reject) => {
        var query = "SELECT SUM(cantidad_personal * costo_mo_gore * dias_trabajados) gasto_semana_mo, semana FROM resumen_gasto_mo WHERE fichas_id_ficha = ? AND anyo = ? AND mes = ? and semana = ? group by semana"
        pool.query(query, [id_ficha, anyo, mes, semana], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   
            } else {
                resolve(resultado[0]); 
            }
        })
    })
}



module.exports = userModel;