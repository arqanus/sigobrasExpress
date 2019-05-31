const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')
let userModel = {};
function formatoAvance(data) {
    if (data == null) {
        return 0
    }
    if (isNaN(data)) {
        return data
    }
    data = Number(data)
    if (isNaN(data)) {
        data = 0
    }
    if (data == 0) {
        return 0
    }
    else if (data < 1) {
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
        })
    } else {
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        })
    }
    return data
}
function formato(data){
    
    // data = parseFloat(data)
    data = Number(data)
    if(isNaN(data)){
        
        data=0
    }
    if(data == 0){
        return 0
    }
    else if(data < 1){
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          })
    }else{
        data = data.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
    } 

    return data
}
userModel.getComponentes = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT componentes.*  FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida left JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE  partidas.tipo != 'titulo' AND historialactividades.estado IS NULL AND componentes.fichas_id_ficha = ? GROUP BY componentes.id_componente", id_ficha, (error, res) => {
            if (error) {
                reject(error);
            } else if (res.length == 0) {
                console.log("vacio");
                resolve("vacio");
            } else {
                resolve(res);
            }
        })
    })
}
userModel.getPartidas = (id_componente=null, id_actividad=null,id_ficha=null,formato=true) => {
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partidas.metrado - COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partidas.metrado * partidas.costo_unitario) - (COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / partidas.metrado * 100 * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad, COALESCE(partidas.metrado / partidas.rendimiento, '') partida_duracion, COALESCE(estado_partida.mayorMetrado, FALSE) mayorMetrado, prioridades.valor prioridad_valor, prioridades.color prioridad_color, iconoscategorias.nombre iconocategoria_nombre FROM componentes inner JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, TRUE mayorMetrado FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Mayor Metrado' GROUP BY partidas.id_partida) estado_partida ON estado_partida.id_partida = partidas.id_partida LEFT JOIN iconoscategorias ON iconoscategorias.id_iconoCategoria = partidas.iconosCategorias_id_iconoCategoria LEFT JOIN prioridades ON prioridades.id_prioridad = partidas.prioridades_id_prioridad LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN (SELECT historialpartidas.estado, historialpartidas.partidas_id_partida FROM (SELECT MAX(id_historialPartida) id_historialPartida FROM historialpartidas GROUP BY historialpartidas.partidas_id_partida) maximoHistorial LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida) historialPartida ON historialPartida.partidas_id_partida = partidas.id_partida WHERE historialactividades.estado IS NULL AND (partidas.componentes_id_componente = ? OR partidas.id_partida = (SELECT actividades.Partidas_id_partida FROM actividades WHERE actividades.id_actividad = ? LIMIT 1) OR componentes.fichas_id_ficha = ? ) GROUP BY partidas.id_partida order by componentes.id_componente,partidas.id_partida", [id_componente, id_actividad,id_ficha], (error, res) => {
            if (error) {
                reject(error);
            } else if (res.length == 0) {
                reject("vacio");
            } else {
                if (formato) {
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        fila.key = i
                        if (fila.tipo == "titulo") {
                            fila.unidad_medida = ""
                            fila.metrado = ""
                            fila.costo_unitario = ""
                            fila.parcial = ""
                            fila.avance_metrado = ""
                            fila.avance_costo = ""
                            fila.metrados_saldo = ""
                            fila.metrados_costo_saldo = ""
                            fila.porcentaje = ""
                            fila.porcentaje_negatividad = ""
                        } else {
                            fila.metrado = formatoAvance(fila.metrado)
                            fila.costo_unitario = formatoAvance(fila.costo_unitario)
                            fila.parcial = formatoAvance(fila.parcial)
                            fila.avance_metrado = formatoAvance(fila.avance_metrado)
                            fila.avance_costo = formatoAvance(fila.avance_costo)
                            fila.metrados_saldo = formatoAvance(fila.metrados_saldo)
                            fila.metrados_costo_saldo = formatoAvance(fila.metrados_costo_saldo)
                            fila.porcentaje = tools.formatoPorcentaje(fila.porcentaje)
                        }
                        if (fila.partida_duracion != "") {
                            fila.partida_duracion = fila.partida_duracion * 480
                            if (fila.partida_duracion < 60) {
                                fila.partida_duracion = Math.round(fila.partida_duracion) + "m"
                            } else if (fila.partida_duracion < 480) {
                                var horas = Math.trunc(fila.partida_duracion / 60) + "h"
                                var minutos = Math.round(fila.partida_duracion % 60) + "m"
                                fila.partida_duracion = horas + " " + minutos
                            } else {
                                var dias = Math.trunc(fila.partida_duracion / 480) + "d"
                                var residuo_dias = Math.trunc(fila.partida_duracion % 480)
                                var horas = Math.trunc(residuo_dias / 60) + "h"
                                var minutos = Math.round(residuo_dias % 60) + "m"
                                fila.partida_duracion = dias + " " + horas + " " + minutos
                            }
                        }
                    }
                } 
                resolve(res);
            }
        })
    })
}
userModel.getPartidasMayorMetradoAvance = (id_partida) => {
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partida.id_partida, partida.avance_metrado * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, partida.avance_costo * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partida.metrado - COALESCE(partida.avance_metrado, 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partida.metrado * partida.costo_unitario) - (COALESCE(partida.avance_costo, 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, partida.porcentaje * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE (actividades.parcial > 0 OR partidas.tipo = 'titulo') and historialactividades.estado = 'Mayor Metrado' GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad left join historialactividades on historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0 and historialactividades.estado = 'Mayor Metrado' GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida WHERE partida.id_partida = ?", id_partida, (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                res = res || []
                for (let i = 0; i < res.length; i++) {
                    const fila = res[i];
                    fila.avance_metrado = formato(fila.avance_metrado)
                    fila.avance_costo = formato(fila.avance_costo)
                    fila.metrados_saldo = formato(fila.metrados_saldo)
                    fila.metrados_costo_saldo = formato(fila.metrados_costo_saldo)
                    fila.porcentaje = formato(fila.porcentaje)
                }
                resolve(res[0]);
            }
        })
    })
}
userModel.getActividades = (id_partida) => {
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partida.id_partida, actividades.id_actividad, actividades.tipo actividad_tipo, historialactividades.estado actividad_estado, actividades.nombre nombre_actividad, actividades.veces veces_actividad, actividades.largo largo_actividad, actividades.ancho ancho_actividad, actividades.alto alto_actividad, actividades.parcial metrado_actividad, partida.costo_unitario, actividades.parcial * partida.costo_unitario parcial_actividad, COALESCE(SUM(avanceactividades.valor), 0) actividad_avance_metrado, COALESCE(SUM(avanceactividades.valor *partida.costo_unitario), 0) actividad_avance_costo, actividades.parcial - COALESCE(SUM(avanceactividades.valor), 0) actividad_metrados_saldo, actividades.parcial * partida.costo_unitario- COALESCE(SUM(avanceactividades.valor*partida.costo_unitario), 0)  actividad_metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / actividades.parcial * 100 actividad_porcentaje, TRIM(TRAILING '/DIA' FROM partida.unidad_medida) unidad_medida FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor * partidas.costo_unitario) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 OR partidas.tipo = 'titulo' GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida INNER JOIN actividades ON actividades.Partidas_id_partida = partida.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE partida.id_partida = ? GROUP BY actividades.id_actividad", id_partida, (error, res) => {
            if (error) {
                reject(error);
            } else if (res.length == 0) {
                resolve("vacio");
            } else {
                for (let i = 0; i < res.length; i++) {
                    const fila = res[i];
                    if (fila.actividad_tipo == "titulo") {
                        fila.veces_actividad = ""
                        fila.largo_actividad = ""
                        fila.ancho_actividad = ""
                        fila.alto_actividad = ""
                        fila.metrado_actividad = ""
                        fila.costo_unitario = ""
                        fila.parcial_actividad = ""
                        fila.actividad_avance_metrado = ""
                        fila.actividad_avance_costo = ""
                        fila.actividad_metrados_saldo = ""
                        fila.actividad_metrados_costo_saldo = ""
                        fila.actividad_porcentaje = ""
                        fila.unidad_medida = ""
                    } else if (fila.parcial_actividad < 0) {
                        fila.parcial_actividad = 0
                        fila.actividad_avance_metrado = 0
                        fila.actividad_avance_costo = 0
                        fila.actividad_metrados_saldo = 0
                        fila.actividad_metrados_costo_saldo = 0
                        fila.actividad_porcentaje = 0
                        fila.unidad_medida = 0
                    } else {
                        fila.veces_actividad = formatoAvance(fila.veces_actividad)
                        fila.largo_actividad = formatoAvance(fila.largo_actividad)
                        fila.ancho_actividad = formatoAvance(fila.ancho_actividad)
                        fila.alto_actividad = formatoAvance(fila.alto_actividad)
                        fila.metrado_actividad = formatoAvance(fila.metrado_actividad)
                        fila.costo_unitario = formatoAvance(fila.costo_unitario)
                        fila.parcial_actividad = formatoAvance(fila.parcial_actividad)//formatoAvance
                        fila.actividad_avance_metrado = formatoAvance(fila.actividad_avance_metrado)
                        fila.actividad_avance_costo = formatoAvance(fila.actividad_avance_costo)//formatoAvance
                        fila.actividad_metrados_saldo = formatoAvance(fila.actividad_metrados_saldo)
                        fila.actividad_metrados_costo_saldo = formatoAvance(fila.actividad_metrados_costo_saldo)
                        fila.actividad_porcentaje = formatoAvance(fila.actividad_porcentaje)
                    }
                }
                resolve(res);
            }
        })
    })
}
userModel.getComponentesPNuevas = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT componentes.* FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Partida Nueva' AND componentes.fichas_id_ficha = ? GROUP BY componentes.id_componente", id_ficha, (error, res) => {
            if (error) {
                reject(error);
            } else if (res.length == 0) {
                resolve("vacio");
            } else {
                resolve(res);
            }
        })
    })
}
userModel.getPartidasPNuevas = (id_componente) => {
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/SELECT partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, TRIM(BOTH '/DIA' FROM partidas.unidad_medida) unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_metrado, COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) avance_costo, partidas.metrado - COALESCE(SUM(avanceactividades.valor), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) metrados_saldo, (partidas.metrado * partidas.costo_unitario) - (COALESCE(SUM(avanceactividades.valor * partidas.costo_unitario), 0) * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1)) metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / partidas.metrado * 100 * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje, (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_negatividad, COALESCE(partidas.metrado / partidas.rendimiento, '') partida_duracion, COALESCE(estado_partida.mayorMetrado, FALSE) mayorMetrado, prioridades.valor prioridad_valor, prioridades.color prioridad_color, iconoscategorias.nombre iconocategoria_nombre FROM partidas LEFT JOIN (SELECT partidas.id_partida, TRUE mayorMetrado FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Mayor Metrado' GROUP BY partidas.id_partida) estado_partida ON estado_partida.id_partida = partidas.id_partida LEFT JOIN iconoscategorias ON iconoscategorias.id_iconoCategoria = partidas.iconosCategorias_id_iconoCategoria LEFT JOIN prioridades ON prioridades.id_prioridad = partidas.prioridades_id_prioridad LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p1 ON p1.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial < 0 AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) p2 ON p2.id_partida = partidas.id_partida LEFT JOIN (SELECT historialpartidas.estado, historialpartidas.partidas_id_partida FROM (SELECT MAX(id_historialPartida) id_historialPartida FROM historialpartidas GROUP BY historialpartidas.partidas_id_partida) maximoHistorial LEFT JOIN historialpartidas ON historialpartidas.id_historialPartida = maximoHistorial.id_historialPartida) historialPartida ON historialPartida.partidas_id_partida = partidas.id_partida WHERE historialactividades.estado = 'Partida Nueva' AND partidas.componentes_id_componente = ? GROUP BY partidas.id_partida", id_componente, (error, res) => {
            if (error) {
                reject(error);
            } else if (res.length == 0) {
                resolve("vacio");
            } else {
                for (let i = 0; i < res.length; i++) {
                    const fila = res[i];
                    // fila.iconocategoria_nombre = "MdMonetizationOn"
                    if (fila.tipo == "titulo") {
                        fila.unidad_medida = ""
                        fila.metrado = ""
                        fila.costo_unitario = ""
                        fila.parcial = ""
                        fila.avance_metrado = ""
                        fila.avance_costo = ""
                        fila.metrados_saldo = ""
                        fila.metrados_costo_saldo = ""
                        fila.porcentaje = ""
                        fila.porcentaje_negatividad = ""
                    } else {
                        fila.metrado = formato(fila.metrado)
                        fila.costo_unitario = formato(fila.costo_unitario)
                        fila.parcial = formato(fila.parcial)
                        fila.avance_metrado = formato(fila.avance_metrado)
                        fila.avance_costo = formato(fila.avance_costo)
                        fila.metrados_saldo = formato(fila.metrados_saldo)
                        fila.metrados_costo_saldo = formato(fila.metrados_costo_saldo)
                        fila.porcentaje = Number(formato(fila.porcentaje))
                    }
                    if (fila.partida_duracion != "") {
                        fila.partida_duracion = fila.partida_duracion * 480
                        if (fila.partida_duracion < 60) {
                            fila.partida_duracion = Math.round(fila.partida_duracion) + "m"
                        } else if (fila.partida_duracion < 480) {
                            var horas = Math.trunc(fila.partida_duracion / 60) + "h"
                            var minutos = Math.round(fila.partida_duracion % 60) + "m"
                            fila.partida_duracion = horas + " " + minutos
                        } else {
                            var dias = Math.trunc(fila.partida_duracion / 480) + "d"
                            var residuo_dias = Math.trunc(fila.partida_duracion % 480)
                            var horas = Math.trunc(residuo_dias / 60) + "h"
                            var minutos = Math.round(residuo_dias % 60) + "m"
                            fila.partida_duracion = dias + " " + horas + " " + minutos
                        }
                    }
                }
                resolve(res);
            }
        })
    })
}
userModel.getActividadesPNuevas = (id_partida) => {
    return new Promise((resolve, reject) => {
        pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partida.id_partida, actividades.id_actividad, actividades.tipo actividad_tipo, historialactividades.estado actividad_estado, actividades.nombre nombre_actividad, actividades.veces veces_actividad, actividades.largo largo_actividad, actividades.ancho ancho_actividad, actividades.alto alto_actividad, actividades.parcial metrado_actividad, partida.costo_unitario, actividades.parcial * partida.costo_unitario parcial_actividad, COALESCE(SUM(avanceactividades.valor), 0) actividad_avance_metrado, COALESCE(SUM(avanceactividades.valor * partida.costo_unitario), 0) actividad_avance_costo, actividades.parcial - COALESCE(SUM(avanceactividades.valor), 0) actividad_metrados_saldo, actividades.parcial * partida.costo_unitario - COALESCE(SUM(avanceactividades.valor * partida.costo_unitario), 0) actividad_metrados_costo_saldo, COALESCE(SUM(avanceactividades.valor), 0) / actividades.parcial * 100 actividad_porcentaje, TRIM(TRAILING '/DIA' FROM partida.unidad_medida) unidad_medida FROM (SELECT partidas.Componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, partidas.unidad_medida, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario parcial, SUM(avanceactividades.valor) avance_metrado, SUM(avanceactividades.valor * partidas.costo_unitario) avance_costo, SUM(avanceactividades.valor * partidas.costo_unitario) / partidas.metrado * 100 porcentaje, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE actividades.parcial > 0 OR partidas.tipo = 'titulo' GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida INNER JOIN actividades ON actividades.Partidas_id_partida = partida.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado = 'Partida Nueva' and partida.id_partida = ? GROUP BY actividades.id_actividad", id_partida, (error, res) => {
            if (error) {
                reject(error);
            } else if (res.length == 0) {
                resolve("vacio");
            } else {
                for (let i = 0; i < res.length; i++) {
                    const fila = res[i];
                    if (fila.actividad_tipo == "titulo") {
                        fila.veces_actividad = ""
                        fila.largo_actividad = ""
                        fila.ancho_actividad = ""
                        fila.alto_actividad = ""
                        fila.metrado_actividad = ""
                        fila.costo_unitario = ""
                        fila.parcial_actividad = ""
                        fila.actividad_avance_metrado = ""
                        fila.actividad_avance_costo = ""
                        fila.actividad_metrados_saldo = ""
                        fila.actividad_metrados_costo_saldo = ""
                        fila.actividad_porcentaje = ""
                        fila.unidad_medida = ""
                    } else if (fila.parcial_actividad < 0) {
                        fila.parcial_actividad = 0
                        fila.actividad_avance_metrado = 0
                        fila.actividad_avance_costo = 0
                        fila.actividad_metrados_saldo = 0
                        fila.actividad_metrados_costo_saldo = 0
                        fila.actividad_porcentaje = 0
                        fila.unidad_medida = 0
                    } else {
                        fila.veces_actividad = formato(fila.veces_actividad)
                        fila.largo_actividad = formato(fila.largo_actividad)
                        fila.ancho_actividad = formato(fila.ancho_actividad)
                        fila.alto_actividad = formato(fila.alto_actividad)
                        fila.metrado_actividad = formato(fila.metrado_actividad)
                        fila.costo_unitario = formato(fila.costo_unitario)
                        fila.parcial_actividad = formatoAvance(fila.parcial_actividad)
                        fila.actividad_avance_metrado = formato(fila.actividad_avance_metrado)
                        fila.actividad_avance_costo = formatoAvance(fila.actividad_avance_costo)
                        fila.actividad_metrados_saldo = formato(fila.actividad_metrados_saldo)
                        fila.actividad_metrados_costo_saldo = formato(fila.actividad_metrados_costo_saldo)
                        fila.actividad_porcentaje = formato(fila.actividad_porcentaje)
                    }
                }
                resolve(res);
            }
        })
    })
}
//recursos
userModel.getActividadesDuracion = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query('/******** 02.04.06 Consulta de actividades por tiempo *************/ SELECT item, descripcion, actividades.nombre nombre_actividad, (parcial / rendimiento) duracion_dia, (parcial / rendimiento) * 480 duracion FROM fichas LEFT JOIN componentes ON componentes.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE fichas.id_ficha = ? AND (parcial / rendimiento) IS NOT NULL AND (parcial / rendimiento) > 0 ORDER BY (parcial / rendimiento) ASC', id_ficha, (err, res) => {
            if (err) {
                reject(err.code);
            } else if (res.length == 0) {
                resolve("vacio");
            } else {
                for (let i = 0; i < res.length; i++) {
                    const fila = res[i];
                    // fila.duracion_real = fila.duracion
                    if (fila.duracion < 60) {
                        fila.duracion = formatoAvance(fila.duracion) + "min"
                    } else if (fila.duracion < 480) {
                        var horas = Math.trunc(fila.duracion / 60) + "h"
                        var minutos = formatoAvance(fila.duracion % 60) + "min"
                        fila.duracion = horas + " " + minutos
                    } else {
                        var dias = Math.trunc(fila.duracion / 480) + "d"
                        var residuo_dias = Math.trunc(fila.duracion % 480)
                        var horas = Math.trunc(residuo_dias / 60) + "h"
                        var minutos = formatoAvance(residuo_dias % 60) + "min"
                        fila.duracion = dias + " " + horas + " " + minutos
                    }
                    res[i].duracion_dia = formatoAvance(res[i].duracion_dia)
                }
                resolve(res);
            }
        })
    })
}
userModel.getPrioridades = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from prioridades", (err, res) => {
            if (err) {
                reject(err.code);
            }
            else if (res.length == 0) {
                resolve("vacio");
            } else {
                resolve(res);
            }
        })
    })
}
userModel.getIconoscategorias = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from iconoscategorias", (err, res) => {
            if (err) {
                reject(err.code);
            }
            else if (res.length == 0) {
                resolve("vacio");
            } else {
                resolve(res);
            }
        })
    })
}
module.exports = userModel;
