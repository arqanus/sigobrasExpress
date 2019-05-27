const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')
const default_data = require('../../../../tools/default_data')
let userModel = {};

userModel.getTareaProyectos = () => {
    return new Promise((resolve, reject) => {
        pool.query('select *from proyectos', (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })
}
userModel.getTareaProyecto = (id_proyecto) => {
    return new Promise((resolve, reject) => {
        pool.query('select *from proyectos where id_proyecto = ?', id_proyecto, (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res[0])
        })
    })
}
userModel.getTareaAccesoCargo = (id_acceso) => {
    return new Promise((resolve, reject) => {
        pool.query('select cargos.nivel from accesos left join cargos on cargos.id_Cargo = accesos.Cargos_id_Cargo where accesos.id_acceso =?', [id_acceso], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res[0])
        })
    })
}
userModel.getTareaCargos = (id_acceso, nivel) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT cargos.id_Cargo, cargos.nombre FROM fichas_has_accesos a LEFT JOIN fichas ON fichas.id_ficha = a.Fichas_id_ficha LEFT JOIN fichas_has_accesos b ON b.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = b.accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE a.accesos_id_acceso = ? and cargos.nivel > ? GROUP BY cargos.id_Cargo', [id_acceso, nivel], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })
}
userModel.getTareaUsuariosPorCargo = (id_acceso, id_cargo) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT usuarios.dni,usuarios.nombre,accesos.id_acceso FROM fichas_has_accesos a LEFT JOIN fichas ON fichas.id_ficha = a.Fichas_id_ficha LEFT JOIN fichas_has_accesos b ON b.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = b.accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario WHERE a.accesos_id_acceso = ? and cargos.id_Cargo = ? group by usuarios.id_usuario', [id_acceso, id_cargo], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })

}
userModel.getTareasProyectos = (emireceptor, id_acceso, inicio, fin) => {
    return new Promise((resolve, reject) => {
        pool.query('select proyectos.* FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto left JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE ' + emireceptor + ' = ? AND ? <= avance AND avance <= ? AND (avance = 100 or tareas.fecha_final >= NOW()) group by proyectos.id_proyecto order by tareas.fecha_final asc', [id_acceso, inicio, fin], (err, res) => {
            if (err) {
                return reject(err)
            } else if (res.length == 0) {
                return reject("vacio")
            }
            return resolve(res)
        })
    })
}
userModel.getTareas = (emireceptor, id_acceso, inicio, fin, id_proyecto) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT tareas.id_tarea, proyectos.color proyecto_color, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, DATEDIFF(tareas.fecha_final, NOW()) prioridad_color, usuarios.nombre emisor_nombre, cargos.nombre emisor_cargo FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN accesos ON accesos.id_acceso = tareas.emisor LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE ' + emireceptor + ' = ? AND ? <= avance AND avance <= ? and proyectos.id_proyecto = ? and (avance = 100 or tareas.fecha_final >= NOW()) order by tareas.fecha_final asc', [id_acceso, inicio, fin, id_proyecto], (err, res) => {
            if (err) {
                return reject(err)
            } else if (res.length == 0) {
                return reject("vacio")
            }
            function prioridad_color(valor) {
                if (valor < 2) {
                    return "#ff8969"
                } else if (valor < 5) {
                    return "#fef768"
                } else if (valor < 10) {
                    return "#abd56e"
                }
            }
            for (let i = 0; i < res.length; i++) {
                const tarea = res[i];
                tarea.imagen_subordinado = [
                    {
                        "imagen": default_data.user_image_default,
                        "imagen_alt": "test"
                    }
                ]
                tarea.prioridad_color = prioridad_color(tarea.prioridad_color)
            }
            return resolve(res)
        })
    })
}
userModel.getTareaEmisor = (emireceptor, id_acceso, inicio, fin) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT tareas.id_tarea,proyectos.color proyecto_color, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, DATEDIFF(tareas.fecha_final,now()) prioridad_color,if(proyectos.nombre = "RECORDATORIO","R","T") tipo_tarea FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE ' + emireceptor + ' = ? AND ? <= avance AND avance <= ? and tareas.fecha_final >= now() and receptor is null', [id_acceso, inicio, fin], (err, res) => {
            if (err) {
                return reject(err)
            } else if (res.length == 0) {
                return reject("vacio")
            }
            function prioridad_color(valor) {
                if (valor < 2) {
                    return "#ff8969"
                } else if (valor < 5) {
                    return "#fef768"
                } else if (valor < 10) {
                    return "#abd56e"
                }
            }
            for (let i = 0; i < res.length; i++) {
                const tarea = res[i];
                tarea.imagen_subordinado = [
                    {
                        "imagen": default_data.user_image_default,
                        "imagen_alt": "test"
                    }
                ]
                tarea.prioridad_color = prioridad_color(tarea.prioridad_color)
            }
            return resolve(res)
        })
    })
}
userModel.getTareasProyectosVencidas = (emireceptor, id_acceso, inicio, fin) => {
    return new Promise((resolve, reject) => {
        pool.query('select proyectos.* FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto left JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE ' + emireceptor + ' = ? AND ? <= avance AND avance <= ? AND tareas.fecha_final < now() group by proyectos.id_proyecto order by tareas.fecha_final desc', [id_acceso, inicio, fin], (err, res) => {
            if (err) {
                return reject(err)
            } else if (res.length == 0) {
                return reject("vacio")
            }
            return resolve(res)
        })
    })
}
userModel.getTareasVencidas = (emireceptor, id_acceso, inicio, fin, id_proyecto) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT tareas.id_tarea, proyectos.color proyecto_color, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, DATEDIFF(tareas.fecha_final, NOW()) prioridad_color, usuarios.nombre emisor_nombre, cargos.nombre emisor_cargo FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN accesos ON accesos.id_acceso = tareas.emisor LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE ' + emireceptor + ' = ? AND ? <= avance AND avance <= ? and proyectos.id_proyecto = ? and tareas.fecha_final < now()', [id_acceso, inicio, fin, id_proyecto], (err, res) => {
            if (err) {
                return reject(err)
            } else if (res.length == 0) {
                return reject("vacio")
            }
            function prioridad_color(valor) {
                if (valor < 2) {
                    return "#ff8969"
                } else if (valor < 5) {
                    return "#fef768"
                } else if (valor < 10) {
                    return "#abd56e"
                }
            }
            for (let i = 0; i < res.length; i++) {
                const tarea = res[i];
                tarea.imagen_subordinado = [
                    {
                        "imagen": default_data.user_image_default,
                        "imagen_alt": "test"
                    }
                ]
                tarea.prioridad_color = prioridad_color(tarea.prioridad_color)
            }
            return resolve(res)
        })
    })
}
userModel.getTareaEmisorVencidas = (emireceptor, id_acceso, inicio, fin) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT tareas.id_tarea,proyectos.color proyecto_color, proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, DATEDIFF(tareas.fecha_final,now()) prioridad_color,if(proyectos.nombre = "RECORDATORIO","R","T") tipo_tarea FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE ' + emireceptor + ' = ? AND ? <= avance AND avance <= ? and tareas.fecha_final < now() and receptor is null', [id_acceso, inicio, fin], (err, res) => {
            if (err) {
                return reject(err)
            } else if (res.length == 0) {
                return reject("vacio")
            }
            function prioridad_color(valor) {
                if (valor < 2) {
                    return "#ff8969"
                } else if (valor < 5) {
                    return "#fef768"
                } else if (valor < 10) {
                    return "#abd56e"
                }
            }
            for (let i = 0; i < res.length; i++) {
                const tarea = res[i];
                tarea.imagen_subordinado = [
                    {
                        "imagen": default_data.user_image_default,
                        "imagen_alt": "test"
                    }
                ]
                tarea.prioridad_color = prioridad_color(tarea.prioridad_color)
            }
            return resolve(res)
        })
    })
}
userModel.getTareaIdTarea = (id_tarea) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT tareas.id_tarea,tareas.avance, tareas.descripcion, tareas.fecha_inicial, tareas.fecha_final, proyectos.color proyecto_color,proyectos.nombre proyecto_nombre, tareas.asunto, tareas.avance porcentaje_avance, tareas.archivo tipo_archivo, usuarios.nombre emisor_nombre, cargos.nombre emisor_cargo,usuarios.imagen usuario_imagen, usuarios.imagenAlt usuario_imagenAlt, DATEDIFF(tareas.fecha_final,now()) prioridad_color FROM tareas LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto LEFT JOIN accesos ON accesos.id_acceso = tareas.emisor LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo WHERE tareas.id_tarea = ?", [id_tarea], (err, res) => {
            if (err) {
                return reject(err)
            } else if (res.length == 0) {
                return reject("vacio")
            }
            res[0].usuario_imagen = res[0].usuario_imagen || default_data.user_image_default
            res[0].usuario_imagenAlt = res[0].usuario_imagenAlt || "default"

            function prioridad_color(valor) {
                if (valor < 2) {
                    return "#ff8969"
                } else if (valor < 5) {
                    return "#fef768"
                } else if (valor < 10) {
                    return "#abd56e"
                }
            }

            res[0].prioridad_color = prioridad_color(res[0].prioridad_color)
            return resolve(res[0])
        })
    })
}
userModel.getSubTareaIdSubTarea = (id_subtarea) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * from subtareas where id_subtarea = ? ', [id_subtarea], (err, res) => {
            if (err) {
                return reject(err)
            } else if (res.length == 0) {
                return reject("vacio")
            }
            for (let i = 0; i < res.length; i++) {
                const subtarea = res[i];
                subtarea.color = tools.ColoresRandom()
            }
            return resolve(res[0])
        })
    })
}
userModel.getTareaPorcentajeAvance = (id_tarea) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT COALESCE(avance / Ntareas * 100, 0) porcentajeAvance FROM (SELECT tareas_id_tarea, COUNT(subtareas.id_subTarea) Ntareas FROM subtareas WHERE tareas_id_tarea = ? GROUP BY tareas_id_tarea) tareas LEFT JOIN (SELECT tareas_id_tarea, COUNT(subtareas.id_subTarea) avance FROM subtareas WHERE tareas_id_tarea = ? AND subtareas.terminado = TRUE GROUP BY tareas_id_tarea) avanceTareas ON avanceTareas.tareas_id_tarea = tareas.tareas_id_tarea', [id_tarea, id_tarea], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res[0])
        })
    })
}

