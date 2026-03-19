import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/user";
import Paper from "@/models/Paper";
import Bundle from "@/models/bundle";
import { handleApiError } from "@/lib/error";
import { getAuthUser } from "@/lib/auth";

void User;
void Paper;
void Bundle;

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authUser = getAuthUser(req);

    if (authUser.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";

    const query: Record<string, unknown> = {};

    if (status && ["pending", "completed", "failed"].includes(status)) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate("user", "name email")
      .populate("paper", "title")
      .populate("bundle", "title")
      .sort({ createdAt: -1 });

    const filteredPayments = payments.filter((payment) => {
      if (!search) return true;

      const userName =
        typeof payment.user === "object" &&
        payment.user &&
        "name" in payment.user
          ? String(payment.user.name)
          : "";

      const userEmail =
        typeof payment.user === "object" &&
        payment.user &&
        "email" in payment.user
          ? String(payment.user.email)
          : "";

      const paperTitle =
        typeof payment.paper === "object" &&
        payment.paper &&
        "title" in payment.paper
          ? String(payment.paper.title)
          : "";

      const bundleTitle =
        typeof payment.bundle === "object" &&
        payment.bundle &&
        "title" in payment.bundle
          ? String(payment.bundle.title)
          : "";

      const q = search.toLowerCase();

      return (
        userName.toLowerCase().includes(q) ||
        userEmail.toLowerCase().includes(q) ||
        paperTitle.toLowerCase().includes(q) ||
        bundleTitle.toLowerCase().includes(q) ||
        String(payment.phone || "")
          .toLowerCase()
          .includes(q) ||
        String(payment.reference || "")
          .toLowerCase()
          .includes(q)
      );
    });

    const formattedPayments = filteredPayments.map((payment) => ({
      _id: String(payment._id),
      studentName:
        typeof payment.user === "object" &&
        payment.user &&
        "name" in payment.user
          ? payment.user.name
          : "Unknown User",
      studentEmail:
        typeof payment.user === "object" &&
        payment.user &&
        "email" in payment.user
          ? payment.user.email
          : "Unknown Email",
      itemTitle:
        typeof payment.bundle === "object" &&
        payment.bundle &&
        "title" in payment.bundle
          ? payment.bundle.title
          : typeof payment.paper === "object" &&
              payment.paper &&
              "title" in payment.paper
            ? payment.paper.title
            : "Unknown Item",
      itemType: payment.bundle ? "Bundle" : payment.paper ? "Paper" : "Unknown",
      amount: payment.amount,
      phone: payment.phone,
      reference: payment.reference,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      createdAt: payment.createdAt,
    }));

    return NextResponse.json(
      {
        success: true,
        payments: formattedPayments,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const { status, message } = handleApiError(error);

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
