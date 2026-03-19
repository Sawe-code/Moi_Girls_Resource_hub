import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import { handleApiError } from "@/lib/error";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authUser = getAuthUser(req);

    const user = await User.findById(authUser.id).select(
      "name email role createdAt lastLoginAt hasLoggedInBefore",
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const { status, message } = handleApiError(error);

    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();

    const authUser = getAuthUser(req);

    const body = await req.json();
    const { name, email } = body as {
      name?: string;
      email?: string;
    };

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({
      email: email.trim(),
      _id: { $ne: authUser.id },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email is already in use" },
        { status: 400 },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      authUser.id,
      {
        name: name.trim(),
        email: email.trim(),
      },
      { new: true },
    ).select("name email role createdAt lastLoginAt hasLoggedInBefore");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const { status, message } = handleApiError(error);

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
