const pool = require('../../../../db/connection');
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
        pool.query('SELECT cargos.id_Cargo, cargos.nombre FROM fichas_has_accesos a LEFT JOIN fichas ON fichas.id_ficha = a.Fichas_id_ficha LEFT JOIN fichas_has_accesos b ON b.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = b.accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE a.accesos_id_acceso = ? and cargos.nivel > ?',[id_acceso,nivel],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)            
        })   
    })
         
}
userModel.getTareaUsuariosPorCargo = (id_acceso,id_cargo)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT usuarios.dni,usuarios.nombre,accesos.id_acceso FROM fichas_has_accesos a LEFT JOIN fichas ON fichas.id_ficha = a.Fichas_id_ficha LEFT JOIN fichas_has_accesos b ON b.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = b.accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario WHERE a.accesos_id_acceso = ? and cargos.id_Cargo = ?',[id_acceso,id_cargo],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)            
        })   
    })
         
}
userModel.getTareaReceptor = (receptor,inicio,fin)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT tareas.id_tarea,proyectos.nombre,tareas.asunto,tareas.avance FROM tareas left join proyectos on proyectos.id_proyecto = tareas.proyectos_id_proyecto WHERE receptor = ? AND ? <= avance and avance <= ?',[receptor,inicio,fin],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res)            
        })   
    })
         
}
userModel.getTareaIdTarea = (id_tarea)=>{
    return new Promise((resolve, reject) => { 
        pool.query('SELECT * from tareas where id_tarea = ? ',[id_tarea],(err,res)=>{
            if (err) {
                return reject(err)
            }
            return resolve(res[0])            
        })   
    })
         
}

module.exports = userModel;
