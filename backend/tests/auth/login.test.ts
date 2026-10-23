import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/userModel.js";

// 1. Hoisted state: Safely share memory between tests and mocks
const { otpStore, emailMocks } = vi.hoisted(() => {
  return {
    otpStore: new Map<string, { otp: string; attempts: number }>(),
    emailMocks: {
      sendLoginOtpEmail: vi.fn(),
      sendPasswordResetEmail: vi.fn(),
      sendMagicLoginEmail: vi.fn(),
      sendWorkspaceInviteEmail: vi.fn(),
    },
  };
});

// 2. Mock External Services (Seal the outside world)
vi.mock("../../src/services/emailService.js", () => emailMocks);

vi.mock("../../src/services/otpService.js", () => ({
  saveOtp: vi.fn(async (identifier: string, hashedOtp: string) => {
    otpStore.set(identifier, { otp: hashedOtp, attempts: 0 });
  }),
  consumeOtp: vi.fn(async (identifier: string, hashedOtp: string) => {
    const record = otpStore.get(identifier);
    if (!record) return false;
    if (record.otp === hashedOtp) {
      otpStore.delete(identifier);
      return true;
    }
    record.attempts += 1;
    return false;
  }),
  verifyAndIssueResetToken: vi.fn(),
  consumeResetToken: vi.fn(),
}));

// 3. Mock Security & Rate Limiting Middlewares (Bypass Arcjet/Rate limits in CI)
vi.mock("../../src/middlewares/securityMiddleware.js", () => ({
  securityMiddleware: (req: any, res: any, next: any) => next(),
}));

vi.mock("../../src/middlewares/rateLimiter.js", () => ({
  rateLimiterMiddleware: () => (req: any, res: any, next: any) => next(),
}));

describe("Auth Flow: OTP Request & Session Creation", () => {
  beforeEach(() => {
    // Clear the in-memory OTP store before each test to prevent cross-test pollution
    otpStore.clear();
    // Clear mock call history
    emailMocks.sendLoginOtpEmail.mockClear();
  });

  it("requests an OTP and verifies it to create a session", async () => {
    // Seed a verified local user
    await User.create({
      name: "OTP User",
      email: "otp@example.com",
      password: "password123",
      isVerified: true,
      authProvider: "local",
    });

    // Step 1: Request OTP
    const reqRes = await request(app)
      .post("/api/v1/users/otp-requests")
      .send({ email: "otp@example.com", password: "password123" });

    expect(reqRes.status).toBe(200);
    expect(reqRes.body.success).toBe(true);

    // Intercept the OTP that the app tried to "email"
    expect(emailMocks.sendLoginOtpEmail).toHaveBeenCalledOnce();
    const capturedOtp = emailMocks.sendLoginOtpEmail.mock.calls[0][1];

    // Step 2: Verify OTP to create session
    const sessionRes = await request(app)
      .post("/api/v1/users/sessions")
      .send({ email: "otp@example.com", otp: capturedOtp });

    expect(sessionRes.status).toBe(200);
    expect(sessionRes.body.success).toBe(true);
    expect(sessionRes.body.user.email).toBe("otp@example.com");
  });

  it("rejects OTP request if password is incorrect", async () => {
    await User.create({
      name: "Wrong Pass",
      email: "wrongpass@example.com",
      password: "password123",
      isVerified: true,
      authProvider: "local",
    });

    const res = await request(app)
      .post("/api/v1/users/otp-requests")
      .send({ email: "wrongpass@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(emailMocks.sendLoginOtpEmail).not.toHaveBeenCalled();
  });

  it("rejects session creation with an invalid OTP", async () => {
    await User.create({
      name: "Bad OTP",
      email: "badotp@example.com",
      password: "password123",
      isVerified: true,
      authProvider: "local",
    });

    // Request valid OTP
    await request(app)
      .post("/api/v1/users/otp-requests")
      .send({ email: "badotp@example.com", password: "password123" });

    // Attempt to verify with wrong OTP
    const res = await request(app)
      .post("/api/v1/users/sessions")
      .send({ email: "badotp@example.com", otp: "000000" });

    expect(res.status).toBe(401);
  });
});
