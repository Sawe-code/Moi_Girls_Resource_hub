import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Paper from "@/models/Paper";
import { handleApiError } from "@/lib/error";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() || "";
    const subject = searchParams.get("subject")?.trim() || "";
    const form = searchParams.get("form")?.trim() || "";
    const year = searchParams.get("year")?.trim() || "";
    const type = searchParams.get("type")?.trim() || "";
    const sort = searchParams.get("sort")?.trim() || "newest";

    const query: Record<string, unknown> = {};

    if (subject && subject !== "All Subjects") {
      query.subject = subject;
    }

    if (form && form !== "All Forms") {
      query.form = form;
    }

    if (year && year !== "All Years") {
      query.year = Number(year);
    }

    if (type && type !== "All Types") {
      query.type = type;
    }

    if (search) {
      const searchConditions: Record<string, unknown>[] = [
        { title: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { form: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
      if (!Number.isNaN(Number(search))) {
        searchConditions.push({ year: Number(search) });
      }
      query.$or = searchConditions;
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "price-low") {
      sortOption = { price: 1 };
    } else if (sort === "price-high") {
      sortOption = { price: -1 };
    } else if (sort === "popular") {
      sortOption = { downloadsCount: -1 };
    }

    const papers = await Paper.find(query).sort(sortOption);

    return NextResponse.json(
      {
        success: true,
        count: papers.length,
        papers,
      },
      { status: 200 },
    );
  } catch (error) {
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

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { title, subject, form, year, type, price, isFree, hasMarkingScheme, fileUrl } = body as {
      title?: string;
      subject?: string;
      form?: string;
      year?: string;
      type?: string;
      price?: number;
      isFree?: boolean;
      hasMarkingScheme?: boolean;
      fileUrl?: string;
    
    };

    if (!title || !subject || !form || !year || !type || !fileUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Please fill all the fields",
        },
        { status: 400 },
      );
    }

    const newPaper = await Paper.create({
      title,
      subject,
      form,
      year: Number(year),
      type,
      price: isFree ? 0 : price || 0,
      isFree: Boolean(isFree),
      hasMarkingScheme: Boolean(hasMarkingScheme),
      fileUrl,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Paper uploaded successfully",
        paper: newPaper,
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
