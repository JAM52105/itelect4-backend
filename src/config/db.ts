import mongoose from "mongoose";

export let connection: Promise<void> | null = null;

export function connectDB(): Promise<void> {
  if (connection) {
    return connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI is not configured."));
  }

  connection = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5_000,
    })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error: unknown) => {
      connection = null;
      throw error;
    });

  return connection;
}
