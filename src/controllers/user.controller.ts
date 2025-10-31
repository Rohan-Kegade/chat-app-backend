import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const searchQuery = req.query.search as string | undefined;

  const keyword = searchQuery
    ? {
        name: { $regex: searchQuery, $options: "i" },
      }
    : {};

  // Exclude password from results
  const users = await User.find(keyword).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const getCurrentUser = asyncHandler(async (req: any, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});
