import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT ?? 4000);

void connectDB().catch((error: unknown) => {
  console.error("Initial MongoDB connection failed:", error);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
