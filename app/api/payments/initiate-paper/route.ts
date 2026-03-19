import { NextRequest, NextResponse } from "next/server";
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

import { getAuthUser } from "@/lib/auth";

const generateReference = () => {
  return `PAY-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
};

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authUser = getAuthUser(req);

    const body = await req.json();

    console.log("PAPER PAYMENT BODY:", body);

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
      user: authUser.id,
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
      user: authUser.id,
      paper: paper._id,
      bundle: null,
      phone: normalizedPhone,
      amount: paper.price,
      status: "pending",
      reference: generateReference(),
      checkoutRequestId: null,
      merchantRequestId: null,
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

    console.log("===== PAPER STK DEBUG =====");
    console.log("PAPER STK status:", stkRes.status);
    console.log("PAPER STK payload:", stkPayload);
    console.log("PAPER STK response:", stkData);
    console.log("===========================");

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

    payment.checkoutRequestId = stkData.CheckoutRequestID || null;
    payment.merchantRequestId = stkData.MerchantRequestID || null;
    await payment.save();

    return NextResponse.json(
      {
        success: true,
        message: stkData.CustomerMessage || "STK push sent successfully",
        data: {
          paymentId: payment._id,
          reference: payment.reference,
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
    console.error("INITIATE PAPER PAYMENT ERROR:", error);

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
