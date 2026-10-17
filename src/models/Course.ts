import { Schema, model } from "mongoose";
import type { CourseDoc } from "../types/index.js";

export const courseSchema = new Schema<CourseDoc>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    units: { type: Number, required: true, min: 1, max: 6 },
    semester: { type: String, required: true, trim: true },
  },
  {
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export const CourseModel = model<CourseDoc>("Course", courseSchema);
