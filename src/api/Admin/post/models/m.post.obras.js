const pool = require('../../../../db/connection');
let userModel = {};
userModel.postTipoObra = (data) => {
	return new Promise((resolve, reject) => {
		pool.query("INSERT INTO tipoObras (nombre, codigo) VALUES ?", [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postEstado = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('INSERT INTO estados (nombre,codigo) VALUES ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postUnidadEjecutoras = (data) => {
	return new Promise((resolve, reject) => {
		pool.query("INSERT INTO UnidadEjecutoras (nombre) VALUES ?", [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postFicha = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('INSERT INTO fichas SET ?', data, (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postPlazoEjecucion = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('Insert into PlazoEjecucion set ?', data, (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postHistorialEstado = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('INSERT INTO historialEstados SET ?', data, (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postComponentes = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('INSERT INTO componentes (numero,nombre,presupuesto,fichas_id_ficha) values ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postPartida = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('INSERT INTO partidas SET ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postPartidas = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('INSERT INTO partidas (tipo, item, descripcion, metrado, unidad_medida, costo_unitario, equipo, rendimiento, componentes_id_componente,prioridades_id_prioridad,iconosCategorias_id_iconoCategoria,prioridadesRecursos_id_prioridadesRecurso,iconosCategoriasRecursos_id_iconoscategoriasrecurso) values ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postActividad = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('insert into actividades set ?', [data], (error, res) => {
			if (error) { 
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postActividades = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('insert into actividades  (tipo, nombre, veces, largo, ancho, alto, parcial, Partidas_id_partida) values ?', [data], (error, res) => {
			if (error) { 
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postRecurso = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('INSERT INTO recursos set ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postRecursos = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('INSERT INTO recursos( tipo, codigo, descripcion, unidad, cuadrilla, cantidad, precio, parcial, Partidas_id_partida) values ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}

userModel.postmeta = (data) => {
	return new Promise((resolve, reject) => {
		pool.query("insert into metas set ?", [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postHistorialComponentes = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('Insert into historialcomponentes (estado,componentes_id_componente) values ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.posthistorialActividad = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('insert into historialActividades set ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.posthistorialActividades = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('insert into historialActividades (estado, actividades_id_actividad) values ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postAvanceActividadPorObra = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('Insert into avanceActividades (actividades_id_actividad,fecha,valor,accesos_id_acceso) values ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}
			else {
				resolve(res.insertId);
			}
		})
	})
}
userModel.postclasificadoresPresupuestarios = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('Insert into clasificadores_presupuestarios (anyo,clasificador,descripcion,descripcion_detallada) values ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}else {
				resolve(res);
			}
		})
	})
}
userModel.postResolucion = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('Insert into resoluciones set ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}else {
				resolve(res);
			}
		})
	})
}
userModel.postCostosPresupuestales = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('INSERT INTO costospresupuestales ( nombre, fichas_id_ficha) VALUES ? ON DUPLICATE key UPDATE nombre = VALUES(nombre)', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}else {
				resolve(res);
			}
		})
	})
}
userModel.postPresupuestoAnalitico = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('insert INTO presupuesto_analitico ( resoluciones_id_resolucion, costosPresupuestales_id_costoPresupuestal, clasificadores_presupuestarios_id_clasificador_presupuestario, monto ) VALUES ?', [data], (error, res) => {
			if (error) { 
				console.log(error);
				reject(error.code); 
			}else {
				resolve(res);
			}
		})
	})
}
module.exports = userModel;
