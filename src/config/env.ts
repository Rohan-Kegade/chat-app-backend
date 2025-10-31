import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || "";
