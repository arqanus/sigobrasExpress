const pool = require('../../../../db/connection');
const tools = require('../../../../tools/format')

let userModel = {};

//imagenes
userModel.getImagenesComponentes = (id_ficha, callback) => {
    pool.query("SELECT * FROM ((SELECT componentes.fichas_id_ficha, id_componente, numero, componentes.nombre FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.imagen IS NOT NULL) UNION (SELECT componentes.fichas_id_ficha, id_componente, numero, componentes.nombre FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN partidasimagenes ON partidasimagenes.partidas_id_partida = partidas.id_partida)) historialImagenes where fichas_id_ficha = ? order by numero", id_ficha, (error, res) => {
        if (error) {
            callback(error);
        }
        else if (res.length == 0) {
            console.log("vacio");
            callback(null, "vacio");
        }
        else {
            callback(null, res);
        }
    });
};
userModel.getImagenesPartidas = (id_componente, callback) => {
    pool.query("/*COALESCE(parcial_negativo / parcial_positivo, 0) + 1 porcentaje_negatividad_ajustado*/ SELECT partida.id_partida, partida.tipo, partida.item, partida.descripcion, imagenes.numero_imagenes, porcentaje * (COALESCE(parcial_negativo / parcial_positivo, 0) + 1) porcentaje_avance FROM (SELECT partidas.componentes_id_componente, partidas.id_partida, partidas.tipo, partidas.item, partidas.descripcion, COALESCE(SUM(avanceactividades.valor), 0) / partidas.metrado * 100 porcentaje FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad LEFT JOIN historialactividades ON historialactividades.actividades_id_actividad = actividades.id_actividad WHERE historialactividades.estado IS NULL GROUP BY partidas.id_partida) partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_positivo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial > 0 GROUP BY partidas.id_partida) p1 ON p1.id_partida = partida.id_partida LEFT JOIN (SELECT partidas.id_partida, SUM(actividades.parcial) parcial_negativo FROM partidas LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida WHERE actividades.parcial < 0 GROUP BY partidas.id_partida) p2 ON p2.id_partida = partida.id_partida INNER JOIN (SELECT id_partida, COUNT(id_AvanceActividades) numero_imagenes FROM ((SELECT partidas.id_partida, avanceactividades.id_AvanceActividades FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente LEFT JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.imagen IS NOT NULL) UNION (SELECT partidas.id_partida, partidasimagenes.id_partidaImagen FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN partidasimagenes ON partidasimagenes.partidas_id_partida = partidas.id_partida)) historialImagenes GROUP BY id_partida) imagenes ON imagenes.id_partida = partida.id_partida WHERE partida.componentes_id_componente = ?", id_componente, (error, res) => {
        if (error) {
            callback(error);
        }
        else if (res.length == 0) {
            console.log("vacio");
            callback(null, "vacio");
        }
        else {
            for (let i = 0; i < res.length; i++) {
                const fila = res[i];
                if (fila.tipo == "titulo") {
                    fila.numero_imagenes = "";
                    fila.porcentaje_avance = "";
                }
                else {
                    fila.numero_imagenes = tools.formatoSoles(fila.numero_imagenes);
                    fila.porcentaje_avance = tools.formatoSoles(fila.porcentaje_avance);
                }
            }
            callback(null, res);
        }
    });
};
userModel.getImagenesHistorialActividades = (id_partida, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err);
        }
        else {
            conn.query("SELECT avanceactividades.fecha, avanceactividades.imagen, avanceactividades.imagenAlt, avanceactividades.descripcion FROM actividades LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.imagen IS NOT NULL and actividades.Partidas_id_partida = ?", id_partida, (error, res) => {
                if (error) {
                    callback(error);
                }
                else if (res.length == 0) {
                    console.log("vacio");
                    callback(null, "vacio");
                    conn.destroy();
                }
                else {
                    callback(null, res);
                    conn.destroy();
                }
            });
        }
    });
};
userModel.getImagenesHistorialPartidas = (id_partida, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err);
        }
        else {
            conn.query("SELECT DATE_FORMAT(partidasimagenes.fecha, '%d-%m-%Y') fecha, partidasimagenes.imagen, partidasimagenes.imagenAlt, partidasimagenes.descripcionObservacion descripcion FROM partidasimagenes WHERE partidasimagenes.imagen IS NOT NULL AND partidasimagenes.Partidas_id_partida = ?", id_partida, (error, res) => {
                if (error) {
                    callback(error);
                }
                else if (res.length == 0) {
                    console.log("vacio");
                    callback(null, "vacio");
                    conn.destroy();
                }
                else {
                    callback(null, res);
                    conn.destroy();
                }
            });
        }
    });
};
userModel.getPrimeraUltimaImagen = (id_partida,orden = "asc") => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM ((SELECT imagen, fecha, Partidas_id_partida FROM partidasimagenes) UNION (SELECT imagen, fecha, Partidas_id_partida FROM actividades LEFT JOIN avanceactividades ON avanceactividades.Actividades_id_actividad = actividades.id_actividad WHERE avanceactividades.imagen IS NOT NULL)) tb_imagenes where Partidas_id_partida = ? order by fecha "+orden, [id_partida], (error, res) => {
            if (error) {
                reject(error);
            }else {
                resolve(res[0]);
            }
        });
    });
}
module.exports = userModel;

