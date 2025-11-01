import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const accessChat = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(400, "UserId param not sent!");
  }

  // Check for existing 1-to-1 chat
  const existingChat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user?.id, userId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (existingChat) {
    return res
      .status(200)
      .json(new ApiResponse(true, "Chat fetched", existingChat));
  }

  // Fetch receiver info
  const receiver = await import("../models/user.model.js").then(
    (m) => m.User.findById(userId).select("name")
  );

  if (!receiver) {
    throw new ApiError(404, "Receiver user not found");
  }

  // Build dynamic chatName
  let chatName = receiver.name;
  if (receiver._id.toString() === req.user?.id.toString()) {
    chatName = `${receiver.name} (you)`;
  }

  // Create the chat
  const chatData = {
    chatName,
    isGroupChat: false,
    users: [req.user?.id, userId],
  };

  const newChat = await Chat.create(chatData);
  const fullChat = await Chat.findById(newChat._id).populate("users", "-password");

  return res
    .status(201)
    .json(new ApiResponse(true, "Chat created", fullChat));
});

export const getAllChats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: user not logged in");
  }

  // Find all chats where the user is a participant
  const chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 }); // show most recent first

  return res
    .status(200)
    .json(new ApiResponse(true, "Chats fetched successfully", chats));
});