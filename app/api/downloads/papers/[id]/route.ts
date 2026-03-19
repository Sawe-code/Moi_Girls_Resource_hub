import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Paper from "@/models/Paper";
import Purchase from "@/models/Purchase";
import Bundle from "@/models/bundle";
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
      const authUser = getAuthUser(req);
      const directPaperPurchase = await Purchase.findOne({
        user: authUser.id,
        paper: paper._id,
      });

      let hasAccess = Boolean(directPaperPurchase);

      if (!hasAccess) {
        const bundlePurchases = await Purchase.find({
          user: authUser.id,
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
