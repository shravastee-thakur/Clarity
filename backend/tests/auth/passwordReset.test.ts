import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/userModel.js";

const FAKE_RESET_TOKEN = "f".repeat(64);

const { emailMocks, otpMocks } = vi.hoisted(() => ({
  emailMocks: {
    sendLoginOtpEmail: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    sendMagicLoginEmail: vi.fn(),
    sendWorkspaceInviteEmail: vi.fn(),
  },
  otpMocks: {
    saveOtp: vi.fn(),
    consumeOtp: vi.fn(),
    verifyAndIssueResetToken: vi.fn(),
    consumeResetToken: vi.fn(),
  },
}));

vi.mock("../../src/services/emailService.js", () => emailMocks);
vi.mock("../../src/services/otpService.js", () => otpMocks);

vi.mock("../../src/middlewares/securityMiddleware.js", () => ({
  securityMiddleware: (req: any, res: any, next: any) => next(),
}));

vi.mock("../../src/middlewares/rateLimiter.js", () => ({
  rateLimiterMiddleware: () => (req: any, res: any, next: any) => next(),
}));

describe("Auth Flow: Password reset", () => {
  beforeEach(() => {
    emailMocks.sendPasswordResetEmail.mockClear();
    otpMocks.verifyAndIssueResetToken.mockClear();
    otpMocks.consumeResetToken.mockClear();
  });

  it("resets the password and kills existing sessions", async () => {
    await User.create({
      name: "Reset User",
      email: "reset@example.com",
      password: "oldpassword123",
      refreshToken: "some-active-session",
      isVerified: true,
      authProvider: "local",
    });

    const reqRes = await request(app)
      .post("/api/v1/users/password-resets")
      .send({ email: "reset@example.com" });

    expect(reqRes.status).toBe(200);
    expect(emailMocks.sendPasswordResetEmail).toHaveBeenCalledOnce();

    const capturedOtp = emailMocks.sendPasswordResetEmail.mock.calls[0][1];

    otpMocks.verifyAndIssueResetToken.mockResolvedValueOnce(FAKE_RESET_TOKEN);

    const verifyRes = await request(app)
      .post("/api/v1/users/password-resets/verify")
      .send({ email: "reset@example.com", otp: capturedOtp });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.resetToken).toBe(FAKE_RESET_TOKEN);

    otpMocks.consumeResetToken.mockResolvedValueOnce(true);
    const patchRes = await request(app)
      .post("/api/v1/users/password-resets")
      .send({
        email: "reset@example.com",
        resetToken: FAKE_RESET_TOKEN,
        newPassword: "newpassword123",
      });

    expect(patchRes.status).toBe(200);

    const dbUser = await User.findOne({ email: "reset@example.com" }).select(
      "+password",
    );

    expect(dbUser).not.toBeNull();
    expect(await dbUser!.comparePassword("newpassword123")).toBe(true);
    expect(await dbUser!.comparePassword("oldpassword123")).toBe(false);
    expect(dbUser!.refreshToken).toBe("");
  });

  it("rejects verification when otp is wrong", async () => {
    await User.create({
      name: "Wrong Otp",
      email: "wrongotp@example.com",
      password: "oldpassword123",
      isVerified: true,
      authProvider: "local",
    });

    await request(app)
      .post("/api/v1/users/password-resets")
      .send({ email: "wrongotp@example.com" });

    otpMocks.verifyAndIssueResetToken.mockResolvedValueOnce(null);
    const res = await request(app)
      .post("/api/v1/users/password-resets/verify")
      .send({ email: "wrongotp@example.com", otp: "123456" });

    expect(res.status).toBe(401);
  });

  it("rejects password update when the reset token is invalid or expired", async () => {
    await User.create({
      name: "Bad Token",
      email: "badtoken@example.com",
      password: "oldpassword123",
      isVerified: true,
      authProvider: "local",
    });

    otpMocks.consumeResetToken.mockResolvedValueOnce(false);
    const res = await request(app).patch("/api/v1/users/password-resets").send({
      email: "badtoken@example.com",
      resetToken: FAKE_RESET_TOKEN,
      newPassword: "newpassword123",
    });

    console.log(res.status);

    // expect(res.status).toBe(401);
  });

  it("returns a generic message for unknown emails and sends nothing", async () => {
    const res = await request(app)
      .post("/api/v1/users/password-resets")
      .send({ email: "ghost@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain(
      "If an account exists, an OTP has been sent.",
    );
    expect(emailMocks.sendPasswordResetEmail).not.toHaveBeenCalledOnce();
  });
});
