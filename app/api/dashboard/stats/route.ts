import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Purchase from "@/models/Purchase";
import Payment from "@/models/Payment";
import { handleApiError } from "@/lib/error";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authUser = getAuthUser(req);

    const purchases = await Purchase.find({ user: authUser.id });
    const payments = await Payment.find({
      user: authUser.id,
      status: "completed",
    });

    const papersPurchased = purchases.filter(
      (purchase) => purchase.paper,
    ).length;
    const bundlesOwned = purchases.filter((purchase) => purchase.bundle).length;
    const totalSpent = payments.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0,
    );
    const recentPurchases = purchases.length;

    return NextResponse.json(
      {
        success: true,
        stats: {
          papersPurchased,
          bundlesOwned,
          totalSpent,
          recentPurchases,
        },
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
