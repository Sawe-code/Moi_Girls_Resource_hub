import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Payment from "@/models/Payment";
import Paper from "@/models/Paper";
import Bundle from "@/models/bundle";
import { handleApiError } from "@/lib/error";
import { getAuthUser } from "@/lib/auth";

void Paper;
void Bundle;

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authUser = getAuthUser(req);

    const payments = await Payment.find({ user: authUser.id })
      .populate("paper")
      .populate("bundle")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        payments,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
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
