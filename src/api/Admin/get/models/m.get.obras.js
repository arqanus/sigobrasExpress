const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')

let userModel = {};
userModel.getObras = ({ id_tipoObra, textoBuscado }) => {
    var query = "SELECT fichas.id_ficha, fichas.codigo, fichas.g_meta, id_tipoObra FROM fichas LEFT JOIN tipoobras ON tipoobras.id_tipoObra = fichas.tipoObras_id_tipoObra LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha"
    var condiciones = []
    if (id_tipoObra != 0) {
        condiciones.push(`(id_tipoObra = ${id_tipoObra})`)
    }
    if (textoBuscado != "" && textoBuscado != undefined) {
        condiciones.push(`(g_meta like \'%${textoBuscado}%\') || (fichas.codigo like \'%${textoBuscado}%\')`)
    }
    if (condiciones.length > 0) {
        query += " WHERE " + condiciones.join(" AND ")
    }
    query += " group by fichas.id_ficha "
    // return query
    return new Promise((resolve, reject) => {
        pool.query(query, [id_tipoObra, id_tipoObra], (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
}
userModel.getObra = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query('select *from fichas where id_ficha = ?', [id_ficha], (err, res) => {
            if (err) reject(err);
            resolve(res ? res[0] : {});
        })
    })
}
userModel.getComponentesPartidasTotal = ({ id_componente }) => {
    return new Promise((resolve, reject) => {
        var query = `
        SELECT 
            COUNT(partidas.id_partida) partidas_total,
            SUM(partidas.metrado * partidas.costo_unitario) presupuesto
        FROM
            partidas
        WHERE
            partidas.tipo = 'partida'
            AND partidas.componentes_id_componente = ${id_componente}
        `
        pool.query(query, (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res ? res[0] : {});
        })
    })
}
userModel.getEstados = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM estados', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

userModel.getComponentesById = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT componentes.numero, componentes.nombre, componentes.id_componente, componentes.presupuesto FROM componentes WHERE componentes.Fichas_id_ficha = ?', id_ficha, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
}
userModel.getUnidadEjecutora = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from UnidadEjecutoras", (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res);
            }
        })
    })
}
userModel.getTipoAdministracion = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from fichas_tipo_administracion", (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res);
            }
        })
    })
}
userModel.getPartidasPorObra = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("select partidas.item,partidas.tipo,actividades.id_actividad,actividades.parcial/partidas.metrado porcentaje_metrado from componentes left join partidas on partidas.componentes_id_componente = componentes.id_componente left join actividades on actividades.Partidas_id_partida = partidas.id_partida where     componentes.fichas_id_ficha = ? AND ((actividades.parcial IS NOT NULL AND actividades.parcial > 0) OR partidas.tipo = 'titulo')", id_ficha, (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                var partidas = []
                var partida = {}
                var item = -1
                for (let i = 0; i < res.length; i++) {
                    const fila = res[i];
                    if (fila.item != item) {
                        if (i > 0) {
                            partidas.push(partida)
                            partida = {}
                        }
                        partida.item = fila.item
                        partida.tipo = fila.tipo
                        partida.actividades = [
                            {
                                "id_actividad": fila.id_actividad,
                                "porcentaje_metrado": fila.porcentaje_metrado
                            }
                        ]
                    } else {
                        partida.actividades.push({
                            "id_actividad": fila.id_actividad,
                            "porcentaje_metrado": fila.porcentaje_metrado
                        })

                    }
                    item = fila.item
                }
                partidas.push(partida)
                resolve(partidas);
            }
        })
    })
}
userModel.getHistorialEstados = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("select id_historialEstado,Fichas_id_ficha, DATE_FORMAT(fecha_inicial, '%Y-%m-%d') fecha_inicial, DATE_FORMAT(fecha_final, '%Y-%m-%d') fecha_final, Estados_id_Estado from historialestados where Fichas_id_ficha = ?", id_ficha, (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                var Data = []
                for (let i = 0; i < res.length; i++) {
                    const historial = res[i];
                    Data.push(
                        [historial.id_historialEstado, historial.Fichas_id_ficha, historial.fecha_inicial, historial.fecha_final, historial.Estados_id_Estado]
                    )
                }
                resolve(Data)
            }
        })
    })
}

