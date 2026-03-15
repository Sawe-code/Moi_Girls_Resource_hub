import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    bundle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bundle",
      default: null,
    },
    paper: {
      type: mongoose.Schema.Types.ObjectId,
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
    checkoutRequestId: {
      type: String,
      default: null
    },
    merchantRequestId: {
      type: String,
      default: null
    },
    reference: {
      type: String,
      default: "",
      trim: true,
    },
    paymentMethod: {
      type: String,
      default: "M-Pesa",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;