import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import User from "../../src/models/userModel.js";
import app from "../../src/app.js";

vi.mock("../../src/middlewares/securityMiddleware.js", () => ({
  securityMiddleware: (req: any, res: any, next: any) => next(),
}));

vi.mock("../../src/middlewares/rateLimiter.js", () => ({
  rateLimiterMiddleware: () => (req: any, res: any, next: any) => next(),
}));

describe("POST /api/v1/users (Register)", () => {
  it("creates a new user and returns 201", async () => {
    const res = await request(app).post("/api/v1/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("test@example.com");
    expect(res.body.data.password).toBeUndefined();

    const dbUser = await User.findOne({ email: "test@example.com" });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.name).toBe("Test User");
  });

  it("returns 409 if the email is already registered", async () => {
    await User.create({
      name: "Existing User",
      email: "existing@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/v1/users").send({
      name: "New User",
      email: "existing@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toContain("already exists");
  });

  it("returns 400 for invalid input via Zod validation", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({ name: "No", email: "not-an-email", password: "123" });

    expect(res.statusCode).toBe(400);
  });
});
