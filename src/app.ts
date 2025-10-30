import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/", (req, res) => {
  res.send("Hello World!");
});

app.use(errorHandler);

export { app };
