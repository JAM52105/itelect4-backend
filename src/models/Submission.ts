import { Schema, model } from "mongoose";
import type { Submission } from "../types/index.js";

const submissionSchema = new Schema<Submission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseCode: { type: String, required: true, uppercase: true, trim: true },
    repoUrl: { type: String, required: true, trim: true },
    submittedAt: { type: Date, required: true, default: Date.now },
    score: { type: Number, min: 0, max: 100 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

submissionSchema.index({ userId: 1, submittedAt: -1 });

export const SubmissionModel = model<Submission>("Submission", submissionSchema);
