const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../src/app");

test("GET /api/health returns ok response", async () => {
  const response = await request(app).get("/api/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("Unknown route returns 404", async () => {
  const response = await request(app).get("/api/missing-route");
  assert.equal(response.status, 404);
});
