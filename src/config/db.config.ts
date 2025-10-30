import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log("Connected to Database.");
  } catch (err: any) {
    console.log(`Databse connection error: ${err}`);
    throw err;
  }
};
