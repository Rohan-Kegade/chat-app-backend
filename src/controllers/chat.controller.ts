import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const accessChat = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json(new ApiResponse(400, "UserId param not sent"));
  } 

  const existingChat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user?.id, userId] },
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (existingChat) {
    return res.status(200).json(new ApiResponse(200, existingChat, "Chat fetched"));
  }

  const chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user?.id, userId],
  };

  const newChat = await Chat.create(chatData);
  const fullChat = await Chat.findById(newChat._id).populate("users", "-password");

  return res.status(201).json(new ApiResponse(201, fullChat, "Chat created"));
});
