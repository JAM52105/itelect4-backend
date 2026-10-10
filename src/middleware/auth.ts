import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const [type, token] = authHeader?.split(" ") ?? [];
  const secret = process.env.JWT_SECRET;

  if (type !== "Bearer" || !token || !secret) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as { sub?: string };
    if (!payload.sub) {
      res.status(401).json({ message: "Invalid token." });
      return;
    }

    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token." });
  }
}
