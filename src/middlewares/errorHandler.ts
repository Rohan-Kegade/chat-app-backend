import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  // Known custom error
  if (err instanceof ApiError) {
    res
      .status(err.statusCode)
      .json(new ApiResponse(false, err.message, null));
    return;
  }

  // Unknown or unhandled error
  if (err instanceof Error) {
    res
      .status(500)
      .json(new ApiResponse(false, err.message || "Internal Server Error", null));
    return;
  }

  // Fallback for anything unexpected
  res.status(500).json(new ApiResponse(false, "Unknown error occurred", null));
};
