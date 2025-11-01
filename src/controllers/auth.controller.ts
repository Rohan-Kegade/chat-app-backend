import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/jwt.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar,
  });

  const token = generateToken(user._id.toString());

  return res.status(201).json(
    new ApiResponse(
      true,
      "User registered successfully!",
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
      token
    )
  );
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new ApiError(400, "Email and password are required!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new ApiError(401, "Invalid credentials!");
  }

  const token = generateToken(user._id.toString());

  return res.status(200).json(
    new ApiResponse(
      true,
      "Login successful!",
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
      token
    )
  );
});
