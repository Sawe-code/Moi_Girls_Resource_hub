import mongoose from "mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleApiError } from "@/lib/error";
import connectToDatabase from "@/lib/db";

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
    const { name, email, password } = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide name, email and password",
        },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists",
        },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
          hasLoggedInBefore: false,
          role: "user",
        },
      ],
      { session },
    );

    const token = jwt.sign(
      { id: newUsers[0]._id.toString(), role: newUsers[0].role },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      },
    );

    await session.commitTransaction();
    await session.endSession();

    const response = NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        data: {
          user: {
            id: newUsers[0]._id,
            name: newUsers[0].name,
            email: newUsers[0].email,
            role: newUsers[0].role,
            hasLoggedInBefore: false,
            lastLoginAt: null,
            isFirstLogin: true,
          },
        },
      },
      { status: 201 },
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (error: unknown) {
    console.error("SIGNUP ERROR:", error);
    await session.abortTransaction();
    await session.endSession();

    const { status, message } = handleApiError(error);

    return NextResponse.json({ error: message, success: false }, { status });
  }
}
