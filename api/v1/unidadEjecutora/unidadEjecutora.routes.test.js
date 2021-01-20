let request = require("supertest");

let app = require("../../../index").app;
let server = require("../../../index").server;

describe("unidadEjecutora", () => {
  afterAll(() => {
    server.close();
  });

  describe("GET /public", () => {
    test("Se muestran las unidades ejecutoras de acceso publico", (done) => {
      request(app)
        .get("/v1/unidadEjecutora/public")
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body).toBeInstanceOf(Array);
          done();
        });
    });
  });
});
