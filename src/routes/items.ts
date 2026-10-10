import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { ItemModel } from "../models/Item.js";
import { ITEM_CATEGORIES, ITEM_STATUSES } from "../types/index.js";

const itemRouter = Router();

const createItemSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional(),
  location: z.string().trim().min(1).max(200),
  foundAt: z.string().datetime().optional(),
  category: z.enum(ITEM_CATEGORIES),
  estimatedValue: z.number().min(0).max(10000),
  status: z.enum(ITEM_STATUSES).optional(),
});

const updateItemSchema = createItemSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one field must be provided." },
);

itemRouter.use(requireAuth);

itemRouter.get("/", async (req, res) => {
  const items = await ItemModel.find({ userId: req.userId }).sort({ createdAt: -1 });
  return res.status(200).json({ items });
});

itemRouter.get("/:id", async (req, res) => {
  const item = await ItemModel.findOne({ _id: req.params.id, userId: req.userId });
  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }

  return res.status(200).json({ item });
});

itemRouter.post("/", async (req, res) => {
  const parsed = createItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid item data." });
  }

  const item = await ItemModel.create({
    ...parsed.data,
    userId: req.userId,
    foundAt: parsed.data.foundAt ? new Date(parsed.data.foundAt) : new Date(),
  });

  return res.status(201).json({ item });
});

itemRouter.patch("/:id", async (req, res) => {
  const parsed = updateItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid item update." });
  }

  const updatePayload = { ...parsed.data };
  if (typeof updatePayload.foundAt === "string") {
    updatePayload.foundAt = new Date(updatePayload.foundAt) as never;
  }

  const item = await ItemModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { $set: updatePayload },
    { new: true, runValidators: true },
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }

  return res.status(200).json({ item });
});

itemRouter.delete("/:id", async (req, res) => {
  const item = await ItemModel.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }

  return res.status(204).send();
});

export default itemRouter;
