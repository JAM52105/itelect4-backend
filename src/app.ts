import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.js";
import itemRouter from "./routes/items.js";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
