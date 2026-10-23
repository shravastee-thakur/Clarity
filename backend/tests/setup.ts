process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.HMAC_SECRET = "test-hmac-secret";
process.env.ACCESS_SECRET = "test-access-secret";
process.env.REFRESH_SECRET = "test-refresh-secret";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll, beforeEach } from "vitest";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
