import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";

// Send a new message
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    throw new ApiError(400, "Content and chatId are required!");
  }

  // Cross-check chat existence before saving message
  const existingChat = await Chat.findById(chatId);
  if (!existingChat) {
    throw new ApiError(404, "Chat not found");
  }

  const newMessage = await Message.create({
    sender: req.user?._id,
    content,
    chat: chatId,
  });

  const fullMessage = await Message.findById(newMessage._id)
    .populate("sender", "name email avatar")
    .populate("chat");

  // Update latest message for chat
  await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

  return res.status(201).json(new ApiResponse(true, "Message sent successfully", fullMessage));
});

// Fetch all messages for a chat
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;

  if (!chatId) {
    throw new ApiError(400, "Chat ID not provided");
  }

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name email avatar")
    .populate("chat");

  return res.status(200).json(new ApiResponse(true, "Messages fetched successfully", messages));
});
