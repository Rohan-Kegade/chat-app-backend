import express from "express";
import { accessChat, getAllChats } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/chat — access or create one-to-one chat
router.post("/", verifyJWT, accessChat);
router.get("/", verifyJWT, getAllChats);

export default router;
