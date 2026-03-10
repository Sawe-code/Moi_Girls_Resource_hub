import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Bundle from "@/models/bundle";
import { handleApiError } from "@/lib/error";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    const bundle = await Bundle.findById(id).populate("papers");

    if (!bundle) {
      return NextResponse.json(
        {
          success: false,
          error: "Bundle not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        bundle,
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
