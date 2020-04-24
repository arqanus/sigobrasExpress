const pool = require('../../../../db/connection');  //conexcion a base de datos
//const tools = require('../../../../tools/format')   formato de soles porcentajes

let userModel = {}; //variable donde estaran todos los modelos

//imagenes
userModel.AnyoInicial = (id_ficha) => { //nombra la query
    return new Promise((resolve, reject) => {
        var query = "select year(fecha_inicial) anyo_inicial from fichas where id_ficha = ?;"//AHI SE CAMBIA LA QUERY
        pool.query(query, [id_ficha], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado [0]); //funcion que devuelve el resultado a la ruta 
                                        
            }
        })
    })
}

userModel.ComponentesProyeccion = (id_ficha) => { //nombra la query
    return new Promise((resolve, reject) => {
        var query = " select componentes.* FROM componentes where fichas_id_ficha = ?"//AHI SE CAMBIA LA QUERY
        pool.query(query, [id_ficha], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado); //funcion que devuelve el resultado a la ruta
            }
        })
    })
}

userModel.ComponentesProyeccionAvance = (id_ficha, anyo, mes) => { //nombra la query
    return new Promise((resolve, reject) => {
        var query = "    SELECT componentes.*, coalesce(componentes_avance.avance, 0) avance FROM componentes LEFT JOIN (SELECT componentes.id_componente, SUM(costo_unitario * COALESCE(avanceactividades.valor, 0)) avance FROM componentes LEFT JOIN partidas ON componentes.id_componente = partidas.componentes_id_componente LEFT JOIN actividades ON partidas.id_partida = actividades.Partidas_id_partida LEFT JOIN avanceactividades ON actividades.id_actividad = avanceactividades.Actividades_id_actividad WHERE YEAR(avanceactividades.fecha) = ? AND MONTH(avanceactividades.fecha) = ? GROUP BY id_componente) componentes_avance ON componentes_avance.id_componente = componentes.id_componente WHERE componentes.fichas_id_ficha = ?" //AHI SE CAMBIA LA QUERY
        pool.query(query, [anyo,mes, id_ficha], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado); //funcion que devuelve el resultado a la ruta
            }
        })
    })
}


userModel.postProyeccion = (proyeccion_exptec,mes_anyo, id_componente) => {
    return new Promise((resolve, reject) => {
        var querytext = "INSERT INTO avance_proyecciones (proyeccion_exptec, mes_anyo, componentes_id_componente) VALUES (?, ?, ?)" //AHI SE CAMBIA LA QUERY
        pool.query(querytext, [proyeccion_exptec,mes_anyo, id_componente], (error, resultado) => { 
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
            }
        })
    })
}

userModel.verificarMesAnyoComponente = (mes_anyo, id_componente) => { //nombra la query
    return new Promise((resolve, reject) => {
        var querytext = "select * from avance_proyecciones where mes_anyo = ? and componentes_id_componente = ?;" 
        pool.query(querytext, [mes_anyo, id_componente], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado); //funcion que devuelve el resultado a la ruta
            }
        })
    })
}

userModel.postProyeccionActualizar = (proyeccion_exptec, mes_anyo, id_componente) => { 
    return new Promise((resolve, reject) => {
        var querytext = "UPDATE avance_proyecciones SET proyeccion_exptec = ? WHERE mes_anyo = ? and componentes_id_componente = ?;" 
        pool.query(querytext, [proyeccion_exptec, mes_anyo, id_componente], (error, resultado) => { 
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
            }
        })
    })
}


userModel.ComponentesProyeccionExptec = (anyo, mes, id_ficha) => { 
    return new Promise((resolve, reject) => {
        var querytext = " SELECT componentes.id_componente, coalesce(proyeccion_exp_tec.proyeccion_exptec, 0) proyeccion_exptec FROM componentes LEFT JOIN (SELECT id_componente, proyeccion_exptec FROM componentes LEFT JOIN avance_proyecciones ON componentes.id_componente = avance_proyecciones.componentes_id_componente WHERE YEAR(mes_anyo) = ? AND MONTH(mes_anyo) = ?) proyeccion_exp_tec ON componentes.id_componente = proyeccion_exp_tec.id_componente WHERE componentes.fichas_id_ficha = ?" 
        pool.query(querytext, [anyo, mes, id_ficha], (error, resultado) => { 
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
            }
        })
    })
}
 //ya se muestra los objetos de los meses proyectados
