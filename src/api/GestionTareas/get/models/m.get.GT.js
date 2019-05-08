const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')
const default_data = require('../../../../tools/default_data')
let userModel = {};

userModel.getTareaProyectos = ()=>{
    return new Promise((resolve, reject) => {
        pool.query('select *from proyectos', (err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)               
        })  
    })      
}
userModel.getTareaProyecto = (id_proyecto)=>{
    return new Promise((resolve, reject) => {
        pool.query('select *from proyectos where id_proyecto = ?',id_proyecto, (err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res[0])               
        })  
    })      
}
userModel.getTareaAccesoCargo = (id_acceso)=>{
    return new Promise((resolve, reject) => {
        pool.query('select cargos.nivel from accesos left join cargos on cargos.id_Cargo = accesos.Cargos_id_Cargo where accesos.id_acceso =?',[id_acceso],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res[0])             
        }) 
    })
}
userModel.getTareaCargos = (id_acceso,nivel)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT cargos.id_Cargo, cargos.nombre FROM fichas_has_accesos a LEFT JOIN fichas ON fichas.id_ficha = a.Fichas_id_ficha LEFT JOIN fichas_has_accesos b ON b.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = b.accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE a.accesos_id_acceso = ? and cargos.nivel > ? GROUP BY cargos.id_Cargo',[id_acceso,nivel],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)            
        })   
    })
}
userModel.getTareaUsuariosPorCargo = (id_acceso,id_cargo)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT usuarios.dni,usuarios.nombre,accesos.id_acceso FROM fichas_has_accesos a LEFT JOIN fichas ON fichas.id_ficha = a.Fichas_id_ficha LEFT JOIN fichas_has_accesos b ON b.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = b.accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario WHERE a.accesos_id_acceso = ? and cargos.id_Cargo = ? group by usuarios.id_usuario',[id_acceso,id_cargo],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)            
        })   
    })
         
}
userModel.getTareasProyectos = (emireceptor,id_acceso,inicio,fin)=>{
    return new Promise((resolve, reject) => { 
        pool.query('select proyectos.* FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto left JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE '+emireceptor+' = ? AND ? <= avance AND avance <= ? AND tareas.fecha_final >= now() group by proyectos.id_proyecto order by tareas.fecha_final desc',[id_acceso,inicio,fin],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)            
        })   
    })
}
userModel.getTareas = (emireceptor,id_acceso,inicio,fin,id_proyecto)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT tareas.id_tarea, proyectos.color proyecto_color, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, DATEDIFF(tareas.fecha_final, NOW()) prioridad_color, usuarios.nombre emisor_nombre, cargos.nombre emisor_cargo FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN accesos ON accesos.id_acceso = tareas.emisor LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE '+emireceptor+' = ? AND ? <= avance AND avance <= ? and proyectos.id_proyecto = ? and tareas.fecha_final >= now()',[id_acceso,inicio,fin,id_proyecto],(err,res)=>{
            if (err) {  
                return reject(err)
            }
            function prioridad_color(valor){
                if(valor<2){
                    return "#ff8969"
                }else if(valor < 5){
                    return "#fef768"
                }else if(valor<10){
                    return "#abd56e"
                }
            }
            for (let i = 0; i < res.length; i++) {
                const tarea = res[i];
                tarea.imagen_subordinado = [
                    {
                        "imagen":default_data.user_image_default,
                        "imagen_alt":"test"
                    }
                ]
                tarea.prioridad_color = prioridad_color(tarea.prioridad_color)
            }
            return resolve(res)            
        })   
    })
}
userModel.getTareaEmisor = (emireceptor,id_acceso,inicio,fin)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT tareas.id_tarea,proyectos.color proyecto_color, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, DATEDIFF(tareas.fecha_final,now()) prioridad_color FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE '+emireceptor+' = ? AND ? <= avance AND avance <= ? and tareas.fecha_final >= now() and receptor is null',[id_acceso,inicio,fin],(err,res)=>{
            if (err) {
                return reject(err)
            }
            function prioridad_color(valor){
                if(valor<2){
                    return "#ff8969"
                }else if(valor < 5){
                    return "#fef768"
                }else if(valor<10){
                    return "#abd56e"
                }
            }
            for (let i = 0; i < res.length; i++) {
                const tarea = res[i];
                tarea.imagen_subordinado = [
                    {
                        "imagen":default_data.user_image_default,
                        "imagen_alt":"test"
                    }
                ]
                tarea.prioridad_color = prioridad_color(tarea.prioridad_color)
            }
            return resolve(res)            
        })   
    })
}
userModel.getTareasProyectosVencidas = (emireceptor,id_acceso,inicio,fin)=>{
    return new Promise((resolve, reject) => { 
        pool.query('select proyectos.* FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto left JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE '+emireceptor+' = ? AND ? <= avance AND avance <= ? AND tareas.fecha_final < now() group by proyectos.id_proyecto order by tareas.fecha_final desc',[id_acceso,inicio,fin],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)            
        })   
    })
}
userModel.getTareasVencidas = (emireceptor,id_acceso,inicio,fin,id_proyecto)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT tareas.id_tarea, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, DATEDIFF(tareas.fecha_final,now()) prioridad_color FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE '+emireceptor+' = ? AND ? <= avance AND avance <= ? and proyectos.id_proyecto = ? and tareas.fecha_final < now()',[id_acceso,inicio,fin,id_proyecto],(err,res)=>{
            if (err) {  
                return reject(err)
            }
            function prioridad_color(valor){
                if(valor<2){
                    return "#ff8969"
                }else if(valor < 5){
                    return "#fef768"
                }else if(valor<10){
                    return "#abd56e"
                }
            }
            for (let i = 0; i < res.length; i++) {
                const tarea = res[i];
                tarea.imagen_subordinado = [
                    {
                        "imagen":default_data.user_image_default,
                        "imagen_alt":"test"
                    }
                ]
                tarea.prioridad_color = prioridad_color(tarea.prioridad_color)
            }
            return resolve(res)            
        })   
    })
}
userModel.getTareaEmisorVencidas = (emireceptor,id_acceso,inicio,fin)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT tareas.id_tarea, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, DATEDIFF(tareas.fecha_final,now()) prioridad_color FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE '+emireceptor+' = ? AND ? <= avance AND avance <= ? and tareas.fecha_final < now() and receptor is null',[id_acceso,inicio,fin],(err,res)=>{
            if (err) {
                return reject(err)
            }
            function prioridad_color(valor){
                if(valor<2){
                    return "#ff8969"
                }else if(valor < 5){
                    return "#fef768"
                }else if(valor<10){
                    return "#abd56e"
                }
            }
            for (let i = 0; i < res.length; i++) {
                const tarea = res[i];
                tarea.imagen_subordinado = [
                    {
                        "imagen":default_data.user_image_default,
                        "imagen_alt":"test"
                    }
                ]
                tarea.prioridad_color = prioridad_color(tarea.prioridad_color)
            }
            return resolve(res)            
        })   
    })
}
userModel.getTareaIdTarea = (id_tarea)=>{
    return new Promise((resolve, reject) => { 
        pool.query("SELECT tareas.id_tarea,tareas.avance, tareas.descripcion, tareas.fecha_inicial, tareas.fecha_final, proyectos.color proyecto_color,proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, tareas.archivo tipo_archivo, usuarios.nombre emisor_nombre, cargos.nombre emisor_cargo FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN accesos ON accesos.id_acceso = tareas.emisor LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE tareas.id_tarea = ?",[id_tarea],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res[0])            
        })   
    })
         
}
userModel.getSubTareaIdSubTarea = (id_subtarea)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT * from subtareas where id_subtarea = ? ',[id_subtarea],(err,res)=>{
            if (err) {
                return reject(err)
            }
            for (let i = 0; i < res.length; i++) {
                const subtarea = res[i];
                subtarea.color = tools.ColoresRandom()
            }
            return resolve(res[0])            
        })   
    })
}
userModel.getTareaPorcentajeAvance = (id_tarea)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT COALESCE(avance / Ntareas * 100, 0) porcentajeAvance FROM (SELECT tareas_id_tarea, COUNT(subtareas.id_subTarea) Ntareas FROM subtareas WHERE tareas_id_tarea = ? GROUP BY tareas_id_tarea) tareas LEFT JOIN (SELECT tareas_id_tarea, COUNT(subtareas.id_subTarea) avance FROM subtareas WHERE tareas_id_tarea = ? AND subtareas.terminado = TRUE GROUP BY tareas_id_tarea) avanceTareas ON avanceTareas.tareas_id_tarea = tareas.tareas_id_tarea',[id_tarea,id_tarea],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res[0])            
        })   
    })
}
userModel.getSubTareas = (id_tarea,terminado)=>{
    return new Promise((resolve, reject) => { 
        pool.query('select * from subtareas where subtareas.tareas_id_tarea = ? and subtareas.terminado = ? order by subtareas.id_subtarea desc',[id_tarea,terminado],(err,res)=>{
            if (err) {
                return reject(err)
            }
            for (let i = 0; i < res.length; i++) {
                const subtarea = res[i];
                subtarea.color = tools.ColoresRandomRGB()
            }
            return resolve(res)            
        })   
    })
}
userModel.getTareaSubordinados = (id_acceso,nivel)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT usuarios.nombre usuario_nombre,usuarios.apellido_paterno,cargos.nombre cargo_nombre,cargos.nivel cargo_nivel,accesos.id_acceso, usuarios.imagen subordinado_imagen, usuarios.imagenAlt subordinado_imagenAlt FROM fichas_has_accesos a LEFT JOIN fichas ON fichas.id_ficha = a.Fichas_id_ficha LEFT JOIN fichas_has_accesos b ON b.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = b.accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario WHERE a.accesos_id_acceso = ? AND cargos.nivel > ? GROUP BY accesos.id_acceso',[id_acceso,nivel],(err,res)=>{
            if (err) {
                return reject(err)
            }
            for (let i = 0; i < res.length; i++) {
                const subordinado = res[i];
                subordinado.subordinado_imagen= subordinado.subordinado_imagen||default_data.user_image_default
                subordinado.subordinado_imagenAlt= subordinado.subordinado_imagenAlt||"test"
            }
            
            return resolve(res)            
        })   
    })
}
userModel.getTareaSubordinadosTareas = (id_acceso)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT id_proyecto,proyectos.color prioridad_color,tareas_has_accesos.tareas_id_tarea FROM tareas_has_accesos left join tareas on tareas.id_tarea = tareas_has_accesos.tareas_id_tarea left join proyectos on proyectos.id_proyecto = tareas.proyectos_id_proyecto WHERE receptor = ?',[id_acceso],(err,res)=>{
            if (err) {
                return reject(err)
            }            
            while(res.length < 8){
                res.push({
                    "id_proyecto": null,
                    "prioridad_color": "",
                    "tareas_id_tarea": ""
                }
                )
            }
            return resolve(res)            
        })   
    })
}
module.exports = userModel;
