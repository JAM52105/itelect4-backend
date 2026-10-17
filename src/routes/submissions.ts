import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { CourseModel } from "../models/Course.js";
import { SubmissionModel } from "../models/Submission.js";

const submissionRouter = Router();

const createSubmissionSchema = z.object({
  courseCode: z.string().trim().min(1).transform((code) => code.toUpperCase()),
  repoUrl: z.string().trim().url(),
});

const updateSubmissionSchema = createSubmissionSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field must be provided." },
);

submissionRouter.use(requireAuth);

submissionRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const submissions = await SubmissionModel.find({ userId: req.userId }).sort({
      submittedAt: -1,
    });
    return res.status(200).json({ submissions });
  }),
);

submissionRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const submission = await SubmissionModel.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    return res.status(200).json({ submission });
  }),
);

submissionRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = createSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid submission data.",
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const course = await CourseModel.findOne({ code: parsed.data.courseCode });
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const submission = await SubmissionModel.create({
      ...parsed.data,
      userId: req.userId,
    });
    return res.status(201).json({ submission });
  }),
);

submissionRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const parsed = updateSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid submission update." });
    }

    const update = parsed.data;
    if (update.courseCode) {
      const course = await CourseModel.findOne({ code: update.courseCode });
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }
    }

    const submission = await SubmissionModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: update },
      { new: true, runValidators: true },
    );
    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    return res.status(200).json({ submission });
  }),
);

submissionRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const submission = await SubmissionModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    return res.status(204).send();
  }),
);

export default submissionRouter;
