const pool = require('../../../../db/connection');
let userModel = {};
userModel.deleteEliminarHistorial = (id_historialEstado) => {
	return new Promise((resolve, reject) => {
		pool.query("DELETE FROM historialestados WHERE id_historialEstado = ? ", id_historialEstado, (error, res) => {
			if (error) {
				reject(error.code);
			}
			resolve(res)
		})
	})
}
module.exports = userModel;