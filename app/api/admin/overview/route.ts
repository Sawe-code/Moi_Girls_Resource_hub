import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import Paper from "@/models/Paper";
import Bundle from "@/models/bundle";
import Payment from "@/models/Payment";
import { handleApiError } from "@/lib/error";

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

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const [
      totalStudents,
      totalPapers,
      totalBundles,
      allPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      recentPayments,
      recentUsers,
      latestPapers,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Paper.countDocuments(),
      Bundle.countDocuments(),
      Payment.find(),
      Payment.countDocuments({ status: "completed" }),
      Payment.countDocuments({ status: "pending" }),
      Payment.countDocuments({ status: "failed" }),
      Payment.find({ status: "completed" })
        .populate("user", "name email")
        .populate("paper", "title")
        .populate("bundle", "title")
        .sort({ createdAt: -1 })
        .limit(5),
      User.find({ role: "user" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email"),
      Paper.find().sort({ createdAt: -1 }).limit(5).select("title subject"),
    ]);

    const totalRevenue = allPayments
      .filter((payment) => payment.status === "completed")
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    const monthlyMap = new Map<string, number>();

    allPayments
      .filter((payment) => payment.status === "completed")
      .forEach((payment) => {
        const date = new Date(payment.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        monthlyMap.set(key, (monthlyMap.get(key) || 0) + (payment.amount || 0));
      });

    const revenueChart = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({
        month,
        revenue,
      }));

    const formattedRecentPayments = recentPayments.map((payment) => ({
      id: String(payment._id),
      name:
        typeof payment.user === "object" &&
        payment.user &&
        "name" in payment.user
          ? payment.user.name
          : "Unknown User",
      item:
        typeof payment.bundle === "object" &&
        payment.bundle &&
        "title" in payment.bundle
          ? payment.bundle.title
          : typeof payment.paper === "object" &&
              payment.paper &&
              "title" in payment.paper
            ? payment.paper.title
            : "Unknown Item",
      amount: `KES ${payment.amount}`,
      date: payment.createdAt,
      status: payment.status,
    }));

    const formattedRecentUsers = recentUsers.map((user) => ({
      id: String(user._id),
      name: user.name,
      email: user.email,
    }));

    const formattedLatestPapers = latestPapers.map((paper) => ({
      id: String(paper._id),
      title: paper.title,
      subject: paper.subject,
    }));

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalStudents,
          totalPapers,
          totalBundles,
          totalRevenue,
        },
        paymentSummary: {
          completed: completedPayments,
          pending: pendingPayments,
          failed: failedPayments,
        },
        revenueChart,
        recentPayments: formattedRecentPayments,
        recentUsers: formattedRecentUsers,
        latestPapers: formattedLatestPapers,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const { status, message } = handleApiError(error);

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
