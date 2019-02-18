const pool = require('./connection');
let userModel = {};
userModel.getObras = (id_acceso,callback)=>{    
    pool.getConnection(function(err ,conn){
        if(err){ callback(err);}
        else{
            conn.query("SELECT fichas.g_meta, 0 g_total_presu, 0 presu_avance, 0 porcentaje_avance, fichas.id_ficha, fichas.codigo, estado.nombre estado_nombre, 0 numero, 0 nombre, 0 presupuesto, 0 comp_avance, 0 porcentaje_avance_componentes FROM fichas LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha LEFT JOIN (SELECT Fichas_id_ficha, nombre, codigo FROM historialestados INNER JOIN (SELECT MAX(id_historialEstado) id_historialEstado FROM historialestados GROUP BY fichas_id_ficha) historial ON historial.id_historialEstado = historialestados.id_historialEstado LEFT JOIN estados ON estados.id_Estado = historialestados.Estados_id_Estado) estado ON estado.Fichas_id_ficha = fichas.id_ficha WHERE fichas_has_accesos.Accesos_id_acceso = ?",id_acceso,(err,res)=>{
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
                    
                    callback(null,data);
                    conn.destroy()
                }
                
                
            })
        }
        
                
    })
}






module.exports = userModel;