import mongoose, { Schema, model, models } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    bundle: {
      type: Schema.Types.ObjectId,
      ref: "Bundle",
      default: null,
    },
    paper: {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      default: null,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    reference: {
      type: String,
      required: [true, "Reference is required"],
      trim: true,
    },
    checkoutRequestId: {
      type: String,
      default: null,
      trim: true,
    },
    merchantRequestId: {
      type: String,
      default: null,
      trim: true,
    },
    paymentMethod: {
      type: String,
      default: "M-Pesa",
      trim: true,
    },
  },
  { timestamps: true },
);

const Payment = models.Payment || model("Payment", paymentSchema);

export default Payment;
