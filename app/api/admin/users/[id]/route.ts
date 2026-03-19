import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import Payment from "@/models/Payment";
import Purchase from "@/models/Purchase";
import { handleApiError } from "@/lib/error";
import { getAuthUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();

    const authUser = await getAuthUser(req);

    if (authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const { id } = await context.params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    if (user.role === "admin") {
      return NextResponse.json(
        { success: false, error: "Admin accounts cannot be deleted here" },
        { status: 400 },
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
      { status: 200 },
    );
  } catch (error: unknown) {
    const { status, message } = handleApiError(error);

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
