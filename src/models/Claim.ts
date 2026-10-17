import { Schema, model } from "mongoose";
import type { Claim } from "../types/index.js";

const claimSchema = new Schema<Claim>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    claimedAt: { type: Date, required: true, default: Date.now },
    verified: { type: Boolean, required: true, default: false },
  },
  {
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        ret.userId = String(ret.userId);
        ret.itemId = String(ret.itemId);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

claimSchema.index({ userId: 1, claimedAt: -1 });

export const ClaimModel = model<Claim>("Claim", claimSchema);
