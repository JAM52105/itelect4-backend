import { Schema, model } from "mongoose";
import type { Item } from "../types/index.js";

const itemSchema = new Schema<Item>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    foundAt: { type: Date, required: true, default: Date.now },
    category: {
      type: String,
      enum: ["electronics", "clothing", "accessories", "books", "other"],
      required: true,
    },
    estimatedValue: {
      type: Number,
      required: true,
      min: 0,
      max: 10000,
    },
    status: {
      type: String,
      enum: ["found", "claimed", "returned"],
      default: "found",
    },
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

itemSchema.index({ userId: 1, createdAt: -1 });

export const ItemModel = model<Item>("Item", itemSchema);
