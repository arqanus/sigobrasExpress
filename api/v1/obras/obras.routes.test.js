let request = require("supertest");

let app = require("../../../index").app;
let server = require("../../../index").server;

describe("obras", () => {
  afterAll(() => {
    server.close();
  });

  describe("GET /public", () => {
    test("Se muestran las obras de acceso publico", (done) => {
      request(app)
        .get("/v1/obras/public")
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Array);
          done();
        });
    });
    test("Si no se usa un correcto id_unidadEjecutora o idsectores muestra bad request", (done) => {
      request(app)
        .get("/v1/sectores/public?id_unidadEjecutora='sdfsdf'&idsectores=123")
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.text).toEqual("estructura incorrecta");
          done();
        });
    });
  });
});