userModel.getPersonalObra = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT id_usuario, cargos.nombre cargo, usuarios.nombre, apellido_paterno, apellido_materno, dni, cpt, celular, email FROM usuarios LEFT JOIN accesos ON usuarios.id_usuario = accesos.Usuarios_id_usuario LEFT JOIN cargos ON cargos.id_cargo = accesos.Cargos_id_Cargo LEFT JOIN fichas_has_accesos ON fichas_has_accesos.Accesos_id_acceso = accesos.id_acceso LEFT JOIN fichas ON fichas.id_ficha = fichas_has_accesos.Fichas_id_ficha WHERE id_ficha =? ", id_ficha, (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res)
            }
        })
    })
}
userModel.getValGeneralTodosComponentes = (id_ficha, fecha_inicial, fecha_final) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT partidas.tipo, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, partidas.metrado * partidas.costo_unitario precio_parcial, periodo_anterior.metrado metrado_anterior, periodo_anterior.valor valor_anterior, periodo_anterior.porcentaje porcentaje_anterior, periodo_actual.metrado metrado_actual, periodo_actual.valor valor_actual, periodo_actual.porcentaje porcentaje_actual, COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0) metrado_total, COALESCE(periodo_anterior.valor, 0) + COALESCE(periodo_actual.valor, 0) valor_total, (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) porcentaje_total, partidas.metrado - (COALESCE(periodo_anterior.metrado, 0) + COALESCE(periodo_actual.metrado, 0)) metrado_saldo, partidas.metrado * costo_unitario - COALESCE(periodo_anterior.valor, 0) - COALESCE(periodo_actual.valor, 0) valor_saldo, 100 - COALESCE(periodo_anterior.porcentaje, 0) - COALESCE(periodo_actual.porcentaje, 0) porcentaje_saldo FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, CAST(SUM(avanceactividades.valor) AS DECIMAL (15 , 3 )) * costo_unitario valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_anterior ON periodo_anterior.id_partida = partidas.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(avanceactividades.valor) metrado, CAST(SUM(avanceactividades.valor) AS DECIMAL (15 , 3 )) * costo_unitario valor, SUM(avanceactividades.valor) / metrado * 100 porcentaje FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.fecha >= ? AND avanceactividades.fecha < ? AND historialactividades.estado IS NULL GROUP BY partidas.id_partida) periodo_actual ON periodo_actual.id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? ORDER BY partidas.id_partida", [fecha_inicial, fecha_inicial, fecha_final, id_ficha], (error, res) => {
            if (error) {
                reject(error);
            } else if (res.length == 0) {
                reject("vacio");
            } else {
                var valor_anterior = 0
                var valor_actual = 0
                var valor_total = 0
                var valor_saldo = 0

                var precio_parcial = 0

                for (let i = 0; i < res.length; i++) {
                    const fila = res[i];

                    valor_anterior += fila.valor_anterior
                    valor_actual += fila.valor_actual
                    valor_total += fila.valor_total
                    valor_saldo += fila.valor_saldo


                    precio_parcial += fila.precio_parcial

                    if (fila.tipo == "titulo") {
                        fila.metrado = ""
                        fila.costo_unitario = ""
                        fila.precio_parcial = ""
                        fila.metrado_anterior = ""
                        fila.valor_anterior = ""
                        fila.porcentaje_anterior = ""
                        fila.metrado_actual = ""
                        fila.valor_actual = ""
                        fila.porcentaje_actual = ""
                        fila.metrado_total = ""
                        fila.valor_total = ""
                        fila.porcentaje_total = ""
                        fila.metrado_saldo = ""
                        fila.valor_saldo = ""
                        fila.porcentaje_saldo = ""

                    } else {
                        fila.metrado = tools.formatoSolesPresicion(fila.metrado)
                        fila.costo_unitario = tools.formatoSolesPresicion(fila.costo_unitario)
                        fila.precio_parcial = tools.formatoSolesPresicion(fila.precio_parcial)
                        fila.metrado_anterior = tools.formatoSolesPresicion(fila.metrado_anterior)
                        fila.valor_anterior = tools.formatoSolesPresicion(fila.valor_anterior)
                        fila.porcentaje_anterior = tools.formatoSolesPresicion(fila.porcentaje_anterior)
                        fila.metrado_actual = tools.formatoSolesPresicion(fila.metrado_actual)
                        fila.valor_actual = tools.formatoSolesPresicion(fila.valor_actual)
                        fila.porcentaje_actual = tools.formatoSolesPresicion(fila.porcentaje_actual)
                        fila.metrado_total = tools.formatoSolesPresicion(fila.metrado_total)
                        fila.valor_total = tools.formatoSolesPresicion(fila.valor_total)
                        fila.porcentaje_total = tools.formatoSolesPresicion(fila.porcentaje_total)
                        fila.metrado_saldo = tools.formatoSolesPresicion(fila.metrado_saldo)
                        fila.valor_saldo = tools.formatoSolesPresicion(fila.valor_saldo)
                        fila.porcentaje_saldo = tools.formatoSolesPresicion(fila.porcentaje_saldo)
                    }
                }

                resolve(
                    {
                        "valor_anterior": tools.formatoSolesPresicion(valor_anterior),
                        "valor_actual": tools.formatoSolesPresicion(valor_actual),
                        "valor_total": tools.formatoSolesPresicion(valor_total),
                        "valor_saldo": tools.formatoSolesPresicion(valor_saldo),
                        "precio_parcial": tools.formatoSolesPresicion(precio_parcial),
                        "porcentaje_anterior": tools.formatoSolesPresicion(valor_anterior / precio_parcial * 100),
                        "porcentaje_actual": tools.formatoSolesPresicion(valor_actual / precio_parcial * 100),
                        "porcentaje_total": tools.formatoSolesPresicion(valor_total / precio_parcial * 100),
                        "porcentaje_saldo": tools.formatoSolesPresicion(valor_saldo / precio_parcial * 100),
                        "partidas": res
                    }
                );
            }
        })
    })
}
userModel.getComponentesPartidasIngresadas = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT componentes.*,max(recursos.descripcion) recurso_descripcion FROM componentes INNER JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente left join recursos on recursos.Partidas_id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? group by componentes.id_componente", [id_ficha], (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res)
            }
        })
    })
}
userModel.getPrioridad = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from prioridades limit 1", (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res[0])
            }
        })
    })
}
userModel.getIconocategoria = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from iconoscategorias limit 1", (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res[0])
            }
        })
    })
}
userModel.getPrioridadesRecursos = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from prioridadesrecursos limit 1", (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res[0])
            }
        })
    })
}
userModel.getIconocategoriaRecursos = () => {
    return new Promise((resolve, reject) => {
        pool.query("select * from iconoscategoriasrecursos limit 1", (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res[0])
            }
        })
    })
}
userModel.getCostosPresupuestales = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM costospresupuestales WHERE fichas_id_ficha = ?", [id_ficha], (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res)
            }
        })
    })
}
userModel.getCostosPresupuestalesMontos = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT costospresupuestales.nombre, SUM(presupuesto_analitico.monto) monto FROM costospresupuestales INNER JOIN presupuesto_analitico ON presupuesto_analitico.costosPresupuestales_id_costoPresupuestal = costospresupuestales.id_costoPresupuestal WHERE costospresupuestales.fichas_id_ficha = ? GROUP BY costospresupuestales.id_costoPresupuestal ", [id_ficha], (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res)
            }
        })
    })
}
userModel.getResoluciones = (id_ficha) => {
    return new Promise((resolve, reject) => {
        pool.query("select * from resoluciones where fichas_id_ficha=?", [id_ficha], (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res)
            }
        })
    })
}
userModel.getHistorialByFechas = (id_componente, fecha_ini, fecha_fin) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT item, avanceactividades.* FROM fichas LEFT JOIN componentes ON componentes.fichas_id_ficha = fichas.id_ficha LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE id_componente = ? AND DATE_FORMAT(?, '%Y-%m-%d') <= DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') AND DATE_FORMAT(avanceactividades.fecha, '%Y-%m-%d') <= DATE_FORMAT(?, '%Y-%m-%d')", [id_componente, fecha_ini, fecha_fin], (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res)
            }
        })
    })
}

