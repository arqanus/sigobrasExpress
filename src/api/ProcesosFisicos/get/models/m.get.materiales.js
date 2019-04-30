const pool = require('../../../../db/connection');
let userModel = {};

//materiales
userModel.getmaterialesResumen = (id_ficha, tipo, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err);
        }
        else {
            conn.query("SELECT recursos.descripcion, recursos.unidad, SUM(cantidad) cantidad_total, SUM(precio) precio_total, SUM(recursos.parcial) parcial_total FROM componentes LEFT JOIN partidas ON partidas.componentes_id_componente = componentes.id_componente INNER JOIN actividades ON actividades.Partidas_id_partida = partidas.id_partida INNER JOIN recursos ON recursos.partidas_id_partida = partidas.id_partida WHERE componentes.fichas_id_ficha = ? AND recursos.tipo = ? GROUP BY recursos.descripcion ", [id_ficha, tipo], (error, res) => {
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
userModel.getmaterialescomponentes = (id_ficha, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err);
        }
        else {
            conn.query("/**********Consulta materiales por componentes*************/ select id_componente,numero,nombre from componentes where componentes.fichas_id_ficha = ?", id_ficha, (error, res) => {
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
userModel.getmaterialespartidacomponente = (id_componente, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err);
        }
        else {
            conn.query("/**********Consulta de materiales de partidas por componente**********/ SELECT id_partida, partidas.item, partidas.descripcion, partidas.metrado, partidas.costo_unitario, metrado * costo_unitario precio_parcial, partidas.tipo FROM partidas WHERE partidas.componentes_id_componente = ?", id_componente, (error, res) => {
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
userModel.getmaterialespartidaTipos = (id_partida, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err);
        }
        else {
            conn.query("SELECT recursos.tipo FROM recursos WHERE recursos.Partidas_id_partida = ? GROUP BY recursos.tipo", id_partida, (error, res) => {
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
userModel.getmaterialespartidaTiposLista = (id_partida, tipo, callback) => {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err);
        }
        else {
            conn.query("SELECT * FROM recursos WHERE recursos.Partidas_id_partida = ? AND recursos.tipo = ?", [id_partida, tipo], (error, res) => {
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
module.exports = userModel;