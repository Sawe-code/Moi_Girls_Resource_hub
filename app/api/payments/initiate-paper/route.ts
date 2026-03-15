import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Paper from "@/models/Paper";
import Payment from "@/models/Payment";
import Purchase from "@/models/Purchase";
import { handleApiError } from "@/lib/error";
import {
  getAccessToken,
  getMpesaBaseUrl,
  generatePassword,
  generateTimestamp,
  normalizeKenyanPhone,
  MPESA_SHORTCODE,
  MPESA_CALLBACK_URL,
} from "@/lib/mpesa";

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
const PAYMENT_MODE = process.env.PAYMENT_MODE || "mock";

const generateReference = () => {
  return `PAY-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
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
        { status: 401 },
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
        { status: 401 },
      );
    }

    const body = await req.json();

    const { paperId, phone } = body as {
      paperId?: string;
      phone?: string;
    };

    if (!paperId || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Paper ID and phone number are required",
        },
        { status: 400 },
      );
    }

    const normalizedPhone = normalizeKenyanPhone(phone);

    if (!/^254\d{9}$/.test(normalizedPhone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid Kenyan phone number",
        },
        { status: 400 },
      );
    }

    const paper = await Paper.findById(paperId);

    if (!paper) {
      return NextResponse.json(
        {
          success: false,
          error: "Paper not found",
        },
        { status: 404 },
      );
    }

    if (paper.isFree) {
      return NextResponse.json(
        {
          success: false,
          error: "This paper is free and does not require payment",
        },
        { status: 400 },
      );
    }

    const existingPurchase = await Purchase.findOne({
      user: decoded.id,
      paper: paper._id,
    });

    if (existingPurchase) {
      return NextResponse.json(
        {
          success: false,
          error: "You already own this paper",
        },
        { status: 400 },
      );
    }

    const payment = await Payment.create({
      user: decoded.id,
      paper: paper._id,
      phone: normalizedPhone,
      amount: paper.price,
      status: "pending",
      reference: generateReference(),
      paymentMethod: PAYMENT_MODE === "mock" ? "Mock" : "M-Pesa",
    });

    if (PAYMENT_MODE === "mock") {
      payment.status = "completed";
      await payment.save();

      const existingMockPurchase = await Purchase.findOne({
        payment: payment._id,
      });

      if (!existingMockPurchase) {
        await Purchase.create({
          user: payment.user,
          paper: payment.paper,
          bundle: null,
          amount: payment.amount,
          payment: payment._id,
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: "Mock payment completed successfully.",
          data: {
            paymentId: payment._id,
            reference: payment.reference,
            status: payment.status,
          },
        },
        { status: 200 },
      );
    }

    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);
    const baseUrl = getMpesaBaseUrl();

    const stkPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(paper.price),
      PartyA: normalizedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: payment.reference,
      TransactionDesc: paper.title,
    };

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
      cache: "no-store",
    });

    const stkData = await stkRes.json();

    if (!stkRes.ok) {
      payment.status = "failed";
      await payment.save();

      return NextResponse.json(
        {
          success: false,
          error:
            stkData.errorMessage ||
            stkData.ResponseDescription ||
            "Failed to initiate STK push",
        },
        { status: 400 },
      );
    }

    payment.reference = stkData.CheckoutRequestID || payment.reference;
    await payment.save();

    return NextResponse.json(
      {
        success: true,
        message: stkData.CustomerMessage || "STK push sent successfully",
        data: {
          merchantRequestId: stkData.MerchantRequestID,
          checkoutRequestId: stkData.CheckoutRequestID,
          responseCode: stkData.ResponseCode,
          responseDescription: stkData.ResponseDescription,
          customerMessage: stkData.CustomerMessage,
        },
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
