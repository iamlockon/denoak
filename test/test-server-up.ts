import { superdeno, assert, fail, assertEquals } from "../dep.ts";
import { app, controller } from "../main.ts";

Deno.test({
  name: "Basic request handling and health check",
  fn: async () => {
    await superdeno(app.handle.bind(app))
      .get("/")
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("Hello, this is a simple Deno REST API Service")
      .expect(200);
    await superdeno(app.handle.bind(app))
      .get("/example")
      .expect("Content-Type", "text/plain; charset=utf-8")
      .expect("This is Example route.")
      .expect(200);
    await superdeno(app.handle.bind(app))
      .get("/health")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect({
        healthy: true,
      })
      .expect(200);
    await superdeno(app.handle.bind(app))
      .post('/example')
      .send({
        description: 'hahaha'
      })
      .expect(200);
  },
  sanitizeResources: false
});


