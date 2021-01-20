const User = require("../models/m.post.pFisicos");
const User2 = require("../../get/models/m.get.pFisicos");
var formidable = require("formidable");
var fs = require("fs");
function datetime() {
  var today = new Date();
  var date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  var time =
    today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  return date + "_" + time;
}
module.exports = function (app) {
  app.post("/postNuevaActividadMayorMetrado", (req, res) => {
    if (req.body.partidas_id_partida == null) {
      res.json("null");
    } else {
      User.postActividad(req.body, (err, id_actividad) => {
        if (err) {
          res.status(204).json(err);
        } else {
          var historialActividad = {
            estado: "Mayor Metrado",
            Actividades_id_actividad: id_actividad,
          };
          User.posthistorialActividades(
            historialActividad,
            async (err, id_historial) => {
              if (err) {
                res.status(204).json(err);
              } else {
                var partidas = await User2.getPartidas(null, id_actividad);
                var actividades = await User2.getActividades(
                  partidas[0].id_partida
                );
                mayorMetrado = await User2.getPartidasMayorMetradoAvance(
                  partidas[0].id_partida
                );
                mayorMetrado = mayorMetrado || {};
                res.json({
                  partida: partidas[0],
                  mayor_metrado: {
                    mm_avance_metrado: mayorMetrado.avance_metrado || 0,
                    mm_avance_costo: mayorMetrado.avance_costo || 0,
                    mm_metrados_saldo: mayorMetrado.metrados_saldo || 0,
                    mm_metrados_costo_saldo:
                      mayorMetrado.metrados_costo_saldo || 0,
                    mm_porcentaje: mayorMetrado.porcentaje || 0,
                  },
                  actividades: actividades,
                });
              }
            }
          );
        }
      });
    }
  });
  app.post("/avanceActividad", (req, res) => {
    console.log("avanceActividad");
    //ruta de la carpeta public de imagenes
    var dir = publicFolder;
    //crear ruta si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    var form = new formidable.IncomingForm();
    //se configura la ruta de guardar
    form.uploadDir = dir;
    form.parse(req, function (err, fields, files) {
      if (fields.valor <= 0) {
        res.json("valor no permitido");
      } else {
        console.log("accesos_id_acceso :", fields.accesos_id_acceso);
        console.log("codigo_obra :", fields.codigo_obra);
        console.log(
          "Actividades_id_actividad :",
          fields.Actividades_id_actividad
        );
        console.log("valor :", fields.valor);
        console.log("foto :", fields.foto);
        console.log("observacion :", fields.observacion);
        console.log("descripcion :", fields.descripcion);
        if (err) {
          res.json(err);
        }
        //folder de la obra
        var obraFolder = dir + "/" + fields.codigo_obra;
        if (!fs.existsSync(obraFolder)) {
          fs.mkdirSync(obraFolder);
        } // TODO: make sure my_file and project_id exist
        var ruta =
          "/" +
          fields.accesos_id_acceso +
          "_" +
          fields.Actividades_id_actividad +
          "_" +
          datetime() +
          ".jpg";
        //files foto
        if (files.foto) {
          fs.rename(files.foto.path, obraFolder + ruta, function (err) {
            if (err) {
              res.json(err);
            }
            var avanceActividad = {
              Actividades_id_actividad: fields.Actividades_id_actividad,
              valor: fields.valor,
              imagen: "/static/" + fields.codigo_obra + ruta,
              imagenAlt: fields.codigo_obra,
              descripcion: fields.descripcion,
              observacion: fields.observacion,
              accesos_id_acceso: fields.accesos_id_acceso,
            };
            User.postAvanceActividad(avanceActividad, async (err, data) => {
              if (err) {
                res.status(204).json(err);
              } else {
                var partidas = await User2.getPartidas(
                  null,
                  fields.Actividades_id_actividad
                );
                var actividades = await User2.getActividades(
                  partidas[0].id_partida
                );
                mayorMetrado = await User2.getPartidasMayorMetradoAvance(
                  partidas[0].id_partida
                );
                mayorMetrado = mayorMetrado || {};
                res.json({
                  partida: partidas[0],
                  mayor_metrado: {
                    mm_avance_metrado: mayorMetrado.avance_metrado || 0,
                    mm_avance_costo: mayorMetrado.avance_costo || 0,
                    mm_metrados_saldo: mayorMetrado.metrados_saldo || 0,
                    mm_metrados_costo_saldo:
                      mayorMetrado.metrados_costo_saldo || 0,
                    mm_porcentaje: mayorMetrado.porcentaje || 0,
                  },
                  actividades: actividades,
                });
              }
            });
          });
        } else {
          var avanceActividad = {
            Actividades_id_actividad: fields.Actividades_id_actividad,
            valor: fields.valor,
            imagenAlt: fields.codigo_obra,
            descripcion: fields.descripcion,
            observacion: fields.observacion,
            accesos_id_acceso: fields.accesos_id_acceso,
          };
          User.postAvanceActividad(avanceActividad, async (err, data) => {
            if (err) {
              res.status(204).json(err);
            } else {
              var partidas = await User2.getPartidas(
                null,
                fields.Actividades_id_actividad
              );
              var actividades = await User2.getActividades(
                partidas[0].id_partida
              );
              mayorMetrado = await User2.getPartidasMayorMetradoAvance(
                partidas[0].id_partida
              );
              mayorMetrado = mayorMetrado || {};
              res.json({
                partida: partidas[0],
                mayor_metrado: {
                  mm_avance_metrado: mayorMetrado.avance_metrado || 0,
                  mm_avance_costo: mayorMetrado.avance_costo || 0,
                  mm_metrados_saldo: mayorMetrado.metrados_saldo || 0,
                  mm_metrados_costo_saldo:
                    mayorMetrado.metrados_costo_saldo || 0,
                  mm_porcentaje: mayorMetrado.porcentaje || 0,
                },
                actividades: actividades,
              });
            }
          });
        }
      }
    });
  });
  app.post("/postActividad2", async (req, res) => {
    try {
      var fecha_revisada = await User.getFechasRevisadas(req.body);
      var message = "";
      var response = "";
      if (fecha_revisada.total == 0) {
        response = await User.postActividad2(req.body);
        if (response.affectedRows > 0) {
          User.actualizarAvanceFisicoAcumulado(req.body);
          message = "registro exitoso";
        } else {
          message = "hubo un problema al momento del registro";
          res.status(400).json({ message });
          return;
        }
      } else {
        message = "la fecha que ingresó ya fue verificada por el supervisor";
        res.status(400).json({ message });
        return;
      }
      res.status(200).json({ message });
    } catch (error) {
      console.log(error);
      var message = "hubo un problema al momento del registro";
      res.status(400).json({ message });
    }
  });
  app.post("/avanceActividadCorte", (req, res) => {
    console.log("avanceActividadCorte");
    var dir = publicFolder;
    //crear ruta si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    var form = new formidable.IncomingForm();
    //se configura la ruta de guardar
    form.uploadDir = dir;
    form.parse(req, function (err, fields, files) {
      console.log("accesos_id_acceso :", fields.accesos_id_acceso);
      console.log("codigo_obra :", fields.codigo_obra);
      console.log(
        "Actividades_id_actividad :",
        fields.Actividades_id_actividad
      );
      console.log("valor :", fields.valor);
      console.log("foto :", fields.foto);
      console.log("observacion :", fields.observacion);
      console.log("descripcion :", fields.descripcion);
      if (err) {
        res.json(err);
      }
      //folder de la obra
      var obraFolder = dir + "/" + fields.codigo_obra;
      if (!fs.existsSync(obraFolder)) {
        fs.mkdirSync(obraFolder);
      } // TODO: make sure my_file and project_id exist
      var ruta =
        "/" +
        fields.accesos_id_acceso +
        "_" +
        fields.Actividades_id_actividad +
        "_" +
        datetime() +
        ".jpg";
      //files foto
      if (files.foto) {
        fs.rename(files.foto.path, obraFolder + ruta, function (err) {
          if (err) {
            res.json(err);
          }
          var avanceActividad = {
            Actividades_id_actividad: fields.Actividades_id_actividad,
            valor: fields.valor,
            imagen: "/static/" + fields.codigo_obra + ruta,
            imagenAlt: fields.codigo_obra,
            descripcion: fields.descripcion,
            observacion: fields.observacion,
            accesos_id_acceso: fields.accesos_id_acceso,
          };
          User.postAvanceActividad(avanceActividad, async (err, data) => {
            if (err) {
              res.status(204).json(err);
            } else {
              var partidas = await User2.getPartidas(
                null,
                fields.Actividades_id_actividad
              );
              var actividades = await User2.getActividades(
                partidas[0].id_partida
              );
              mayorMetrado = await User2.getPartidasMayorMetradoAvance(
                partidas[0].id_partida
              );
              mayorMetrado = mayorMetrado || {};
              res.json({
                partida: partidas[0],
                mayor_metrado: {
                  mm_avance_metrado: mayorMetrado.avance_metrado || 0,
                  mm_avance_costo: mayorMetrado.avance_costo || 0,
                  mm_metrados_saldo: mayorMetrado.metrados_saldo || 0,
                  mm_metrados_costo_saldo:
                    mayorMetrado.metrados_costo_saldo || 0,
                  mm_porcentaje: mayorMetrado.porcentaje || 0,
                },
                actividades: actividades,
              });
            }
          });
        });
      } else {
        var avanceActividad = {
          Actividades_id_actividad: fields.Actividades_id_actividad,
          valor: fields.valor,
          imagenAlt: fields.codigo_obra,
          descripcion: fields.descripcion,
          observacion: fields.observacion,
          accesos_id_acceso: fields.accesos_id_acceso,
        };
        User.postAvanceActividad(avanceActividad, async (err, data) => {
          if (err) {
            res.status(204).json(err);
          } else {
            var partidas = await User2.getPartidas(
              null,
              fields.Actividades_id_actividad
            );
            var actividades = await User2.getActividades(
              partidas[0].id_partida
            );
            mayorMetrado = await User2.getPartidasMayorMetradoAvance(
              partidas[0].id_partida
            );
            mayorMetrado = mayorMetrado || {};
            res.json({
              partida: partidas[0],
              mayor_metrado: {
                mm_avance_metrado: mayorMetrado.avance_metrado || 0,
                mm_avance_costo: mayorMetrado.avance_costo || 0,
                mm_metrados_saldo: mayorMetrado.metrados_saldo || 0,
                mm_metrados_costo_saldo: mayorMetrado.metrados_costo_saldo || 0,
                mm_porcentaje: mayorMetrado.porcentaje || 0,
              },
              actividades: actividades,
            });
          }
        });
      }
    });
  });
  app.post("/avanceActividadActualizacion", (req, res) => {
    console.log("avanceActividadActualizacion");
    //ruta de la carpeta public de imagenes
    var dir = publicFolder;
    //crear ruta si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    var form = new formidable.IncomingForm();
    //se configura la ruta de guardar
    form.uploadDir = dir;
    form.parse(req, function (err, fields, files) {
      if (fields.valor <= 0) {
        res.json("valor no permitido");
      } else {
        console.log("accesos_id_acceso :", fields.accesos_id_acceso);
        console.log("codigo_obra :", fields.codigo_obra);
        console.log(
          "Actividades_id_actividad :",
          fields.Actividades_id_actividad
        );
        console.log("valor :", fields.valor);
        console.log("foto :", fields.foto);
        console.log("observacion :", fields.observacion);
        console.log("descripcion :", fields.descripcion);
        console.log("fecha :", fields.fecha);
        if (err) {
          res.json(err);
        }
        //folder de la obra
        var obraFolder = dir + "/" + fields.codigo_obra;
        if (!fs.existsSync(obraFolder)) {
          fs.mkdirSync(obraFolder);
        } // TODO: make sure my_file and project_id exist
        var ruta =
          "/" +
          fields.accesos_id_acceso +
          "_" +
          fields.Actividades_id_actividad +
          "_" +
          datetime() +
          ".jpg";
        //files foto
        if (files.foto) {
          fs.rename(files.foto.path, obraFolder + ruta, function (err) {
            if (err) {
              res.json(err);
            }
            var avanceActividad = {
              Actividades_id_actividad: fields.Actividades_id_actividad,
              valor: fields.valor,
              imagen: "/static/" + fields.codigo_obra + ruta,
              imagenAlt: fields.codigo_obra,
              descripcion: fields.descripcion,
              observacion: fields.observacion,
              accesos_id_acceso: fields.accesos_id_acceso,
              fecha: fields.fecha,
            };
            User.postAvanceActividad(avanceActividad, async (err, data) => {
              if (err) {
                res.status(204).json(err);
              } else {
                var partidas = await User2.getPartidas(
                  null,
                  fields.Actividades_id_actividad
                );
                console.log("partidas", partidas);
                var actividades = await User2.getActividades(
                  partidas[0].id_partida
                );
                console.log("actividades", actividades);
                mayorMetrado = await User2.getPartidasMayorMetradoAvance(
                  partidas[0].id_partida
                );
                mayorMetrado = mayorMetrado || {};
                res.json({
                  partida: partidas[0],
                  mayor_metrado: {
                    mm_avance_metrado: mayorMetrado.avance_metrado || 0,
                    mm_avance_costo: mayorMetrado.avance_costo || 0,
                    mm_metrados_saldo: mayorMetrado.metrados_saldo || 0,
                    mm_metrados_costo_saldo:
                      mayorMetrado.metrados_costo_saldo || 0,
                    mm_porcentaje: mayorMetrado.porcentaje || 0,
                  },
                  actividades: actividades,
                });
              }
            });
          });
        } else {
          var avanceActividad = {
            Actividades_id_actividad: fields.Actividades_id_actividad,
            valor: fields.valor,
            imagenAlt: fields.codigo_obra,
            descripcion: fields.descripcion,
            observacion: fields.observacion,
            accesos_id_acceso: fields.accesos_id_acceso,
            fecha: fields.fecha,
          };
          User.postAvanceActividad(avanceActividad, async (err, data) => {
            if (err) {
              res.status(204).json(err);
            } else {
              var partidas = await User2.getPartidas(
                null,
                fields.Actividades_id_actividad
              );
              var actividades = await User2.getActividades(
                partidas[0].id_partida
              );
              mayorMetrado = await User2.getPartidasMayorMetradoAvance(
                partidas[0].id_partida
              );
              mayorMetrado = mayorMetrado || {};
              res.json({
                partida: partidas[0],
                mayor_metrado: {
                  mm_avance_metrado: mayorMetrado.avance_metrado || 0,
                  mm_avance_costo: mayorMetrado.avance_costo || 0,
                  mm_metrados_saldo: mayorMetrado.metrados_saldo || 0,
                  mm_metrados_costo_saldo:
                    mayorMetrado.metrados_costo_saldo || 0,
                  mm_porcentaje: mayorMetrado.porcentaje || 0,
                },
                actividades: actividades,
              });
            }
          });
        }
      }
    });
  });
  app.post("/avanceActividadImagen", (req, res) => {
    //ruta de la carpeta public de imagenes
    var dir = publicFolder;
    //crear ruta si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    var form = new formidable.IncomingForm();
    //se configura la ruta de guardar
    form.uploadDir = dir;
    form.parse(req, function (err, fields, files) {
      console.log("accesos_id_acceso :", fields.accesos_id_acceso);
      console.log("codigo_obra :", fields.codigo_obra);
      console.log(
        "Actividades_id_actividad :",
        fields.Actividades_id_actividad
      );
      console.log("foto :", fields.foto);
      console.log("observacion :", fields.descripcionObservacion);
      console.log("descripcion :", fields.descripcionObservacion);
      if (err) {
        res.json(err);
      }
      //folder de la obra
      var obraFolder = dir + "/" + fields.codigo_obra;
      if (!fs.existsSync(obraFolder)) {
        fs.mkdirSync(obraFolder);
      } // TODO: make sure my_file and project_id exist
      var ruta =
        "/" +
        fields.accesos_id_acceso +
        "_" +
        fields.Actividades_id_actividad +
        "_" +
        datetime() +
        ".jpg";
      //files foto
      if (files.foto) {
        fs.rename(files.foto.path, obraFolder + ruta, function (err) {
          if (err) {
            res.json(err);
          }
          var avanceActividad = {
            Actividades_id_actividad: fields.Actividades_id_actividad,
            imagen: "/static/" + fields.codigo_obra + ruta,
            imagenAlt: fields.codigo_obra,
            descripcion: fields.descripcionObservacion,
            accesos_id_acceso: fields.accesos_id_acceso,
          };
          User.postAvanceActividad(avanceActividad, (err, data) => {
            if (err) {
              res.status(204).json(err);
            } else {
              res.json("exito");
            }
          });
        });
      } else {
        res.json("vacio");
      }
    });
  });
  app.post("/avancePartidaImagen", (req, res) => {
    //ruta de la carpeta public de imagenes
    var dir = publicFolder;
    //crear ruta si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    var form = new formidable.IncomingForm();
    //se configura la ruta de guardar
    form.uploadDir = dir;
    form.parse(req, function (err, fields, files) {
      console.log("accesos_id_acceso :", fields.accesos_id_acceso);
      console.log("codigo_obra :", fields.codigo_obra);
      console.log("Partidas_id_partida :", fields.Partidas_id_partida);
      console.log("descripcionObservacion :", fields.descripcionObservacion);
      console.log("foto :", fields.foto);
      if (err) {
        res.json(err);
      }
      //folder de la obra
      var obraFolder = dir + "/" + fields.codigo_obra;
      if (!fs.existsSync(obraFolder)) {
        fs.mkdirSync(obraFolder);
      } // TODO: make sure my_file and project_id exist
      var ruta =
        "/" +
        fields.accesos_id_acceso +
        "_" +
        "P" +
        fields.Partidas_id_partida +
        "_" +
        datetime() +
        ".jpg";
      //files foto
      if (files.foto) {
        fs.rename(files.foto.path, obraFolder + ruta, function (err) {
          if (err) {
            res.json(err);
          }
          var avancePartida = {
            Partidas_id_partida: fields.Partidas_id_partida,
            imagen: "/static/" + fields.codigo_obra + ruta,
            imagenAlt: fields.codigo_obra,
            descripcionObservacion: fields.descripcionObservacion,
            accesos_id_acceso: fields.accesos_id_acceso,
          };
          User.postavancePartidaImagen(avancePartida, (err, data) => {
            if (err) {
              res.status(204).json(err);
            } else {
              res.json("exito");
            }
          });
        });
      } else {
        res.json("vacio");
      }
    });
  });
  app.post("/postrecursosEjecucionreal", async (req, res) => {
    try {
      var data = "";
      if (req.body.tipo == "cantidad") {
        data = await User.postrecursosEjecucionrealCantidad(req.body.data);
      } else if (req.body.tipo == "precio") {
        data = await User.postrecursosEjecucionrealPrecio(req.body.data);
      } else if (req.body.tipo == "codigo") {
        data = await User.postrecursosEjecucionrealCodigo(req.body.data);
      } else if (req.body.tipo == "unidad") {
        data = await User.postrecursosEjecucionrealUnidad(req.body.data);
      } else if (req.body.tipo == "descripcion") {
        data = await User.postrecursosEjecucionrealdescripcionModificada(
          req.body.data
        );
      }
      console.log("test", req.body.data);
      recursosEjecucionreal = await User.getrecursosEjecucionreal(
        req.body.data[0][0],
        req.body.data[0][2]
      );
      res.json(recursosEjecucionreal);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  app.post("/postdocumentoAdquisicion", async (req, res) => {
    try {
      var recursos_ejecucionreal = req.body.recursos_ejecucionreal;
      var recursos_nuevos = req.body.recursos_nuevos;
      delete req.body.recursos_ejecucionreal;
      delete req.body.recursos_nuevos;
      var insertId = await User.postdocumentoAdquisicion(req.body);
      for (let i = 0; i < recursos_ejecucionreal.length; i++) {
        const recurso = recursos_ejecucionreal[i];
        recurso.push(insertId);
      }
      for (let i = 0; i < recursos_nuevos.length; i++) {
        const recurso = recursos_nuevos[i];
        recurso.push(insertId);
      }
      var data = await User.putrecursosEjecucionrealIdDocumentoAdquisicion(
        recursos_ejecucionreal
      );
      var data2 = await User.putrecursosNuevosDocumentoAdquisicion(
        recursos_nuevos
      );
      res.json("exito");
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  });
  app.post("/postRecursosNuevos", async (req, res) => {
    try {
      var data = await User.postRecursosNuevos(req.body);
      res.json({
        id_recursoNuevo: data.insertId,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  });

  app.post("/agregarCostoIndirecto", async (req, res) => {
    try {
      var data = await User.agregarCostoIndirecto(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  });

  app.post("/getCostosIndirectos", async (req, res) => {
    try {
      var data = await User.getCostosIndirectos(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  });

  app.post("/eliminarCostosIndirectos", async (req, res) => {
    try {
      var data = await User.eliminarCostosIndirectos(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  });
  //recursos edicion
  app.post("/updateRecursoAvance", async (req, res) => {
    try {
      var data = await User.updateRecursoAvance(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(400).json(error.code);
    }
  });
  app.post("/updateRecursoPrecio", async (req, res) => {
    try {
      var data = await User.updateRecursoPrecio(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(400).json(error.code);
    }
  });
  app.post("/updateRecursoDocumentoAdquisicion", async (req, res) => {
    try {
      var data = await User.updateRecursoDocumentoAdquisicion(req.body);
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(400).json(error.code);
    }
  });
};
