import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { COURSES } from "./data/courses.js";
import { CourseModel } from "./models/Course.js";

async function seed(): Promise<void> {
  try {
    await connectDB();
    await Promise.all(
      COURSES.map((course) =>
        CourseModel.updateOne({ code: course.code }, course, { upsert: true }),
      ),
    );
    console.log(`Seeded ${COURSES.length} course(s).`);
  } finally {
    await mongoose.disconnect();
  }
}

void seed().catch((error: unknown) => {
  console.error("Failed to seed courses:", error);
  process.exitCode = 1;
});
