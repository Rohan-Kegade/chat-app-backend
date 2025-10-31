import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", verifyJWT, sendMessage);
router.get("/:chatId", verifyJWT, getMessages);

export default router;
