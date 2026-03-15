import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Bundle from "@/models/bundle";
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

const generateReference = () => {
  return `PAY-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

export async function POST(req: NextRequest) {
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

    const bundle = await Bundle.findById(bundleId);

    if (!bundle) {
      return NextResponse.json(
        { success: false, error: "Bundle not found" },
        { status: 404 },
      );
    }

    const existingPurchase = await Purchase.findOne({
      user: decoded.id,
      bundle: bundle._id,
    });

    if (existingPurchase) {
      return NextResponse.json(
        {
          success: false,
          error: "You already own this bundle",
        },
        { status: 400 },
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

    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);
    const baseUrl = getMpesaBaseUrl();

    const stkPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(bundle.price),
      PartyA: normalizedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: payment.reference,
      TransactionDesc: bundle.title,
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

    console.log("===== STK DEBUG =====");
    console.log("STK status:", stkRes.status);
    console.log("STK payload:", stkPayload);
    console.log("STK response:", stkData);
    console.log("=====================");

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

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
