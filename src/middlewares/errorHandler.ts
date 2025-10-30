import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, err.message, err.errors));
  }

  // fallback for unexpected errors
  return res
    .status(500)
    .json(new ApiResponse(500, "Internal Server Error", err.message));
};
