const pool = require('../../../db/connection');

module.exports = {
    putFichas({ id_ficha,fecha_inicial, g_sector,g_pliego,g_func,g_prog,g_subprog,g_tipo_act,g_tipo_comp,g_meta,g_snip,g_local_dist,g_local_prov,g_local_reg,f_fuente_finan,f_entidad_finan,f_entidad_ejec,tiempo_ejec,g_total_presu,lugar,modalidad_ejecutora,codigo_unificado,centropoblado_direccion}) 
    // putFichas(data)
        {
        // console.log("res",data);
        return new Promise((resolve, reject) => {
            pool.query(`
            UPDATE sigobras_db.fichas 
            SET 
                fecha_inicial =  \'${fecha_inicial} \',
                g_sector =  \'${g_sector} \',
                g_pliego =  \'${g_pliego} \',
                g_func = \'${g_func} \',
                g_prog = \'${g_prog} \',
                g_subprog = \'${g_subprog} \',
                g_tipo_act = \'${g_tipo_act} \',
                g_tipo_comp = \'${g_tipo_comp} \',
                g_meta = \'${g_meta} \',
                g_snip = \'${g_snip} \',
                g_local_dist = \'${g_local_dist} \',
                g_local_prov = \'${g_local_prov} \',
                g_local_reg = \'${g_local_reg} \',
                f_fuente_finan = \'${f_fuente_finan} \',
                f_entidad_finan = \'${f_entidad_finan} \',
                f_entidad_ejec = \'${f_entidad_ejec} \',
                tiempo_ejec = \'${tiempo_ejec} \',
                g_total_presu = \'${g_total_presu} \',
                lugar = \'${lugar} \',
                modalidad_ejecutora = \'${modalidad_ejecutora} \',
                codigo_unificado = \'${codigo_unificado} \',
                centropoblado_direccion = \'${centropoblado_direccion} \'
            WHERE
                (id_ficha =  ${id_ficha} );
            `, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            })
        })
    },
}