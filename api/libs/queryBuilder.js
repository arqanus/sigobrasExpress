function queryBuilder() {
  this.columnas;
  this.tabla;
  this.leftJoinQuery;
  this.query;
  this.condiciones;
  this.orderByQuery;
  this.limitQuery;
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
  this.toString = () => {
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
    if (this.condiciones) query += " WHERE " + this.condiciones.join(" AND ");
    if (this.orderByQuery) query += " ORDER BY " + this.orderByQuery;
    if (this.limitQuery) query += " LIMIT " + this.limitQuery;
    return query;
  };
}
module.exports = queryBuilder;
