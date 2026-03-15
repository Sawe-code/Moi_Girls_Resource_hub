import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Bundle from "@/models/bundle";
import Purchase from "@/models/Purchase";

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

    const bundle = await Bundle.findById(id);

    if (!bundle) {
      return NextResponse.json(
        {
          success: false,
          error: "Bundle not found",
        },
        { status: 404 }
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
        { status: 200 }
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
        { status: 200 }
      );
    }

    const purchase = await Purchase.findOne({
      user: decoded.id,
      bundle: bundle._id,
    });

    if (purchase) {
      return NextResponse.json(
        {
          success: true,
          hasAccess: true,
          reason: "bundle_purchase",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        hasAccess: false,
        reason: "not_purchased",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check bundle access",
      },
      { status: 500 }
    );
  }
}