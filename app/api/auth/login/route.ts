import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleApiError } from "@/lib/error";

const getEnvVar = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not defined`);
  }

  return value;
};

const JWT_SECRET = getEnvVar("JWT_SECRET");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function POST(req: Request) {
  await connectToDatabase();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide email and password",
        },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        { status: 401 },
      );
    }

    console.log("Before update:", user.hasLoggedInBefore);

    const isFirstLogin = user.hasLoggedInBefore !== true;

    user.hasLoggedInBefore = true;
    user.lastLoginAt = new Date();
    await user.save();

    console.log("After update:", user.hasLoggedInBefore);
    console.log("Returned isFirstLogin:", isFirstLogin);

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });

    await session.commitTransaction();
    await session.endSession();

    return NextResponse.json(
      {
        success: true,
        message: "User logged in successfully",
        data: {
          token,
          user: {
            id: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
            hasLoggedInBefore: user.hasLoggedInBefore,
            lastLoginAt: user.lastLoginAt,
            isFirstLogin,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Login error:", error);
    await session.abortTransaction();
    await session.endSession();

    const { status, message } = handleApiError(error);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status },
    );
  }
}
