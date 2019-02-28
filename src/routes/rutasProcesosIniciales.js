const User = require('../models/procesosIniciales');

function soloLetras(req,res,next){
	var regla = /^[A-Za-z]+$/
	var usuario =  req.body.usuario
	if(usuario.match(regla)&&req.body.password.match(regla)){
		// console.log("usuario",usuario)
		next()
	}else{
		res.status(400).send("caracteres invalidos")
	}
}


module.exports = function(app){
	//profesoines
	app.post('/postProfesion',(req,res)=>{
		User.postProfesion(req.body,(err,data)=>{
			if(err) {res.status(204).json(err);}
			else{
				res.json(data);	
			}
			
		})

	})
	app.get('/getProfesiones',(req,res)=>{
		User.getProfesiones((err,data)=>{
			if(err) res.status(204).json(err);
			res.json(data);	
		})

	})
	
	//USUARIOS

	app.post('/nuevoUsuario',(req,res)=>{
		var fecha =req.body.fecha
		var cpt = req.body.cpt
		var id_profesion = req.body.id_profesion
		delete req.body.fecha		
		delete  req.body.cpt
		delete  req.body.id_profesion
		User.postPersonalTecnico(req.body,(err,id_usuario)=>{
			if(err) {res.status(204).json(err);}
			else{
				var ProfesionUsuario = {
					"profesiones_id_profesion":id_profesion,
					"usuarios_id_usuario":id_usuario,
					"fecha":fecha,
					"cpt":cpt
				}

				User.postProfesionUsuario(ProfesionUsuario,(err,data)=>{
					if (err) {
						res.status(204).json(err);
					}else{
						res.json(data);	
					}
				})
				
			}
			
		})

	})

	app.get('/listaUsuarios',(req,res)=>{
		User.getPersonalTecnico((err,data)=>{
			if(err) {res.status(204).json(err);}
			else {res.json(data);	}
		})

	})
	//cargos
	app.post('/nuevoCargo',(req,res)=>{
		
		User.postCargo(req.body,(err,data)=>{
			if(err) {
				res.status(204).json(err)
			}else{
				res.json(data);	
			}
			//deshabilitamos los demas cargos
			// --------------------------------
			
		})

	})

	app.get('/listaCargos',(req,res)=>{
		User.getCargos((err,data)=>{
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}
		})
	})
	//privilegios
	app.post('/nuevoPrivilegio',(req,res)=>{
		User.postPrivilegios(req.body,(err,data)=>{
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);
			}
			
		})
	})
	app.get('/listaPrivilegios',(req,res)=>{
		User.getPrivilegios((err,data)=>{
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}
		})
	})
	//obras
	app.post('/nuevaObra',(req,res)=>{
		var g_total_presu = req.body.g_total_presu
		var id_estado = req.body.id_estado
		var componentes = req.body.componentes
		var fecha_final = req.body.fecha_final
		// console.log("fecha final",fecha_final);
		
		// delete req.body.g_total_presu;
		delete req.body.id_estado;
		delete req.body.componentes;
		delete req.body.fecha_final;		
		User.postObra(req.body,(err,id_ficha)=>{
			if(err) {res.status(204).json(err);}
			else{
				var plazoEjecucion={
					"FechaEjecucion":fecha_final,
					"fichas_id_ficha":id_ficha,
				}
				User.postPlazoEjecucion(plazoEjecucion,(err,data)=>{
					if(err) {res.status(204).json(err);}
					else{
						var Historial = {											
							"Fichas_id_ficha":id_ficha,
							"Estados_id_estado":id_estado,
						}
						User.postHistorialEstados(Historial,(err,data)=>{							
							if(err){ res.status(204).json(err);}
							else{
								var data_procesada = [];								
								for(var i = 0; i < componentes.length; i++){
									var componente = [];
									componente.push(componentes[i]["0"]);
									componente.push(componentes[i]["1"]);
									componente.push(componentes[i]["2"]);									
									data_procesada.push(componente);
								}		
								// console.log(data_procesada);
								User.postComponentes(data_procesada,(err,idComponente)=>{
									if(err) {res.status(204).json(err);}
									else{
										var presupuestos = []
										for (let i = 0; i < componentes.length; i++) {
											var presupuesto = []
											presupuesto.push(componentes[i]["2"]);
											
											presupuesto.push(id_ficha)
											presupuestos.push(presupuesto);
											
										}										
										User.postPresupuestos(presupuestos,(err,idpresupuesto)=>{
											if(err) {res.status(204).json(err);}
											else{
												var idFichas={
													"id_ficha":id_ficha,											
													"componentes":[]
												}
												var historialComponentes = []
												for (let i = 0; i < componentes.length; i++) {
													idFichas.componentes.push(
														{
															"numero":i+1,
															"idComponente":idComponente,
															"idPresupuesto":idpresupuesto
														}
													)
		
													historialComponentes.push(
														[													
															"oficial",
															idComponente
														]
													)
		
													idComponente+=1;
													idpresupuesto+=1;
													
												}
												User.postHistorialComponentes(historialComponentes,(err,data)=>{
													if (err) {
														
														res.json(err);
													}else{
		
														res.json(idFichas)
													}
												})
											}
										})
										
										
										
									}
		
									
								})	
							}
		
						})
					}
					
						
				})

					
					
				
			}
			
			
		})

	})	
	app.get('/listaObras',(req,res)=>{
		User.getObras((err,data)=>{
			if(err) res.status(204).json(err);
			res.json(data);	
		})
	})
	//accesos
	app.post('/nuevoAcceso',(req,res)=>{	
		User.postAcceso(req.body,(err,data)=>{
			if(err) res.status(204).json(err);
			res.json(data);		
			
		})

	})
	//asignar obra
	app.post('/asignarObra',(req,res)=>{
		var id_usuario = req.body.id_usuario;
		var id_ficha = req.body.id_ficha;
		// delete req.body["cargo_id_cargo"];
		
		User.getIdAcceso(id_usuario,(err,data)=>{
			if(err) res.status(204).json(err);
			// console.log("data",data);
			var obrausuario = {
				"Fichas_id_ficha":id_ficha,
				"Accesos_id_acceso":data[0].id_acceso
			}
			// console.log("data",obrausuario);
			User.postObraUsuario(obrausuario,(err2,data2)=>{
				if(err2) res.json(err2);
				res.json(data2);
			})
			
			
		})

	})
	//componentes
	app.post('/listaComponentesPorId',(req,res)=>{
		User.getComponentesById(req.body.id_ficha,(err,data)=>{
			if(err) {res.status(204).json(err);}
			else{
				res.json(data);	
			}
		})
	})
	//partidas
	app.post('/nuevasPartidas',(req,res)=>{
		
		var errores=[]
		var listaIdPartida = []
		var listaPartidas = []
		// console.log("body",req.body)
		// console.log("ruta")

		for (let i = 0; i < req.body.length; i++) {
			const element = req.body[i];
			const obPartida = [
				element.tipo,
				element.item,
				element.descripcion,
				element.unidad_medida,
				element.metrado,
				element.costo_unitario,
				element.equipo,
				element.rendimiento,
				element.componentes_id_componente,
				element.presupuestos_id_presupuesto
			]
			listaPartidas.push(obPartida)
		}
		User.postPartidas(listaPartidas,(err,idPartida)=>{
			if(err){
				errores.push(
					{
						"PostPartidas":"partida",
						"error":err
					}
				)
				res.json(err);
			}
			else{
				// res.json(idPartida);
							
				// console.log("partidas insertadas")
				// res.json(idPartida)
				var element = idPartida						
				var actividades = []
				var recursos = []
				for (let j = 0; j < req.body.length; j++,element+=1) {
					// console.log("actividades")
					//insertando idpartida
					if(req.body[j].tipo == "partida"){
						var obActividad = req.body[j].actividades
						for (let k = 0; k < obActividad.length; k++) {
							obActividad[k].push(element);
						}
						actividades = actividades.concat(obActividad)

						// recursos agregando id partida
						var obRecurso = req.body[j].recursos
						// console.log("recursos")
						for (let k = 0; k < obRecurso.length; k++) {
							obRecurso[k].push(element);
						}
						recursos = recursos.concat(obRecurso)
					}				
				}
				// console.log("actividades",actividades);
				
				User.postActividades(actividades,(err,data)=>{
					if(err){
						errores.push(
							{
								"elemento":"actividad",
								"error":err
							}
						)						
					}
					else{
						User.postRecursos(recursos,(err,data)=>{
							if(err){
								errores.push(
									{
										"elemento":"recursos",
										"error":err
									}
								)
								res.json(errores);
							}
							else{
								var element = idPartida
								var historialpartidas = []
								for (let i = 0; i < req.body.length; i++) {
									
									var historial=[										
										"oficial",
										element
									]
									historialpartidas.push(historial)	
									element+=1
								}
								// console.log("historial",historialpartidas);
								
								
								User.postHistorialPartidas(historialpartidas,(err,data)=>{
									if (err) {
										errores.push(
											{
												"elemento":"historial de partidas",
												"error":err
											}
										)
										res.json(errores);
									}else{
										res.json(data)
									}
								})
								
							}
						})
					}
				})
					
								
			}
		})	
	})
	//login
	app.post('/login',soloLetras,(req,res)=>{
		
		User.postLogin(req.body,(err,data)=>{
			
			if(err){
				res.status(204).json(err);
			}else{
				res.status(200).json(data);
			}
			
		})
	})
	//estados
	app.post('/postEstado',(req,res)=>{
		
		User.postEstado(req.body,(err,data)=>{
			
			if(err) res.status(204).json(err);
			res.status(200).json(data);
		})
	})
	app.get('/listaEstados',(req,res)=>{	
		
		
		User.getEstados((err,data)=>{			
			if(err){
				res.status(204).json(err);
			} else{
				res.status(200).json(data);
			}
			
		})
	})
	app.post('/ActualizarEstado',(req,res)=>{
		
		User.postHistorialEstados(req.body,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
	})
	app.post('/getDatosGenerales',(req,res)=>{
		
		User.getDatosGenerales(req.body.id_ficha,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
	})

	app.post('/postMenu',(req,res)=>{
		// req.body =JSON.stringify(req.body)
		
		// console.log("iniciand",req.body);
		// res.json(req.body)	
		
			User.postMenu(req.body,(err,data)=>{							
				if(err){ res.status(204).json(err);}
				else{
					res.json(data);	
				}

			})
	})

	app.post('/getMenu',(req,res)=>{	
	
	
		User.getMenu(req.body,(err,data)=>{							
			if(err){ res.status(204).json(err);}
			else{
				res.json(data);	
			}

		})
	})
	
	
	
	
}
