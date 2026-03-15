import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Paper from "@/models/Paper";
import Purchase from "@/models/Purchase";
import Bundle from "@/models/bundle";

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

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    const paper = await Paper.findById(id);

    if (!paper) {
      return NextResponse.json(
        {
          success: false,
          error: "Paper not found",
        },
        { status: 404 },
      );
    }

    if (paper.isFree) {
      return NextResponse.json(
        {
          success: true,
          hasAccess: true,
          reason: "free",
        },
        { status: 200 },
      );
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: true,
          hasAccess: false,
          reason: "not_logged_in",
        },
        { status: 200 },
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return NextResponse.json(
        {
          success: true,
          hasAccess: false,
          reason: "invalid_token",
        },
        { status: 200 },
      );
    }

    const directPurchase = await Purchase.findOne({
      user: decoded.id,
      paper: paper._id,
    });

    if (directPurchase) {
      return NextResponse.json(
        {
          success: true,
          hasAccess: true,
          reason: "direct_purchase",
        },
        { status: 200 },
      );
    }

    const bundlePurchases = await Purchase.find({
      user: decoded.id,
      bundle: { $ne: null },
    }).select("bundle");

    const bundleIds = bundlePurchases
      .map((purchase) => purchase.bundle)
      .filter(Boolean);

    if (bundleIds.length > 0) {
      const matchingBundle = await Bundle.findOne({
        _id: { $in: bundleIds },
        papers: paper._id,
      });

      if (matchingBundle) {
        return NextResponse.json(
          {
            success: true,
            hasAccess: true,
            reason: "bundle_purchase",
          },
          { status: 200 },
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        hasAccess: false,
        reason: "not_purchased",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check paper access",
      },
      { status: 500 },
    );
  }
}
