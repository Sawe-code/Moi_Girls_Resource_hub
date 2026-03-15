import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import Payment from "@/models/Payment";
import Purchase from "@/models/Purchase";
import { handleApiError } from "@/lib/error";

type JwtPayload = {
  id: string;
  role: string;
};

const getEnvVar = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not defined`);
  }

  return value;
};

const JWT_SECRET = getEnvVar("JWT_SECRET");

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role === "admin") {
      return NextResponse.json(
        { success: false, error: "Admin accounts cannot be deleted here" },
        { status: 400 }
      );
    }

    await Promise.all([
      Payment.deleteMany({ user: user._id }),
      Purchase.deleteMany({ user: user._id }),
      User.findByIdAndDelete(user._id),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const { status, message } = handleApiError(error);

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}