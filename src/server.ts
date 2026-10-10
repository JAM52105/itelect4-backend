import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT ?? 4000);

async function startServer(): Promise<void> {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

void startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