userModel.ComponentesProyeccionVariable = (anyo, mes, id_ficha) => { 
    return new Promise((resolve, reject) => {
        var querytext = "SELECT componentes.id_componente, coalesce(proyeccion_variable, 0) proyeccion_variable FROM componentes LEFT JOIN (SELECT id_componente, proyeccion_variable FROM componentes LEFT JOIN avance_proyecciones ON componentes.id_componente = avance_proyecciones.componentes_id_componente WHERE YEAR(mes_anyo) = ? AND MONTH(mes_anyo) = ?) proyecciones_variables ON componentes.id_componente = proyecciones_variables.id_componente WHERE fichas_id_ficha = ?;" 
        pool.query(querytext, [anyo, mes, id_ficha], (error, resultado) => { 
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
            }
        })
    })
}

// userModel.ComponentesProyeccionesVariables = (anyo, mes, id_ficha) => { 
//     return new Promise((resolve, reject) => {
//         var querytext = "SELECT componentes.id_componente, coalesce(proyeccion_variable, 0) proyeccion_variable FROM componentes LEFT JOIN (SELECT id_componente, proyeccion_variable FROM componentes LEFT JOIN avance_proyecciones ON componentes.id_componente = avance_proyecciones.componentes_id_componente WHERE YEAR(mes_anyo) = ? AND MONTH(mes_anyo) = ?) proyecciones_variables ON componentes.id_componente = proyecciones_variables.id_componente WHERE fichas_id_ficha = ?;" 
//         pool.query(querytext, [anyo, mes, id_ficha], (error, resultado) => { 
//             if (error) {
//                 reject(error);   
//             } else {
//                 resolve(resultado); 
//             }
//         })
//     })
// }
// MODELO PARA PROYECCION_VARIABLE 
userModel.postProyeccionVar = (proyeccion_variable,mes_anyo, id_componente) => {
    return new Promise((resolve, reject) => {
        var querytext = "INSERT INTO avance_proyecciones (proyeccion_variable, mes_anyo, componentes_id_componente) VALUES (?, ?, ?)" //AHI SE CAMBIA LA QUERY
        pool.query(querytext, [proyeccion_variable,mes_anyo, id_componente], (error, resultado) => { 
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
            }
        })
    })
}

userModel.postProyeccionVarActualizar = (proyeccion_exptec, mes_anyo, id_componente) => { 
    return new Promise((resolve, reject) => {
        var querytext = "UPDATE avance_proyecciones SET proyeccion_variable = ? WHERE mes_anyo = ? and componentes_id_componente = ?;" 
        pool.query(querytext, [proyeccion_exptec, mes_anyo, id_componente], (error, resultado) => { 
            if (error) {
                reject(error);   
            } else {
                resolve(resultado); 
            }
        })
    })
}

userModel.verificarMesAnyoComponenteVar = (mes_anyo, id_componente) => { //nombra la query
    return new Promise((resolve, reject) => {
        var querytext = "select * from avance_proyecciones where mes_anyo = ? and componentes_id_componente = ?;" 
        pool.query(querytext, [mes_anyo, id_componente], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado); //funcion que devuelve el resultado a la ruta
            }
        })
    })
}

//modelo para el chart de avance

