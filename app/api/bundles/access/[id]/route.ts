import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Bundle from "@/models/bundle";
import Purchase from "@/models/Purchase";
import { getAuthUser } from "@/lib/auth";

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
        { status: 404 },
      );
    }

    const authUser = getAuthUser(req);

    const purchase = await Purchase.findOne({
      user: authUser.id,
      bundle: bundle._id,
    });

    if (purchase) {
      return NextResponse.json(
        {
          success: true,
          hasAccess: true,
          reason: "bundle_purchase",
        },
        { status: 200 },
      );
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
        error: "Failed to check bundle access",
      },
      { status: 500 },
    );
  }
}
