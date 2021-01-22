const DB = {};
DB.obtenerTodosPublico = ({ id_unidadEjecutora, idsectores }) => {
  return new Promise((resolve, reject) => {
    var query = `
   SELECT
        id_ficha,
        fichas.codigo,
        g_meta,
        codigo_unificado,
        g_total_presu,
        unidadejecutoras.nombre unidad_ejecutora_nombre,
        sectores.nombre sector_nombre,
        fichas_datosautomaticos.presupuesto_costodirecto,
        fichas_datosautomaticos.avancefisico_acumulado,
        fichas_datosautomaticos.avancefinanciero_acumulado,
        DATE_FORMAT(plazo_inicial.fecha_inicio, '%Y-%m-%d') plazoinicial_fecha,
        DATE_FORMAT(plazoaprobado_ultimo.fecha_final,
                '%Y-%m-%d') plazoaprobado_ultimo_fecha,
        DATE_FORMAT(plazosinaprobar_ultimo.fecha_final,
                '%Y-%m-%d') plazosinaprobar_ultimo_fecha,
        estados.nombre estadoobra_nombre,
        estados.color estadoobra_color
    FROM
        fichas
            LEFT JOIN
        fichas_datosautomaticos ON fichas_datosautomaticos.fichas_id_ficha = fichas.id_ficha
            LEFT JOIN
        plazos_historial plazo_inicial ON plazo_inicial.id = fichas_datosautomaticos.plazoaprobado_inicial
            LEFT JOIN
        plazos_historial plazoaprobado_ultimo ON plazoaprobado_ultimo.id = fichas_datosautomaticos.plazoaprobado_ultimo
            LEFT JOIN
        plazos_historial plazosinaprobar_ultimo ON plazosinaprobar_ultimo.id = fichas_datosautomaticos.plazosinaprobar_ultimo
            LEFT JOIN
        historialestados ON historialestados.id_historialEstado = fichas_datosautomaticos.estado_obra
            LEFT JOIN
        estados ON estados.id_Estado = historialestados.Estados_id_Estado
            LEFT JOIN
        unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
            LEFT JOIN
        sectores ON sectores.idsectores = fichas.sectores_idsectores
    WHERE
        estado_publico
    `;
    var condiciones = [];
    if (id_unidadEjecutora != 0 && id_unidadEjecutora != undefined) {
      condiciones.push(`(id_unidadEjecutora = ${id_unidadEjecutora})`);
    }
    if (idsectores != 0 && idsectores != undefined) {
      condiciones.push(`(idsectores = ${idsectores})`);
    }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += `
    ORDER BY unidadejecutoras.poblacion desc , sectores_idsectores
    `;
    // resolve(query);
    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
DB.obtenerTodos = ({
  id_unidadEjecutora,
  idsectores,
  id_Estado,
  id_acceso,
  sort_by,
}) => {
  return new Promise((resolve, reject) => {
    if (sort_by) {
      var sort_byData = sort_by.split("-");
    }

    var query = `
       SELECT
            id_ficha,
            fichas.codigo,
            g_meta,
            codigo_unificado,
            g_total_presu,
            unidadejecutoras.nombre unidad_ejecutora_nombre,
            unidadejecutoras.poblacion,
            sectores.nombre sector_nombre,
            fichas_datosautomaticos.presupuesto_costodirecto,
            fichas_datosautomaticos.avancefisico_acumulado,
            fichas_datosautomaticos.avancefinanciero_acumulado,
            DATE_FORMAT(fichas_datosautomaticos.avancefisico_ultimafecha, '%Y-%m-%d') avancefisico_ultimafecha,
            DATE_FORMAT(plazo_inicial.fecha_inicio, '%Y-%m-%d') plazoinicial_fecha,
            DATE_FORMAT(plazoaprobado_ultimo.fecha_final,
                    '%Y-%m-%d') plazoaprobado_ultimo_fecha,
            DATE_FORMAT(plazosinaprobar_ultimo.fecha_final,
                    '%Y-%m-%d') plazosinaprobar_ultimo_fecha,
            estados.nombre estadoobra_nombre,
            estados.color estadoobra_color,
            curva_s_pin.monto pim_anyoactual,
            DATE_FORMAT(MAX(curva_s.fecha_inicial), '%Y-%m-%d') programado_ultima_fecha,
            DATE_FORMAT(MAX(curva_s.financiero_fecha_update),
                '%Y-%m-%d') financiero_ultima_fecha
        FROM
            fichas
                LEFT JOIN
            fichas_has_accesos ON fichas_has_accesos.Fichas_id_ficha = fichas.id_ficha
                LEFT JOIN
            curva_s_pin ON curva_s_pin.fichas_id_ficha = fichas.id_ficha
                AND curva_s_pin.anyo = 2021
                LEFT JOIN
            curva_s ON curva_s.fichas_id_ficha = fichas.id_ficha
                LEFT JOIN
            fichas_datosautomaticos ON fichas_datosautomaticos.fichas_id_ficha = fichas.id_ficha
                LEFT JOIN
            plazos_historial plazo_inicial ON plazo_inicial.id = fichas_datosautomaticos.plazoaprobado_inicial
                LEFT JOIN
            plazos_historial plazoaprobado_ultimo ON plazoaprobado_ultimo.id = fichas_datosautomaticos.plazoaprobado_ultimo
                LEFT JOIN
            plazos_historial plazosinaprobar_ultimo ON plazosinaprobar_ultimo.id = fichas_datosautomaticos.plazosinaprobar_ultimo
                LEFT JOIN
            historialestados ON historialestados.id_historialEstado = fichas_datosautomaticos.estado_obra
                LEFT JOIN
            estados ON estados.id_Estado = historialestados.Estados_id_Estado
                LEFT JOIN
            unidadejecutoras ON unidadejecutoras.id_unidadEjecutora = fichas.unidadEjecutoras_id_unidadEjecutora
                LEFT JOIN
            sectores ON sectores.idsectores = fichas.sectores_idsectores
        WHERE
            Accesos_id_acceso = ${id_acceso}
    `;
    var condiciones = [];
    if (id_unidadEjecutora != 0 && id_unidadEjecutora != undefined) {
      condiciones.push(`(id_unidadEjecutora = ${id_unidadEjecutora})`);
    }
    if (idsectores != 0 && idsectores != undefined) {
      condiciones.push(`(idsectores = ${idsectores})`);
    }
    if (id_Estado != 0 && id_Estado != undefined) {
      condiciones.push(`(id_Estado = ${id_Estado})`);
    }
    if (condiciones.length > 0) {
      query += " AND " + condiciones.join(" AND ");
    }
    query += `
    GROUP BY fichas.id_ficha
    `;
    if (sort_by) {
      var orderBy = ` ORDER BY ${sort_byData[0]} ${sort_byData[1]}`;
      query += orderBy;
    }

    pool.query(query, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};
module.exports = DB;