////////////////////////////////////////////////////////////////////////////////////////////
userModel.prueba = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM componentes", [], (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res)
            }
        })
    })
}
userModel.updateActividadesParcial = ({ metrado, id_actividad }) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE actividades SET parcial = ? WHERE (id_actividad = ?);", [metrado, id_actividad], (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res)
            }
        })
    })
}
userModel.updatePartidasMetrado = ({ id_partida }) => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE partidas INNER JOIN (SELECT SUM(actividades.parcial) metrado_actividad, actividades.* FROM actividades WHERE actividades.Partidas_id_partida = ?) actividad ON actividad.Partidas_id_partida = partidas.id_partida SET partidas.metrado = actividad.metrado_actividad WHERE partidas.id_partida = ?;", [id_partida, id_partida], (err, res) => {
            if (err) {
                reject(err.code);
            } else {
                resolve(res)
            }
        })
    })
}
userModel.getpartidasAll = ({ id_ficha }) => {
    return new Promise((resolve, reject) => {
        var query = `
        SELECT 
            partidas.*
        FROM
            componentes
                LEFT JOIN
            partidas ON partidas.componentes_id_componente = componentes.id_componente
        WHERE
            fichas_id_ficha = ${id_ficha}
        ORDER BY INET_ATON(SUBSTRING_INDEX(CONCAT(item,'.0.0.0'),'.',4))
        `
        pool.query(query, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res)
        })
    })
}










module.exports = userModel;