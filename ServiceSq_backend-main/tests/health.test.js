const request = require("supertest");
const app = require("../app");

describe("Health", () => {
  it("returns API health", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("uptime");
  });
});
