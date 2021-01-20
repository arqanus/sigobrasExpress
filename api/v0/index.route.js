module.exports = (app) => {
  require("./Reusable/r.avances")(app);
  require("./Reusable/r.datosGenerales")(app);

  //apis notificacioanes
  require("./Notificaciones/r.notificaciones")(app);

  //interf gerencial
  require("./InterfazGerencial/get/routes/r.get.InterfazGerencial")(app);
  //routes Admin
  require("./Admin/get/routes/r.get.obras")(app);
  require("./Admin/get/routes/r.get.users")(app);
  require("./Admin/post/routes/r.post.obras")(app);
  require("./Admin/post/routes/r.post.users")(app);
  require("./Admin/put/routes/r.put.users")(app);
  require("./Admin/delete/routes/r.delete.obras")(app);
  require("./Admin/routes/r.obra")(app);
  // COSTOS INDIRECTOS

  require("./CostosIndirectos/r.CostosIndirectos")(app);

  //AMPLIACION PRESUPUESTAL
  require("./Reportes/r.ampliacionPresupuesto")(app);

  require("./Interfaz/post/routes/r.post.interfaz")(app);
  require("./Interfaz/get/routes/r.get.interfaz")(app);
  require("./Interfaz/put/routes/r.put.interfaz")(app);

  require("./Inicio/get/routes/r.get.Inicio")(app);
  require("./Inicio/post/routes/r.post.Inicio")(app);
  require("./Inicio/delete/routes/r.del.Inicio")(app);
  require("./Inicio/r.fichasLabels")(app);

  require("./ProcesosFisicos/get/routes/r.get.historial")(app);
  require("./ProcesosFisicos/get/routes/r.get.historialImagenes")(app);
  require("./ProcesosFisicos/get/routes/r.get.materiales")(app);
  require("./ProcesosFisicos/get/routes/r.get.pFisicos")(app);
  require("./ProcesosFisicos/get/routes/r.get.valGeneral")(app);
  require("./ProcesosFisicos/get/routes/r.get.gantt")(app);
  require("./ProcesosFisicos/get/routes/r.get.dificultades")(app);
  require("./ProcesosFisicos/Valorizaciones/routes/r.valorizacionPrincipal")(
    app
  );

  require("./ProcesosFisicos/post/routes/r.post.pFisicos")(app);
  require("./ProcesosFisicos/put/routes/r.put.pFisicos")(app);

  require("./ProcesosFinancieros/post/routes/r.post.Pfinancieros")(app);
  require("./ProcesosFinancieros/get/routes/r.get.Pfinancieros")(app);

  require("./Reportes/get/routes/r.get.reportes")(app);
  require("./Reportes/post/routes/r.post.reportes")(app);

  require("./GestionTareas/get/routes/r.get.GT")(app);
  require("./GestionTareas/post/routes/r.post.GT")(app);
  require("./GestionTareas/put/routes/r.put.GT")(app);

  ////////////////////////////////////////////////////////////////////////////
  require("./Planner/get/routes/r.get.Proyeccion")(app);

  //procesos gerenciales

  require("./ProcesosGerenciales/get/routes/r.get.comunicados")(app);
  require("./ProcesosGerenciales/get/routes/r.get.recursospersonal")(app);
  require("./ProcesosGerenciales/get/routes/r.get.infobras")(app);
  require("./ProcesosGerenciales/get/routes/r.get.plazos")(app);
  require("./ProcesosGerenciales/get/routes/r.get.curvaS")(app);
  require("./ProcesosGerenciales/PlazosHistorial/r.plazos")(app);
  //gestion documentaria
  require("./GestionDocumentaria/routes/r.gestionDocumentaria")(app);
  //defecto
  require("./Proyectos/r.proyectos")(app);
  require("./Inicio/r.carouselObras")(app);

  require("./InterfazPublica/InterfazPublica.routes")(app);
};
