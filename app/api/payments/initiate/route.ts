import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
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

const generateReference = () => {
  return `PAY-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

const normalizeKenyanPhone = (phone: string) => {
  const cleaned = phone.replace(/\s+/g, "");

  if (cleaned.startsWith("+254")) {
    return cleaned;
  }

  if (cleaned.startsWith("254")) {
    return `+${cleaned}`;
  }

  if (cleaned.startsWith("0")) {
    return `+254${cleaned.slice(1)}`;
  }

  return cleaned;
};

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
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
        { status: 401 }
      );
    }

    const body = await req.json();

    const { bundleId, phone } = body as {
      bundleId?: string;
      phone?: string;
    };

    if (!bundleId || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Bundle ID and phone number are required",
        },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeKenyanPhone(phone);

    if (!/^(\+254)\d{9}$/.test(normalizedPhone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid Kenyan phone number",
        },
        { status: 400 }
      );
    }

    const bundle = await Bundle.findById(bundleId);

    if (!bundle) {
      return NextResponse.json(
        {
          success: false,
          error: "Bundle not found",
        },
        { status: 404 }
      );
    }

    const payment = await Payment.create({
      user: decoded.id,
      bundle: bundle._id,
      phone: normalizedPhone,
      amount: bundle.price,
      status: "pending",
      reference: generateReference(),
      paymentMethod: "M-Pesa",
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Payment request created successfully. M-Pesa integration will be connected next.",
        payment: {
          id: payment._id,
          reference: payment.reference,
          status: payment.status,
          amount: payment.amount,
          phone: payment.phone,
        },
      },
      { status: 201 }
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