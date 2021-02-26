let BaseModel = {};
BaseModel.update = (tabla, valores, condiciones, allNulls = false) => {
  var query = `UPDATE ${tabla} SET `;
  var keys = Object.keys(valores);
  for (let i = 0; i < keys.length; i++) {
    var columna = keys[i];
    if ((valores[columna] != undefined && valores[columna] != "") || allNulls) {
      if (allNulls && valores[columna] == "") {
        query += `${columna} = null,`;
      } else {
        query += `${columna} = '${valores[columna]}',`;
      }
    }
  }
  query = query.slice(0, -1);
  query += " WHERE " + condiciones.join(" AND ");
  console.log("query", query);
  return query;
};
BaseModel.updateOnDuplicateKey = (tabla, listData) => {
  var listValues = "";
  var columnas = "";
  var duplicateKeys = "";

  for (let i = 0; i < listData.length; i++) {
    const valores = listData[i];
    var keys = Object.keys(valores);

    var values = "";
    for (let j = 0; j < keys.length; j++) {
      var columna = keys[j];
      if (valores[columna] == undefined) {
        values += `${valores[columna]},`;
      } else {
        values += `'${valores[columna]}',`;
      }
      if (i == 0) {
        columnas += `${columna},`;
        duplicateKeys += `${columna}=values(${columna}),`;
      }
    }
    values = values.slice(0, -1);
    listValues += `(${values}),`;
  }
  columnas = columnas.slice(0, -1);
  duplicateKeys = duplicateKeys.slice(0, -1);
  listValues = listValues.slice(0, -1);
  var query = `
    INSERT INTO ${tabla} (${columnas} )
    VALUES ${listValues}
    on duplicate key update  ${duplicateKeys}`;
  return query;
};
BaseModel.delete = (tabla, condiciones) => {
  if (condiciones.length == 0) return "";
  var query = `DELETE FROM ${tabla}`;
  query += " WHERE " + condiciones.join(" AND ");
  return query;
};
BaseModel.insert = (tabla, data) => {
  var columnas = "";
  var values = "";

  var keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const columna = keys[i];
    columnas += `${columna},`;
    values += `'${data[columna]}',`;
  }
  columnas = columnas.slice(0, -1);
  values = values.slice(0, -1);
  return `INSERT INTO ${tabla}(${columnas})VALUES(${values})`;
};
BaseModel.select = (tabla, data, condiciones) => {
  var columnas = "";
  if (data != undefined && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      var columna = data[i].columna;
      if (data[i].nombre) {
        var nombre = data[i].nombre;
      } else {
        var nombre = columna;
      }
      if (data[i].format == "fecha") {
        columna = `DATE_FORMAT(${columna}, '%Y-%m-%d')`;
      }
      columnas += `${columna} ${nombre},`;
    }
    columnas = columnas.slice(0, -1);
  } else {
    columnas = "*";
  }
  var query = `select  ${columnas} FROM ${tabla}`;
  if (condiciones.length) {
    query += " WHERE " + condiciones.join(" AND ");
  }
  return query;
};
module.exports = BaseModel;
