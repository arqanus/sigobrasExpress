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
userModel.postUnidadEjecutora = (data) => {
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
userModel.postAvanceActividadPorObra = (data) => {
	return new Promise((resolve, reject) => {
		pool.query('Insert into avanceActividades (actividades_id_actividad,fecha,valor,accesos_id_acceso) values ?', [data], (err, res) => {
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
module.exports = userModel;
