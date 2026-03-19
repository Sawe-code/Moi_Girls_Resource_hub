import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Purchase from "@/models/Purchase";
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
    const purchases = await Purchase.find({ user: authUser.id })
      .populate("paper")
      .populate("bundle")
      .sort({ createdAt: -1 });

    const papers = purchases
      .filter((purchase) => purchase.paper)
      .map((purchase) => purchase.paper);

    const bundles = purchases
      .filter((purchase) => purchase.bundle)
      .map((purchase) => purchase.bundle);

    return NextResponse.json(
      {
        success: true,
        papers,
        bundles,
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