userModel.chart_avance = (id_ficha, anyo, id_componente) => { //nombra la query
    return new Promise((resolve, reject) => {
        var querytext = 
        "SELECT id_componente, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 1, avanceactividades.valor, 0)) ene, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 2, avanceactividades.valor, 0)) feb, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 3, avanceactividades.valor, 0)) mar, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 4, avanceactividades.valor, 0)) abr, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 5, avanceactividades.valor, 0)) may, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 6, avanceactividades.valor, 0)) jun, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 7, avanceactividades.valor, 0)) jul, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 8, avanceactividades.valor, 0)) ago, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 9, avanceactividades.valor, 0)) seti, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 10, avanceactividades.valor, 0)) oct, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 11, avanceactividades.valor, 0)) nov, SUM(costo_unitario * IF(MONTH(avanceactividades.fecha) = 12, avanceactividades.valor, 0)) dic FROM componentes LEFT JOIN partidas ON componentes.id_componente = partidas.componentes_id_componente LEFT JOIN actividades ON partidas.id_partida = actividades.Partidas_id_partida LEFT JOIN avanceactividades ON actividades.id_actividad = avanceactividades.Actividades_id_actividad AND YEAR(avanceactividades.fecha) = ? WHERE componentes.fichas_id_ficha = ? AND id_componente = ? GROUP BY componentes.id_componente" 
        pool.query(querytext, [ anyo, id_ficha, id_componente], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado); //funcion que devuelve el resultado a la ruta
            }
        })
    })
}


userModel.chart_proyeccion = ( anyo, id_ficha, id_componente) => { //nombra la query
   
    return new Promise((resolve, reject) => {
        var querytext = "SELECT id_componente, SUM(IF(MONTH(mes_anyo) = 1, COALESCE(proyeccion_exptec, 0), 0)) exp_ene, SUM(IF(MONTH(mes_anyo) = 2, COALESCE(proyeccion_exptec, 0), 0)) exp_feb, SUM(IF(MONTH(mes_anyo) = 3, COALESCE(proyeccion_exptec, 0), 0)) exp_mar, SUM(IF(MONTH(mes_anyo) = 4, COALESCE(proyeccion_exptec, 0), 0)) exp_abr, SUM(IF(MONTH(mes_anyo) = 5, COALESCE(proyeccion_exptec, 0), 0)) exp_may, SUM(IF(MONTH(mes_anyo) = 6, COALESCE(proyeccion_exptec, 0), 0)) exp_jun, SUM(IF(MONTH(mes_anyo) = 7, COALESCE(proyeccion_exptec, 0), 0)) exp_jul, SUM(IF(MONTH(mes_anyo) = 8, COALESCE(proyeccion_exptec, 0), 0)) exp_ago, SUM(IF(MONTH(mes_anyo) = 9, COALESCE(proyeccion_exptec, 0), 0)) exp_set, SUM(IF(MONTH(mes_anyo) = 10, COALESCE(proyeccion_exptec, 0), 0)) exp_oct, SUM(IF(MONTH(mes_anyo) = 11, COALESCE(proyeccion_exptec, 0), 0)) exp_nov, SUM(IF(MONTH(mes_anyo) = 12, COALESCE(proyeccion_exptec, 0), 0)) exp_dic, SUM(IF(MONTH(mes_anyo) = 1, COALESCE(proyeccion_variable, 0), 0)) var_ene, SUM(IF(MONTH(mes_anyo) = 2, COALESCE(proyeccion_variable, 0), 0)) var_feb, SUM(IF(MONTH(mes_anyo) = 3, COALESCE(proyeccion_variable, 0), 0)) var_mar, SUM(IF(MONTH(mes_anyo) = 4, COALESCE(proyeccion_variable, 0), 0)) var_abr, SUM(IF(MONTH(mes_anyo) = 5, COALESCE(proyeccion_variable, 0), 0)) var_may, SUM(IF(MONTH(mes_anyo) = 6, COALESCE(proyeccion_variable, 0), 0)) var_jun, SUM(IF(MONTH(mes_anyo) = 7, COALESCE(proyeccion_variable, 0), 0)) var_jul, SUM(IF(MONTH(mes_anyo) = 8, COALESCE(proyeccion_variable, 0), 0)) var_ago, SUM(IF(MONTH(mes_anyo) = 9, COALESCE(proyeccion_variable, 0), 0)) var_set, SUM(IF(MONTH(mes_anyo) = 10, COALESCE(proyeccion_variable, 0), 0)) var_oct, SUM(IF(MONTH(mes_anyo) = 11, COALESCE(proyeccion_variable, 0), 0)) var_nov, SUM(IF(MONTH(mes_anyo) = 12, COALESCE(proyeccion_variable, 0), 0)) var_dic FROM componentes LEFT JOIN avance_proyecciones ON componentes.id_componente = avance_proyecciones.componentes_id_componente AND YEAR(mes_anyo) = ? WHERE componentes.fichas_id_ficha = ? AND id_componente = ?" 
        pool.query(querytext, [ anyo, id_ficha, id_componente], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado); //funcion que devuelve el resultado a la ruta
            }
        })
    })
}

