import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Payment from "@/models/Payment";
import Purchase from "@/models/Purchase";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();

    console.log("===== MPESA CALLBACK RAW =====");
    console.log(JSON.stringify(body, null, 2));
    console.log("==============================");

    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json(
        { success: false, error: "Invalid callback payload" },
        { status: 400 },
      );
    }

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = Number(callback.ResultCode);
    const resultDesc = callback.ResultDesc;

    const payment = await Payment.findOne({ checkoutRequestId });

    if (!payment) {
      console.log(
        "Payment record not found for checkoutRequestId:",
        checkoutRequestId,
      );

      return NextResponse.json(
        { success: false, error: "Payment record not found" },
        { status: 404 },
      );
    }

    if (resultCode === 0) {
      payment.status = "completed";
      await payment.save();

      const existingPurchase = await Purchase.findOne({
        payment: payment._id,
      });

      if (!existingPurchase) {
        await Purchase.create({
          user: payment.user,
          paper: payment.paper || null,
          bundle: payment.bundle || null,
          amount: payment.amount,
          payment: payment._id,
        });
      }
    } else {
      payment.status = "failed";
      await payment.save();
    }

    console.log("Result:", resultDesc);

    return NextResponse.json(
      { success: true, message: "Callback received successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("MPESA CALLBACK ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Failed to process callback" },
      { status: 500 },
    );
  }
}
