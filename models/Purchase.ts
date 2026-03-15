import mongoose, { Schema, model, models } from "mongoose";

const purchaseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    paper: {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      default: null,
    },

    bundle: {
      type: Schema.Types.ObjectId,
      ref: "Bundle",
      default: null,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, "Payment is required"],
    },
  },
  { timestamps: true }
);

const Purchase = models.Purchase || model("Purchase", purchaseSchema);

export default Purchase;