import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ClaimModel } from "../models/Claim.js";
import { ItemModel } from "../models/Item.js";

const claimRouter = Router();
const createClaimSchema = z.object({
  itemId: z.string().trim().min(1),
});

claimRouter.use(requireAuth);

claimRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const claims = await ClaimModel.find({ userId: req.userId }).sort({ claimedAt: -1 });
    return res.status(200).json({ claims });
  }),
);

claimRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = createClaimSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid claim data." });
    }

    const item = await ItemModel.findById(parsed.data.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    const claim = await ClaimModel.create({
      itemId: item._id,
      userId: req.userId,
    });
    return res.status(201).json({ claim });
  }),
);

export default claimRouter;
