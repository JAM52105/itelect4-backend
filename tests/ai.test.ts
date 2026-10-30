import { afterAll, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import request from "supertest";

vi.mock("../src/config/db.js", () => ({
  connectDB: async () => {},
}));

import app from "../src/app.js";

const originalJwtSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET ??= "gt6-test-jwt-secret";

afterAll(() => {
  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalJwtSecret;
  }
});

describe("POST /api/ai authentication", () => {
  it("returns 401 when no bearer token is supplied", async () => {
    const response = await request(app)
      .post("/api/ai")
      .send({ prompt: "A campus item reporting idea with enough detail." });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required.");
  });

  it("accepts a valid token before rejecting an invalid prompt", async () => {
    const token = jwt.sign({ sub: "gt6-test-student" }, process.env.JWT_SECRET!);

    const response = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${token}`)
      .send({ prompt: "short" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Invalid AI review request. Please enter a prompt between 20 and 2000 characters.",
    );
  });
});
