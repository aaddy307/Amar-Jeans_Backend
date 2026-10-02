import mongoose from "mongoose";
import { ENV } from "./_core/env.js";
import { seedInitialData } from "./seed.js";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(ENV.mongodbUrl, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected to ${ENV.mongodbUrl}`);
    await seedInitialData();
  } catch (error) {
    console.warn(`[MongoDB] Local connection to ${ENV.mongodbUrl} failed (${error.message}). Attempting in-memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      isConnected = true;
      console.log(`[MongoDB] Connected to In-Memory MongoDB Server at ${mongoUri}`);
      await seedInitialData();
    } catch (memErr) {
      console.error("[MongoDB] In-memory database fallback failed:", memErr.message);
      console.warn("[MongoDB] Please install or start MongoDB service.");
    }
  }
}

export { mongoose };


