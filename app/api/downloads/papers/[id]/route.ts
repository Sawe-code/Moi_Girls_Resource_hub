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

    if (!paper.isFree) {
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

      const directPaperPurchase = await Purchase.findOne({
        user: decoded.id,
        paper: paper._id,
      });

      let hasAccess = Boolean(directPaperPurchase);

      if (!hasAccess) {
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

          hasAccess = Boolean(matchingBundle);
        }
      }

      if (!hasAccess) {
        return NextResponse.json(
          {
            success: false,
            error: "You do not have access to this paper",
          },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        fileUrl: paper.fileUrl,
        title: paper.title,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to prepare download",
      },
      { status: 500 },
    );
  }
}
