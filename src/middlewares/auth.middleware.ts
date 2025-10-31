import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { JWT_SECRET } from "../config/env.js";

// Define structure of the JWT payload
interface TokenPayload extends JwtPayload {
  id: string;
}

interface AuthRequest extends Request {
  user?: any;
}

export const verifyJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token missing or invalid");
    }

    const token = authHeader.split(" ")[1];

    // Safely cast through unknown before TokenPayload
    const decoded = jwt.verify(token!, JWT_SECRET!) as unknown as TokenPayload;

    if (!decoded?.id) {
      throw new ApiError(401, "Invalid token payload");
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new ApiError(401, "User not found or token invalid");
    }

    req.user = user;
    next();
  } catch (err: any) {
    next(new ApiError(401, "Unauthorized: " + err.message));
  }
};
