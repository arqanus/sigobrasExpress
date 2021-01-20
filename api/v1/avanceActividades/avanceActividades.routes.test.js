let request = require("supertest");

let app = require("../../../index").app;
let server = require("../../../index").server;

describe("sectores", () => {
  afterAll(() => {
    server.close();
  });

  describe("GET /public", () => {
    test("Se obtiene todas los sectores de acceso publico", (done) => {
      request(app)
        .get("/v1/sectores/public?id_unidadEjecutora=12")
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Array);
          done();
        });
    });
    test("Si no se presenta id_unidadEjecutora en el query deberia mostrar todos", (done) => {
      request(app)
        .get("/v1/sectores/public")
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Array);
          done();
        });
    });
    test("Si no se usa un correcto id_unidadEjecutora muestra bad request", (done) => {
      request(app)
        .get("/v1/sectores/public?id_unidadEjecutora='test'")
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.text).toEqual("estructura incorrecta");
          done();
        });
    });
    test("Si  id_unidadEjecutora es igual a 0 debe devolver un array de todos los sectores", (done) => {
      request(app)
        .get("/v1/sectores/public?id_unidadEjecutora=0")
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(0);
          done();
        });
    });
  });
});
