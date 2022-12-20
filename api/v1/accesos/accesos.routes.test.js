let request = require("supertest");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

let Accesos = require("./accesos.model");
let app = require("../../../index").app;
let server = require("../../../index").server;
let config = require("../../../config");

let dummyaccesos = [
  {
    username: "daniel",
    email: "daniel@gmail.com",
    password: "holaquetal",
  },
  {
    username: "ricardo",
    email: "ricardo@gmail.com",
    password: "quepaso",
  },
  {
    username: "diego",
    email: "diego@gmail.com",
    password: "nomedigas",
  },
];

function usuarioExisteYAtributosSonCorrectos(usuario, done) {
  Accesos.find({ username: usuario.username })
    .then((accesos) => {
      expect(accesos).toBeInstanceOf(Array);
      expect(accesos).toHaveLength(1);
      expect(accesos[0].username).toEqual(usuario.username);
      expect(accesos[0].email).toEqual(usuario.email);

      let iguales = bcrypt.compareSync(usuario.password, accesos[0].password);
      expect(iguales).toBeTruthy();
      done();
    })
    .catch((err) => {
      done(err);
    });
}

async function usuarioNoExiste(usuario, done) {
  try {
    let accesos = await Usuario.find().or([
      { username: usuario.username },
      { email: usuario.email },
    ]);
    expect(accesos).toHaveLength(0);
    done();
  } catch (err) {
    done(err);
  }
}

