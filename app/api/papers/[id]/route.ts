import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Paper from "@/models/Paper";
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

    const paper = await Paper.findById(id);

    if (!paper) {
      return NextResponse.json(
        {
          success: false,
          error: "Paper not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        paper,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const { status, message } = handleApiError(error);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}