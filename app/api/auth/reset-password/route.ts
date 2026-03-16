import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import { handleApiError } from "@/lib/error";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { token, password } = (await req.json()) as {
      token?: string;
      password?: string;
    };

    if (!token || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide token and password",
        },
        { status: 400 },
      );
    }

    if (password.trim().length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 },
      );
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // $gt means greater than.it's a mongodb operator
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired token",
        },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully. You can now log in.",
      },
      { status: 200 },
    );
  } catch (error) {
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