userModel.listaobrasModelo = () => { //nombra la query
    return new Promise((resolve, reject) => {
        var query = "SELECT fichas.g_meta, fichas.id_ficha FROM fichas"//AHI SE CAMBIA LA QUERY
        pool.query(query, [], (error, resultado) => { //ejecutqa la query
            if (error) {
                reject(error);   //reconoce el error
            } else {
                resolve(resultado); //funcion que devuelve el resultado a la ruta
            }
        })
    })
}







module.exports = userModel;

//////SELECT id_componente, coalesce(IF(MONTH(mes_anyo) = 1, proyeccion_exptec, 0),0) exp_ene, coalesce(IF(MONTH(mes_anyo) = 2, proyeccion_exptec, 0),0) exp_feb, coalesce( IF(MONTH(mes_anyo) = 3, proyeccion_exptec, 0),0) exp_mar, coalesce(IF(MONTH(mes_anyo) = 4, proyeccion_exptec, 0),0) exp_abr, coalesce(IF(MONTH(mes_anyo) = 5, proyeccion_exptec, 0),0) exp_may, coalesce(IF(MONTH(mes_anyo) = 6, proyeccion_exptec, 0),0) exp_jun, coalesce(IF(MONTH(mes_anyo) = 7, proyeccion_exptec, 0),0) exp_jul, coalesce(IF(MONTH(mes_anyo) = 8, proyeccion_exptec, 0),0) exp_ago, coalesce(IF(MONTH(mes_anyo) = 9, proyeccion_exptec, 0),0) exp_set, coalesce( IF(MONTH(mes_anyo) = 10, proyeccion_exptec, 0),0) exp_oct, coalesce( IF(MONTH(mes_anyo) = 11, proyeccion_exptec, 0),0) exp_nov, coalesce(IF(MONTH(mes_anyo) = 12, proyeccion_exptec, 0),0) exp_dic, coalesce(IF(MONTH(mes_anyo) = 1, proyeccion_variable, 0),0) var_ene, coalesce( IF(MONTH(mes_anyo) = 2, proyeccion_variable, 0),0) var_feb, coalesce( IF(MONTH(mes_anyo) = 3, proyeccion_variable, 0),0) var_mar, coalesce( IF(MONTH(mes_anyo) = 4, proyeccion_variable, 0),0) var_abr, coalesce( IF(MONTH(mes_anyo) = 5, proyeccion_variable, 0),0) var_may, coalesce(IF(MONTH(mes_anyo) = 6, proyeccion_variable, 0),0) var_jun, coalesce( IF(MONTH(mes_anyo) = 7, proyeccion_variable, 0),0) var_jul, coalesce(IF(MONTH(mes_anyo) = 8, proyeccion_variable, 0),0) var_ago, coalesce(IF(MONTH(mes_anyo) = 9, proyeccion_variable, 0),0) var_set, coalesce(IF(MONTH(mes_anyo) = 10, proyeccion_variable, 0),0) var_oct, coalesce(IF(MONTH(mes_anyo) = 11, proyeccion_variable, 0),0) var_nov, coalesce(IF(MONTH(mes_anyo) = 12, proyeccion_variable, 0),0) var_dic FROM componentes LEFT JOIN avance_proyecciones ON componentes.id_componente = avance_proyecciones.componentes_id_componente WHERE componentes.fichas_id_ficha = ? AND YEAR(mes_anyo) = ? and id_componente = ?
