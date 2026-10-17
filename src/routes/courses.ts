import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { CourseModel } from "../models/Course.js";

const courseRouter = Router();

courseRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const courses = await CourseModel.find().sort({ code: 1 });
    return res.status(200).json({ courses });
  }),
);

courseRouter.get(
  "/:code",
  asyncHandler(async (req, res) => {
    const code = req.params.code;
    if (typeof code !== "string") {
      return res.status(400).json({ message: "Invalid course code." });
    }

    const course = await CourseModel.findOne({ code: code.toUpperCase() });
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    return res.status(200).json({ course });
  }),
);

export default courseRouter;
