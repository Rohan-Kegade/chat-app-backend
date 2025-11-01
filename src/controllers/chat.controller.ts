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

  const existingChat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user?.id, userId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (existingChat) {
    return res.status(200).json(new ApiResponse(true, "Chat fetched", existingChat));
  }

  const chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user?.id, userId],
  };

  const newChat = await Chat.create(chatData);
  const fullChat = await Chat.findById(newChat._id).populate("users", "-password");

  return res.status(201).json(new ApiResponse(true, "Chat created", fullChat));
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