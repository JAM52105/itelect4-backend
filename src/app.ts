import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.js";
import claimRouter from "./routes/claims.js";
import courseRouter from "./routes/courses.js";
import itemRouter from "./routes/items.js";
import submissionRouter from "./routes/submissions.js";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";
import { connectDB } from "./config/db.js";
import aiRouter from "./routes/ai.js";

const app = express();

const corsOrigins = process.env.CORS_ORIGIN
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors(corsOrigins?.length ? { origin: corsOrigins } : undefined));
app.use(express.json());

app.use((req, res, next) => {
  void connectDB().then(
    () => next(),
    (error: unknown) => next(error),
  );
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/submissions", submissionRouter);
app.use("/api/claims", claimRouter);
app.use("/api/items", itemRouter);
app.use("/api/ai", aiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
