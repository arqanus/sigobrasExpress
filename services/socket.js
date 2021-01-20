const socket = require("socket.io");
module.exports = (server) => {
  const io = socket(server);
  let online = 0;

  io.on("connection", (socket) => {
    online++;
    console.log(`Socket ${socket.id} connected.`);
    console.log(`Online: ${online}`);
    io.emit("visitors", online);
    socket.on("tareas_comentarios", (data) => {
      console.log(data);
      console.log("id_tarea", data.id_tarea);
      socket.broadcast.emit(data.id_tarea, data.data);
      // io.emit(data.id_tarea, data.data)
    });
    socket.on("disconnect", () => {
      online--;
      console.log(`Socket ${socket.id} disconnected.`);
      console.log(`Online: ${online}`);
      io.emit("visitor exits", online);
    });
    socket.on("partidas_comentarios_post", (data) => {
      console.log("data", data);
      socket.broadcast.emit(
        "partidas_comentarios_get-" + data.id_partida,
        data.id_partida
      );
      socket.broadcast.emit(
        "partidas_comentarios_novistos_get-" + data.id_partida,
        data.id_partida
      );
    });
    socket.on("partidas_comentarios_notificacion_post", (data) => {
      console.log("data", data);
      socket.broadcast.emit(
        "partidas_comentarios_notificacion_get-" + data.id_componente,
        data.id_componente
      );
    });
    socket.on("componentes_comentarios_notificacion_post", (data) => {
      console.log("data", data);
      socket.broadcast.emit(
        "componentes_comentarios_notificacion_get-" + data.id_ficha,
        data.id_ficha
      );
    });
    socket.on("dificultades_comentarios_post", (data) => {
      console.log("data", data);
      socket.broadcast.emit(
        "dificultades_comentarios_get-" + data.id_dificultad,
        data.id_dificultad
      );
    });
    socket.on("gestion_documentaria_principal", (data) => {
      console.log("data", data);
      socket.broadcast.emit("gestion_documentaria_" + data.id_ficha);
    });
    socket.on("gestion_documentaria_mensaje_principal", (data) => {
      console.log("data", data);
      socket.broadcast.emit("gestion_documentaria_mensaje" + data.id_mensaje);
    });
  });
};
