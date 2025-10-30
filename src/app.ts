import express from "express";
import authRoutes   from "./routes/auth.routes.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes );

app.use("/", (req, res) => {
  res.send("Hello World!");
});

export { app };
