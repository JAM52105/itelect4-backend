import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserModel } from "../models/User.js";

const authRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1).max(72),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid registration input." });
  }

  try {
    const { name, email, password } = parsed.data;
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ user });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Could not register user." });
  }
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid login input." });
  }

  const { email, password } = parsed.data;
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT secret is not configured." });
  }

  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, secret, {
    expiresIn: "2h",
  });

  return res.status(200).json({
    token,
    user: user.toJSON(),
  });
});

export default authRouter;
