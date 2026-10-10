import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Route not found." });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed.",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: "Validation failed.",
      errors: Object.values(error.errors).map((value) => ({
        path: value.path,
        message: value.message,
      })),
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `Invalid value for ${error.path}.` });
    return;
  }

  if (isDuplicateKeyError(error)) {
    res.status(409).json({ message: "That email is already in use." });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ message: "Internal server error." });
};

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}
