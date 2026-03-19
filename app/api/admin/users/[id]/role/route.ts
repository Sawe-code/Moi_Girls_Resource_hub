import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import { handleApiError } from "@/lib/error";
import { getAuthUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();

    const authUser = getAuthUser(req);

    if (authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const { role } = body as { role?: string };

    if (!role || !["admin", "user"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role provided" },
        { status: 400 },
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    if (String(user._id) === authUser.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot change your own role from this page",
        },
        { status: 400 },
      );
    }

    user.role = role;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: `User role updated to ${role}`,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const { status, message } = handleApiError(error);

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
