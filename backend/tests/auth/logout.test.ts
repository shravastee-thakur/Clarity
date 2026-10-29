import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/userModel.js";
import { generateAccessToken } from "../../src/utils/jwt.js";

describe("Auth Flow: Logout", () => {
  it("clears the refresh token in database and cookie", async () => {
    const user = await User.create({
      name: "Logout User",
      email: "logout@example.com",
      password: "password123",
      refreshToken: "some-hashed-active-session",
      isVerified: true,
      authProvider: "local",
    });

    const accessToken = generateAccessToken({ id: user._id.toString() });

    const res = await request(app)
      .delete("/api/v1/users/sessions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const cookies = res.headers["set-cookie"];
    if (cookies) {
      const cookieList = Array.isArray(cookies) ? cookies : [cookies];
      const hasClearedCookie = cookieList.some((c) =>
        c.includes("refreshToken="),
      );
      expect(hasClearedCookie).toBe(true);
    }

    const dbUser = await User.findById(user._id);
    expect(dbUser?.refreshToken).toBe("");
  });

  it("rejects logout attempts without a valid token", async () => {
    const res = await request(app).delete("/api/v1/users/sessions");

    expect(res.status).toBe(401);
  });
});
