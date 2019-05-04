const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')
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
userModel.getTareaReceptor = (receptor,inicio,fin)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT tareas.id_tarea, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, subtareas.numero numero_subtareas FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN (SELECT tareas.id_tarea, COUNT(subtareas.id_subTarea) numero FROM tareas LEFT JOIN subtareas ON subtareas.tareas_id_tarea = tareas.id_tarea GROUP BY tareas.id_tarea) subtareas ON subtareas.id_tarea = tareas.id_tarea left join tareas_has_accesos on tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE receptor = ? AND ? <= avance AND avance <= ?',[receptor,inicio,fin],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)            
        })   
    })
}
userModel.getTareaIdTarea = (id_tarea)=>{
    return new Promise((resolve, reject) => { 
        pool.query("SELECT tareas.id_tarea, tareas.descripcion, tareas.fecha_inicial, tareas.fecha_final, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, tareas.archivo FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto WHERE tareas.id_tarea = ?",[id_tarea],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res[0])            
        })   
    })
         
}

userModel.getTareaEmisor = (receptor,inicio,fin)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT tareas.id_tarea, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, subtareas.numero numero_subtareas FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN (SELECT tareas.id_tarea, COUNT(subtareas.id_subTarea) numero FROM tareas LEFT JOIN subtareas ON subtareas.tareas_id_tarea = tareas.id_tarea GROUP BY tareas.id_tarea) subtareas ON subtareas.id_tarea = tareas.id_tarea WHERE emisor = ? AND ? <= avance and avance <= ?',[receptor,inicio,fin],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)            
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

module.exports = userModel;
