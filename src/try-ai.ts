import "dotenv/config";
import { reviewProject } from "./ai.js";

const prompt =
  "I want students to report found items with a category, location, and a private way to verify ownership.";

try {
  const review = await reviewProject(prompt);
  console.log(JSON.stringify(review, null, 2));
} catch (error) {
  console.error("AI review test failed:", error);
  process.exitCode = 1;
}
