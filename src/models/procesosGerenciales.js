const pool = require('./connection');
let userModel = {};
function formatoPorcentaje(data){
    
    // data = parseFloat(data)
    data = Number(data)
    if(data < 1){
        data = data.toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          })
    }else{
        data = data.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
    } 

    return data
}
userModel.getObras = (id_acceso,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT t1.g_meta, t1.g_total_presu, t1.presu_avance, t1.porcentaje_avance, t1.id_ficha, t1.codigo, t1.estado_nombre, t2.numero, t2.nombre, t2.presupuesto, t2.comp_avance, t2.porcentaje_avance_componentes FROM (SELECT fichas_has_accesos.Accesos_id_acceso, fichas.g_meta, fichas.g_total_presu, SUM(avanceactividades.valor) presu_avance, SUM(avanceactividades.valor) / fichas.g_total_presu * 100 porcentaje_avance, fichas.id_ficha, fichas.codigo, estado.nombre estado_nombre FROM fichas_has_accesos LEFT JOIN fichas ON fichas.id_ficha = fichas_has_accesos.Fichas_id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY fichas.id_ficha) t1 LEFT JOIN (SELECT fichas.id_ficha, componentes.id_componente, componentes.numero, componentes.nombre, componentes.presupuesto, SUM(avanceactividades.valor) comp_avance, SUM(avanceactividades.valor) / componentes.presupuesto * 100 porcentaje_avance_componentes FROM fichas LEFT JOIN presupuestos ON presupuestos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.presupuestos_id_Presupuesto = presupuestos.id_Presupuesto INNER JOIN componentes ON componentes.id_componente = partidas.componentes_id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad GROUP BY componentes.id_componente) t2 ON t1.id_ficha = t2.id_ficha WHERE t1.Accesos_id_acceso = ?",id_acceso,(err,res)=>{
                if(err){
                    callback(err);
                }else{
                    console.log(res);
                    var lastid = -1 
                    var ficha = {}
                    var data = []
                    for (let i = 0; i < res.length; i++) {
                        const fila = res[i];
                        if (fila.id_ficha !== lastid) {
                            if(i != 0){
                                data.push(ficha)
                                ficha = {}
                            }                            
                            ficha.g_meta = fila.g_meta
                            ficha.g_total_presu = fila.g_total_presu
                            ficha.presu_avance = fila.presu_avance
                            ficha.porcentaje_avance = fila.porcentaje_avance
                            ficha.id_ficha = fila.id_ficha
                            ficha.codigo = fila.codigo
                            ficha.estado_nombre = fila.estado_nombre
                            ficha.componentes = [
                                {
                                    "numero":fila.numero,
                                    "nombre":fila.nombre,
                                    "presupuesto":fila.presupuesto,
                                    "comp_avance":fila.comp_avance,
                                    "porcentaje_avance_componentes":fila.porcentaje_avance_componentes
                                }
                            ]
                        }else{
                            var componente = {                                
                                "numero":fila.numero,
                                "nombre":fila.nombre,
                                "presupuesto":fila.presupuesto,
                                "comp_avance":fila.comp_avance,
                                "porcentaje_avance_componentes":fila.porcentaje_avance_componentes
                            }
                            ficha.componentes.push(componente)
                        }
                        lastid = fila.id_ficha
                        
                        
                    }
                    data.push(ficha)

                    console.log(data);

                    for (let i = 0; i < data.length; i++) {
                        const ficha = data[i];
                        ficha.g_total_presu = formatoPorcentaje(ficha.g_total_presu)
                        ficha.presu_avance = formatoPorcentaje(ficha.presu_avance)
                        ficha.porcentaje_avance = formatoPorcentaje(ficha.porcentaje_avance)
                        for (let j = 0; j < ficha.componentes.length; j++) {
                            const componente = ficha.componentes[j];
                            componente.presupuesto = formatoPorcentaje(presupuesto)
                            componente.comp_avance = formatoPorcentaje(comp_avance)
                            componente.porcentaje_avance_componentes = formatoPorcentaje(porcentaje_avance_componentes)
                            

                        }
                    }
                    
                    callback(null,data);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}






module.exports = userModel;