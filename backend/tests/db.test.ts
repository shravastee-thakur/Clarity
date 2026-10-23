import { describe, it, expect } from "vitest";
import mongoose from "mongoose";

describe("Database Setup", () => {
  it("connects to the memory server", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
