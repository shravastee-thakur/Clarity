import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/userModel.js";

// Only the email service is faked here. The magic flow never touches Redis.
const { emailMocks } = vi.hoisted(() => ({
  emailMocks: {
    sendLoginOtpEmail: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    sendMagicLoginEmail: vi.fn(),
    sendWorkspaceInviteEmail: vi.fn(),
  },
}));

vi.mock("../../src/services/emailService.js", () => emailMocks);

vi.mock("../../src/middlewares/securityMiddleware.js", () => ({
  securityMiddleware: (req: any, res: any, next: any) => next(),
}));

vi.mock("../../src/middlewares/rateLimiter.js", () => ({
  rateLimiterMiddleware: () => (req: any, res: any, next: any) => next(),
}));

describe("Auth FLow: Magic link login", () => {
  beforeEach(() => {
    emailMocks.sendMagicLoginEmail.mockClear();
  });

  it("sends a magic link, verifies it, and marks the user verified", async () => {
    await User.create({
      name: "Magic User",
      email: "magic@example.com",
      password: "password123",
      isVerified: false,
      authProvider: "local",
    });

    const reqRes = await request(app)
      .post("/api/v1/users/magic-login")
      .send({ email: "magic@example.com" });

    expect(reqRes.status).toBe(200);
    expect(emailMocks.sendMagicLoginEmail).toHaveBeenCalledOnce();

    // read the token out of the fake email call
    const capturedToken = emailMocks.sendMagicLoginEmail.mock.calls[0][1];

    const verifyRes = await request(app)
      .post("/api/v1/users/magic-login/verify")
      .send({ token: capturedToken });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.user.email).toBe("magic@example.com");

    // prove the side effect landed in the database
    const dbUser = await User.findOne({ email: "magic@example.com" });
    expect(dbUser?.isVerified).toBe(true);
  });

  it("returns a generic success for unknown emails and send nothing", async () => {
    const res = await request(app).post("/api/v1/users/magic-login").send({
      email: "ghost@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain(
      "If an account exists, a login link has been sent.",
    );
    expect(emailMocks.sendMagicLoginEmail).not.toHaveBeenCalled();
  });

  it("rejects a tampered or invalid magic token with 401", async () => {
    await User.create({
      name: "Tamper User",
      email: "tamper@example.com",
      password: "password123",
      isVerified: true,
      authProvider: "local",
    });

    await request(app)
      .post("/api/v1/users/magic-login")
      .send({ email: "tamper@example.com" });

    const res = await request(app)
      .post("/api/v1/users/magic-login/verify")
      .send({ token: "not-a-real-token" });

    expect(res.status).toBe(401);
  });
});
