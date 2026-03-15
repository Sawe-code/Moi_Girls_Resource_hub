import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Purchase from "@/models/Purchase";
import Payment from "@/models/Payment";
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

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired token",
        },
        { status: 401 },
      );
    }

    const purchases = await Purchase.find({ user: decoded.id });
    const payments = await Payment.find({
      user: decoded.id,
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
