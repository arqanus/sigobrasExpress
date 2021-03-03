function queryBuilder(tabla) {
  this.columnas;
  this.tabla = tabla;
  this.leftJoinQuery;
  this.query;
  this.condiciones;
  this.orderByQuery;
  this.limitQuery;
  this.insertData;
  this.mergeEstado;
  this.delEstado;
  this.select = (columnas) => {
    this.columnas = columnas;
    return this;
  };
  this.from = (tabla) => {
    this.tabla = tabla;
    return this;
  };
  this.leftJoin = (leftJoinQuery) => {
    this.leftJoinQuery = leftJoinQuery;
    return this;
  };
  this.where = (condiciones) => {
    this.condiciones = condiciones;
    return this;
  };
  this.orderBy = (orderByQuery) => {
    if (Array.isArray(orderByQuery)) {
      this.orderByQuery = orderByQuery.join(",");
    } else if (typeof orderByQuery == "string") {
      this.orderByQuery = orderByQuery;
    }
    return this;
  };
  this.limit = (limitQuery) => {
    this.limitQuery = limitQuery;
    return this;
  };
  this.insert = (insertData) => {
    this.insertData = insertData;
    return this;
  };
  this.merge = () => {
    this.mergeEstado = true;
    return this;
  };
  this.del = () => {
    this.delEstado = true;
    return this;
  };
  this.selectFunction = () => {
    var columnas = "";
    if (
      this.columnas == "*" ||
      this.columnas == "" ||
      this.columnas == undefined
    ) {
      columnas = "*";
    } else {
      for (let i = 0; i < this.columnas.length; i++) {
        var element = this.columnas[i];
        if (Array.isArray(element)) {
          if (element.length == 2) {
            var columna = element[0];
            var nombre = element[1];
            columnas += `${columna} ${nombre},`;
          } else if (element.length == 3) {
            if (element[2] == "date") {
              var columna = element[0];
              var nombre = element[1];
              columnas += `DATE_FORMAT(${columna}, '%Y-%m-%d') ${nombre},`;
            }
          }
        } else {
          var columna = element;
          columnas += `${columna},`;
        }
      }
      columnas = columnas.slice(0, -1);
    }

    var query = `select  ${columnas} FROM ${this.tabla}`;
    if (this.leftJoinQuery) query += " LEFT JOIN " + this.leftJoinQuery;
    if (this.condiciones) {
      if (Array.isArray(this.condiciones)) {
        query += " WHERE " + this.condiciones.join(" AND ");
      } else {
        query += " WHERE " + this.condiciones;
      }
    }
    if (this.orderByQuery) query += " ORDER BY " + this.orderByQuery;
    if (this.limitQuery) query += " LIMIT " + this.limitQuery;
    this.query = query;
  };
  this.onDuplicateKeyUpdateFunction = () => {
    var listValues = "";
    var columnas = "";
    var duplicateKeys = "";
    console.log("this.insertData", this.insertData);
    for (let i = 0; i < this.insertData.length; i++) {
      const valores = this.insertData[i];
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
    this.query = `
    INSERT INTO ${this.tabla} (${columnas} )
    VALUES ${listValues}
    on duplicate key update  ${duplicateKeys}`;
  };
  this.deleteFunction = () => {
    if (this.condiciones.length == 0) {
      this.query = "";
    } else {
      var query = `DELETE FROM ${this.tabla}`;
      if (this.condiciones) {
        if (Array.isArray(this.condiciones)) {
          query += " WHERE " + this.condiciones.join(" AND ");
        } else {
          query += " WHERE " + this.condiciones;
        }
      }
    }
    this.query = query;
    return;
  };
  this.toString = () => {
    if (this.mergeEstado) {
      this.onDuplicateKeyUpdateFunction();
    } else if (this.delEstado) {
      this.deleteFunction();
    } else {
      this.selectFunction();
    }
    return this.query;
  };
}
module.exports = queryBuilder;
