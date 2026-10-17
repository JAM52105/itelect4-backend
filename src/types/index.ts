import type { Types } from "mongoose";

export const USER_ROLES = ["student", "admin", "instructor"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ITEM_CATEGORIES = [
  "electronics",
  "clothing",
  "accessories",
  "books",
  "other",
] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export const ITEM_STATUSES = ["found", "claimed", "returned"] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  location: string;
  foundAt: Date;
  category: ItemCategory;
  estimatedValue: number;
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  code: string;
  title: string;
  units: number;
  semester: string;
}

export type CourseDoc = Pick<Course, "code" | "title" | "units" | "semester">;

export interface Submission {
  userId: Types.ObjectId;
  courseCode: string;
  repoUrl: string;
  submittedAt: Date;
  score?: number;
}

export interface Claim {
  userId: Types.ObjectId;
  itemId: Types.ObjectId;
  claimedAt: Date;
  verified: boolean;
}
