import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { aiRequestSchema, GeminiQuotaError, InvalidAiReplyError, reviewProject } from "../ai.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

export function createAiRouter(generateReview = reviewProject): Router {
  const aiRouter = Router();
  const aiRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    keyGenerator: (req) => `user:${req.userId ?? "unknown"}`,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({ message: "AI review limit reached. Try again in one minute." });
    },
  });

  aiRouter.post(
    "/",
    requireAuth,
    aiRateLimit,
    asyncHandler(async (req, res) => {
      const parsedRequest = aiRequestSchema.safeParse(req.body);
      if (!parsedRequest.success) {
        return res.status(400).json({
          message: "Invalid AI review request. Please enter a prompt between 20 and 2000 characters.",
          errors: parsedRequest.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      try {
        const review = await generateReview(parsedRequest.data.prompt);
        return res.status(200).json(review);
      } catch (error) {
        if (error instanceof GeminiQuotaError) {
          return res.status(429).json({
            message: "AI review quota exceeded. Please try again later.",
          });
        }

        if (error instanceof InvalidAiReplyError) {
          return res.status(502).json({
            message: "The AI returned an unusable review. Please try again.",
          });
        }

        throw error;
      }
    }),
  );

  return aiRouter;
}

export default createAiRouter();
