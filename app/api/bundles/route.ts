import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Bundle from "@/models/bundle";
import "@/models/Paper";
import { handleApiError } from "@/lib/error";

export async function GET() {
  try {
    await connectToDatabase();

    const bundles = await Bundle.find()
      .populate("papers")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
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

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { title, subtitle, tag, price, oldPrice, access, papers } = body as {
      title?: string;
      subtitle?: string;
      tag?: string;
      price?: number;
      oldPrice?: number;
      access?: string;
      papers?: string[];
    };

    if (!title || !subtitle || price === undefined || oldPrice === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Please fill in all required fields",
        },
        { status: 400 },
      );
    }

    const newBundle = await Bundle.create({
      title,
      subtitle,
      tag: tag || "Bundle",
      price,
      oldPrice,
      access: access || "Instant access",
      papers: papers || [],
      papersCount: papers?.length || 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Bundle created successfully",
        bundle: newBundle,
      },
      { status: 201 },
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