describe("accesos", () => {
  afterAll(() => {
    server.close();
  });

  describe("GET /accesos", () => {
    test("Si existen accesos, debería retornarlos en un array", (done) => {
      request(app)
        .get("/v1/accesos")
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Array);
          done();
        });
    });
  });

  // describe("POST /accesos", () => {
  //   test("Un usuario que cumple las condiciones debería ser creado", (done) => {
  //     request(app)
  //       .post("/accesos")
  //       .send(dummyaccesos[0])
  //       .end((err, res) => {
  //         expect(res.status).toBe(201);
  //         expect(typeof res.text).toBe("string");
  //         expect(res.text).toEqual("Usuario creado exitósamente.");
  //         usuarioExisteYAtributosSonCorrectos(dummyaccesos[0], done);
  //       });
  //   });

  //   test("Crear un usuario con un username ya registrado debería fallar", (done) => {
  //     Promise.all(
  //       dummyaccesos.map((usuario) => new Usuario(usuario).save())
  //     ).then((accesos) => {
  //       request(app)
  //         .post("/accesos")
  //         .send({
  //           username: "daniel",
  //           email: "danielnuevoemail@gmail.com",
  //           password: "cuidadoarriba",
  //         })
  //         .end((err, res) => {
  //           expect(res.status).toBe(409);
  //           expect(typeof res.text).toBe("string");
  //           done();
  //         });
  //     });
  //   });

  //   test("Crear un usuario con un email ya registrado debería fallar", (done) => {
  //     Promise.all(
  //       dummyaccesos.map((usuario) => new Usuario(usuario).save())
  //     ).then((accesos) => {
  //       request(app)
  //         .post("/accesos")
  //         .send({
  //           username: "nuevodaniel",
  //           email: "daniel@gmail.com",
  //           password: "cuidadoarriba",
  //         })
  //         .end((err, res) => {
  //           expect(res.status).toBe(409);
  //           expect(typeof res.text).toBe("string");
  //           done();
  //         });
  //     });
  //   });

  //   test("Un usuario sin username no debería ser creado", (done) => {
  //     request(app)
  //       .post("/accesos")
  //       .send({
  //         email: "daniel@gmail.com",
  //         password: "contraseña",
  //       })
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         done();
  //       });
  //   });

  //   test("Un usuario sin contraseña no debería ser creado", (done) => {
  //     request(app)
  //       .post("/accesos")
  //       .send({
  //         username: "daniel",
  //         email: "daniel@gmail.com",
  //       })
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         done();
  //       });
  //   });

  //   test("Un usuario sin email no debería ser creado", (done) => {
  //     request(app)
  //       .post("/accesos")
  //       .send({
  //         username: "daniel",
  //         password: "contraseña",
  //       })
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         done();
  //       });
  //   });

  //   test("Un usuario con un email inválido no debería ser creado", (done) => {
  //     let usuario = {
  //       username: "daniel",
  //       email: "@gmail.com",
  //       password: "contraseña",
  //     };
  //     request(app)
  //       .post("/accesos")
  //       .send(usuario)
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         usuarioNoExiste(usuario, done);
  //       });
  //   });

  //   test("Un usuario con un username con menos de 3 caracteres no debería ser creado", (done) => {
  //     let usuario = {
  //       username: "da",
  //       email: "daniel@gmail.com",
  //       password: "contraseña",
  //     };
  //     request(app)
  //       .post("/accesos")
  //       .send(usuario)
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         usuarioNoExiste(usuario, done);
  //       });
  //   });

  //   test("Un usuario con un username con más de 30 caracteres no debería ser creado", (done) => {
  //     let usuario = {
  //       username: "daniel".repeat(10),
  //       email: "daniel@gmail.com",
  //       password: "contraseña",
  //     };
  //     request(app)
  //       .post("/accesos")
  //       .send(usuario)
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         usuarioNoExiste(usuario, done);
  //       });
  //   });

  //   test("Un usuario cuya contraseña tenga menos de 6 caracteres no debería ser creado", (done) => {
  //     let usuario = {
  //       username: "daniel",
  //       email: "daniel@gmail.com",
  //       password: "abc",
  //     };
  //     request(app)
  //       .post("/accesos")
  //       .send(usuario)
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         usuarioNoExiste(usuario, done);
  //       });
  //   });

  //   test("Un usuario cuya contraseña tenga más de 200 caracteres no debería ser creado", (done) => {
  //     let usuario = {
  //       username: "daniel",
  //       email: "daniel@gmail.com",
  //       password: "contraseña".repeat(40),
  //     };
  //     request(app)
  //       .post("/accesos")
  //       .send(usuario)
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         usuarioNoExiste(usuario, done);
  //       });
  //   });

  //   test("El username y email de un usuario válido deben ser guardados en lowercase", (done) => {
  //     let usuario = {
  //       username: "DaNIEL",
  //       email: "APPdelante@GMAIL.com",
  //       password: "pruebapruebaprueba",
  //     };
  //     request(app)
  //       .post("/accesos")
  //       .send(usuario)
  //       .end((err, res) => {
  //         expect(res.status).toBe(201);
  //         expect(typeof res.text).toBe("string");
  //         expect(res.text).toEqual("Usuario creado exitósamente.");
  //         usuarioExisteYAtributosSonCorrectos(
  //           {
  //             username: usuario.username.toLowerCase(),
  //             email: usuario.email.toLowerCase(),
  //             password: usuario.password,
  //           },
  //           done
  //         );
  //       });
  //   });
  // });

  // describe("POST /login", () => {
  //   test("Login debería fallar para un request que no tiene username", (done) => {
  //     let bodyLogin = {
  //       password: "holaholahola",
  //     };
  //     request(app)
  //       .post("/accesos/login")
  //       .send(bodyLogin)
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         done();
  //       });
  //   });

  //   test("Login debería fallar para un request que no tiene password", (done) => {
  //     let bodyLogin = {
  //       username: "noexisto",
  //     };
  //     request(app)
  //       .post("/accesos/login")
  //       .send(bodyLogin)
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         done();
  //       });
  //   });

  //   test("Login debería fallar para un usuario que no esta registrado", (done) => {
  //     let bodyLogin = {
  //       username: "noexisto",
  //       password: "holaholahola",
  //     };
  //     request(app)
  //       .post("/accesos/login")
  //       .send(bodyLogin)
  //       .end((err, res) => {
  //         expect(res.status).toBe(400);
  //         expect(typeof res.text).toBe("string");
  //         done();
  //       });
  //   });

  //   test("Login debería fallar para un usuario registrado que suministra una contraseña incorrecta", (done) => {
  //     let usuario = {
  //       username: "daniel",
  //       email: "daniel@gmail.com",
  //       password: "perrosamarillos",
  //     };

  //     new Usuario({
  //       username: usuario.username,
  //       email: usuario.email,
  //       password: bcrypt.hashSync(usuario.password, 10),
  //     })
  //       .save()
  //       .then((nuevoUsuario) => {
  //         request(app)
  //           .post("/accesos/login")
  //           .send({
  //             username: usuario.username,
  //             password: "arrozverde",
  //           })
  //           .end((err, res) => {
  //             expect(res.status).toBe(400);
  //             expect(typeof res.text).toBe("string");
  //             done();
  //           });
  //       })
  //       .catch((err) => {
  //         done(err);
  //       });
  //   });

  //   test("Usuario registrado debería obtener un JWT token al hacer login con credenciales correctas", (done) => {
  //     let usuario = {
  //       username: "daniel",
  //       email: "daniel@gmail.com",
  //       password: "perrosamarillos",
  //     };

  //     new Usuario({
  //       username: usuario.username,
  //       email: usuario.email,
  //       password: bcrypt.hashSync(usuario.password, 10),
  //     })
  //       .save()
  //       .then((nuevoUsuario) => {
  //         request(app)
  //           .post("/accesos/login")
  //           .send({
  //             username: usuario.username,
  //             password: usuario.password,
  //           })
  //           .end((err, res) => {
  //             expect(res.status).toBe(200);
  //             expect(res.body.token).toEqual(
  //               jwt.sign({ id: nuevoUsuario._id }, config.jwt.secreto, {
  //                 expiresIn: config.jwt.tiempoDeExpiración,
  //               })
  //             );
  //             done();
  //           });
  //       })
  //       .catch((err) => {
  //         done(err);
  //       });
  //   });

  //   test("Al hacer login no debe importar la capitalización del username", (done) => {
  //     let usuario = {
  //       username: "daniel",
  //       email: "daniel@gmail.com",
  //       password: "perrosamarillos",
  //     };

  //     new Usuario({
  //       username: usuario.username,
  //       email: usuario.email,
  //       password: bcrypt.hashSync(usuario.password, 10),
  //     })
  //       .save()
  //       .then((nuevoUsuario) => {
  //         request(app)
  //           .post("/accesos/login")
  //           .send({
  //             username: "DaNIEL",
  //             password: usuario.password,
  //           })
  //           .end((err, res) => {
  //             expect(res.status).toBe(200);
  //             expect(res.body.token).toEqual(
  //               jwt.sign({ id: nuevoUsuario._id }, config.jwt.secreto, {
  //                 expiresIn: config.jwt.tiempoDeExpiración,
  //               })
  //             );
  //             done();
  //           });
  //       })
  //       .catch((err) => {
  //         done(err);
  //       });
  //   });
  // });
});