userModel.getTareaSubordinados = (id_acceso, nivel) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT usuarios.nombre usuario_nombre,usuarios.apellido_paterno,cargos.nombre cargo_nombre,cargos.nivel cargo_nivel,accesos.id_acceso, usuarios.imagen subordinado_imagen, usuarios.imagenAlt subordinado_imagenAlt FROM fichas_has_accesos a LEFT JOIN fichas ON fichas.id_ficha = a.Fichas_id_ficha LEFT JOIN fichas_has_accesos b ON b.Fichas_id_ficha = fichas.id_ficha LEFT JOIN accesos ON accesos.id_acceso = b.accesos_id_acceso LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario WHERE a.accesos_id_acceso = ? AND cargos.nivel > ? GROUP BY accesos.id_acceso', [id_acceso, nivel], (err, res) => {
            if (err) {
                return reject(err)
            }
            for (let i = 0; i < res.length; i++) {
                const subordinado = res[i];
                subordinado.subordinado_imagen = subordinado.subordinado_imagen || default_data.user_image_default
                subordinado.subordinado_imagenAlt = subordinado.subordinado_imagenAlt || "test"
            }

            return resolve(res)
        })
    })
}
userModel.getTareaSubordinadosTareas = (id_acceso) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT id_proyecto,proyectos.color prioridad_color,tareas_has_accesos.tareas_id_tarea FROM tareas_has_accesos left join tareas on tareas.id_tarea = tareas_has_accesos.tareas_id_tarea left join proyectos on proyectos.id_proyecto = tareas.proyectos_id_proyecto WHERE receptor = ? and tareas.avance < 100', [id_acceso], (err, res) => {
            if (err) {
                return reject(err)
            }
            while (res.length < 8) {
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
userModel.getTareaComentarios = (id_comentario, id_tarea) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT comentarios.mensaje, DATE_FORMAT(comentarios.fecha, '%h:%i %p') hora, DATE_FORMAT(comentarios.fecha, '%d/%c/%Y') fecha, CONCAT(usuarios.nombre,usuarios.apellido_paterno) usuario, usuarios.imagen FROM comentarios left join accesos on accesos.id_acceso = comentarios.accesos_id_acceso left join usuarios on usuarios.id_usuario = accesos.Usuarios_id_usuario where id_comentario = ? or comentarios.tareas_id_tarea = ?", [id_comentario, id_tarea], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })
}
userModel.getChartRendimientoUsuario = (id_acceso) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM ((SELECT COUNT(tareas.id_tarea) tareas_cantidad, DATE_FORMAT(fecha_final, '%m') - 1 mes_numero, proyectos.nombre, id_proyecto FROM tareas LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto WHERE receptor = ? AND avance = 100 GROUP BY DATE_FORMAT(fecha_final, '%Y-%m-01') , id_proyecto) UNION (SELECT COUNT(tareas.id_tarea) tareas_cantidad, DATE_FORMAT(fecha_final, '%m') - 1 mes_numero, CONCAT(proyectos.nombre, '_VENCIDO') nombre, id_proyecto FROM tareas LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto WHERE receptor = ? AND avance < 100 AND tareas.fecha_final < NOW() GROUP BY DATE_FORMAT(fecha_final, '%Y-%m-01') , id_proyecto)) rendimiento_usuario order by mes_numero,id_proyecto,nombre", [id_acceso, id_acceso], (err, res) => {
            if (err) {
                return reject(err)
            } else {
                var categories = []
                var meses_numero = []
                var series = []
                var proyectos_nombres = []
                //creando data inicial
                for (let i = 0; i < res.length; i++) {
                    const dato = res[i];
                    if (meses_numero.indexOf(dato.mes_numero) === -1) {
                        categories.push(tools.monthNames[dato.mes_numero])
                        meses_numero.push(dato.mes_numero)
                    }
                    if (proyectos_nombres.indexOf(dato.nombre) === -1) {
                        series.push({
                            name: dato.nombre,
                            data: []
                        })
                        proyectos_nombres.push(dato.nombre)
                    }
                }
                //lenando de ceros
                for (let i = 0; i < categories.length; i++) {
                    const cat = categories[i];
                    for (let j = 0; j < series.length; j++) {
                        const serie = series[j];
                        serie.data.push(0)
                    }
                }
                //lenando data

                for (let i = 0; i < res.length; i++) {
                    const dato = res[i];
                    for (let j = 0; j < series.length; j++) {
                        const serie = series[j];
                        if (serie.name == dato.nombre) {
                            var index = meses_numero.indexOf(dato.mes_numero)
                            serie.data[index] = dato.tareas_cantidad
                            break
                        }
                    }

                }

                return resolve({
                    series,
                    categories
                })
            }
        })
    })
}
userModel.getChartRendimientoUsuarioAnyos = (id_acceso) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT YEAR(fecha_final) anyo FROM ((SELECT fecha_final FROM tareas LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea WHERE receptor = ? AND avance = 100) UNION (SELECT fecha_final FROM tareas LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto WHERE receptor = ? AND avance < 100 AND tareas.fecha_final < NOW())) rendimiento_usuario GROUP BY YEAR(fecha_final)", [id_acceso, id_acceso], (err, res) => {
            if (err) {
                return reject(err)
            } else {

                return resolve(res)
            }
        })
    })
}
userModel.getUsuarioTareasDetalles = (id_acceso) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT usuarios.nombre, usuarios.apellido_paterno, usuarios.imagen foto, cargos.nombre cargo, COALESCE(tareasAsignadas.cantidad, 0) tareasAsignadas, COALESCE(tareasConcluidas.cantidad, 0) tareasConcluidas, COALESCE(tareasProgreso.cantidad, 0) tareasProgreso, COALESCE(tareasVencidas.cantidad, 0) tareasVencidas, COALESCE(tareasDesdeHastaAnios.tareasDesdeHastaAnios, '') tareasDesdeHastaAnios, (COALESCE(tareasConcluidas.cantidad, 0) / (COALESCE(tareasAsignadas.cantidad, 0))) * 100 porcentajeAvance, (COALESCE(tareasConcluidas.cantidad, 0) / (COALESCE(tareasAsignadas.cantidad, 0))) * 5 estrellas FROM accesos LEFT JOIN usuarios ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_Cargo = accesos.Cargos_id_Cargo LEFT JOIN (SELECT receptor, COUNT(tareas.id_tarea) cantidad FROM tareas LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto WHERE avance = 100 GROUP BY receptor) tareasConcluidas ON tareasConcluidas.receptor = accesos.id_acceso LEFT JOIN (SELECT receptor, COUNT(tareas.id_tarea) cantidad FROM tareas LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto WHERE avance < 100 AND tareas.fecha_final < NOW() GROUP BY receptor) tareasVencidas ON tareasVencidas.receptor = accesos.id_acceso LEFT JOIN (SELECT receptor, COUNT(tareas.id_tarea) cantidad FROM tareas LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto GROUP BY receptor) tareasAsignadas ON tareasAsignadas.receptor = accesos.id_acceso LEFT JOIN (SELECT receptor, COUNT(tareas.id_tarea) cantidad FROM tareas LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto WHERE avance < 100 AND tareas.fecha_final >= NOW() GROUP BY receptor) tareasProgreso ON tareasProgreso.receptor = accesos.id_acceso LEFT JOIN (SELECT receptor, CONCAT(MIN(YEAR(fecha_final)), ' - ', MAX(YEAR(fecha_final))) tareasDesdeHastaAnios FROM tareas LEFT JOIN tareas_has_accesos ON tareas_has_accesos.tareas_id_tarea = tareas.id_tarea LEFT JOIN proyectos ON proyectos.id_proyecto = tareas.proyectos_id_proyecto GROUP BY receptor) tareasDesdeHastaAnios ON tareasDesdeHastaAnios.receptor = accesos.id_acceso where accesos.id_acceso=?", [id_acceso], (err, res) => {
            if (err) {
                return reject(err)
            } else {
                var calificacionEstrellas = []
                var estrellas = Math.round(res[0].estrellas)
                for (let i = 0; i < 5; i++) {
                    if (i < estrellas) {
                        calificacionEstrellas.push(1)
                    } else {
                        calificacionEstrellas.push(0)
                    }
                }
                res[0].calificacionEstrellas = calificacionEstrellas
                return resolve(
                    res[0]
                )
            }
        })
    })
}
userModel.getObrasAcargo = (id_acceso) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_ficha idObra,codigo codigoObra FROM fichas_has_accesos LEFT JOIN fichas ON fichas.id_ficha = fichas_has_accesos.Fichas_id_ficha where fichas_has_accesos.Accesos_id_acceso = ?", [id_acceso], (err, res) => {
            if (err) {
                return reject(err)
            } else {

                return resolve(res)
            }
        })
    })
}
module.exports = userModel;
