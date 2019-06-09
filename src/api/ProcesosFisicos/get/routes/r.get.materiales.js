const User = require('../models/m.get.materiales');

module.exports = function (app) {
	app.post('/getmaterialesResumenChart', async (req, res) => {
		try {
			var data = await User.getmaterialesResumenChart("componentes.fichas_id_ficha", req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialesResumenTipos', async (req, res) => {
		try {
			var data = await User.getmaterialesResumenTipos(req.body.id_ficha)
			res.json(data)
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialesResumen', async (req, res) => {
		try {
			var data = await User.getmaterialesResumen("componentes.fichas_id_ficha", req.body.id_ficha, req.body.tipo)
			res.json(data)
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialesResumenEjecucionReal', async (req, res) => {
		try {
			var recursosEjecucionReal = await User.getmaterialesResumenEjecucionReal(req.body.id_ficha, req.body.tipo)
			var nuevosRecursos = await User.getRecursosNuevos(req.body.id_ficha, req.body.tipo)
			recursosEjecucionReal = recursosEjecucionReal.concat(nuevosRecursos)
			//ordenar series
			function compare(a, b) {
				if (!(a.id_tipoDocumentoAdquisicion == "") && (b.id_tipoDocumentoAdquisicion == "")) {
					return -1;
				}
				if ((a.id_tipoDocumentoAdquisicion == "") && !(b.id_tipoDocumentoAdquisicion == "")) {
					return 1;
				}
				if (!(a.id_tipoDocumentoAdquisicion == "") && !(b.id_tipoDocumentoAdquisicion == "")) {
					if (a.id_tipoDocumentoAdquisicion < b.id_tipoDocumentoAdquisicion) {
						return -1;
					}
					if (a.id_tipoDocumentoAdquisicion > b.id_tipoDocumentoAdquisicion) {
						return 1;
					}
					if (a.id_tipoDocumentoAdquisicion == b.id_tipoDocumentoAdquisicion) {
						if (a.recurso_codigo < b.recurso_codigo) {
							return -1;
						}
						if (a.recurso_codigo > b.recurso_codigo) {
							return 1;
						}
					}
				}
				if (a.descripcion < b.descripcion) {
					return -1;
				}
				if (a.descripcion > b.descripcion) {
					return 1;
				}
				return 0;
			}
			recursosEjecucionReal.sort(compare);

			res.json(recursosEjecucionReal)
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialesResumenEjecucionRealSinCodigo', async (req, res) => {
		try {
			var data = await User.getmaterialesResumenEjecucionReal(req.body.id_ficha, req.body.tipo, false, "null", false)
			res.json(data)
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialesResumenEjecucionRealCodigos', async (req, res) => {
		try {
			var tipodocumentoadquisicion = await User.gettipodocumentoadquisicion()
			for (let i = 0; i < tipodocumentoadquisicion.length; i++) {
				const tipoDoc = tipodocumentoadquisicion[i];
				tipoDoc.idDocumento = tipoDoc.id_tipoDocumentoAdquisicion
				tipoDoc.tipoDocumento = tipoDoc.nombre_largo
				delete tipoDoc.id_tipoDocumentoAdquisicion
				delete tipoDoc.nombre_largo
				var codigos = await User.getmaterialesResumenEjecucionRealCodigos(req.body.id_ficha, tipoDoc.idDocumento)
				var codigosNuevosRecursos = await User.getRecursosNuevosCodigos(req.body.id_ficha, tipoDoc.idDocumento)
				codigos = codigos.concat(codigosNuevosRecursos)
				//quitando duplicados
				codigos = [...new Set(codigos)];
				tipoDoc.cantidad = codigos.length
				tipoDoc.codigos = codigos
			}
			res.json(
				tipodocumentoadquisicion
			)
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialesResumenEjecucionRealCodigosData', async (req, res) => {
		try {
			var data = await User.getmaterialesResumenEjecucionReal(req.body.id_ficha, req.body.tipo, true, req.body.codigo, false, req.body.id_tipoDocumentoAdquisicion, false)
			var dataRecursoNuevo = await User.getRecursosNuevosCodigosData(req.body.id_ficha,req.body.codigo,req.body.id_tipoDocumentoAdquisicion)
			data = data.concat(dataRecursoNuevo)
			var id_documentoAdquisicion = data[0].documentosAdquisicion_id_documentoAdquisicion
			var documentoAdquisicion = await User.getdocumentosadquisicion(id_documentoAdquisicion)
			if (documentoAdquisicion == "vacio") {
				documentoAdquisicion = {}
				documentoAdquisicion.id_documentoAdquisicion = ""
				documentoAdquisicion.razonSocial = ""
				documentoAdquisicion.RUC = ""
				documentoAdquisicion.fecha = ""
				documentoAdquisicion.SIAF = ""
				documentoAdquisicion.NCP = ""
				documentoAdquisicion.clasificadores_presupuestarios_id_clasificador_presupuestario = ""
				documentoAdquisicion.clasificador = ""
			}
			documentoAdquisicion.recursos = data
			res.json(
				documentoAdquisicion		
			)
		} catch (error) {
			console.log(error);			
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialescomponentesChart', async (req, res) => {
		try {
			var data = await User.getmaterialesResumenChart("componentes.id_componente", req.body.id_componente)
			res.json(data)
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialescomponentesTipos', async (req, res) => {
		try {
			var data = await User.getmaterialescomponentesTipos(req.body.id_componente)
			res.json(data)
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialescomponentesResumen', async (req, res) => {
		try {
			var data = await User.getmaterialesResumen("componentes.id_componente", req.body.id_componente, req.body.tipo)
			res.json(data)
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialescomponentes', async (req, res) => {
		try {
			var componentes = await User.getmaterialescomponentes(req.body.id_ficha)
			var partidas = await User.getmaterialespartidacomponente(componentes[0].id_componente)
			componentes[0].partidas = partidas
			res.json(componentes);
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialespartidacomponente', async (req, res) => {
		try {
			var data = await User.getmaterialespartidacomponente(req.body.id_componente)
			res.json(data);
		} catch (error) {
			res.status(400).json(error);
		}
	})

	app.post('/getmaterialespartidaTipos', async (req, res) => {
		try {
			var data = await User.getmaterialespartidaTipos(req.body.id_partida)
			res.json(data);
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getmaterialespartidaTiposLista', async (req, res) => {
		try {
			var data = await User.getmaterialespartidaTiposLista(req.body.id_partida, req.body.tipo)
			res.json(data);
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.get('/getmaterialesPrioridadesRecursos', async (req, res) => {
		try {
			var data = await User.getmaterialesPrioridadesRecursos()
			res.json(data);
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.get('/getmaterialesiconoscategoriasrecursos', async (req, res) => {
		try {
			var data = await User.getmaterialesiconoscategoriasrecursos()
			res.json(data);
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.get('/gettipodocumentoadquisicion', async (req, res) => {
		try {
			var data = await User.gettipodocumentoadquisicion()
			res.json(data);
		} catch (error) {
			res.status(400).json(error);
		}
	})
	app.post('/getclasificadoresPesupuestarios', async (req, res) => {
		try {
			var data = await User.getclasificadoresPesupuestarios(req.body.todos, req.body.clasificador)
			res.json(data);
		} catch (error) {
			res.status(400).json(error);
		}
	})

}