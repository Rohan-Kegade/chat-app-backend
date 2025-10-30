import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import { app } from "./app.js";
dotenv.config();

const PORT = process.env.PORT;

const startServer = async (): Promise<void> => {
  try {
    await connectDB(); // Wait for DB connection first
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
