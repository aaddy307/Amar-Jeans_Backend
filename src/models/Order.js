import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    orderType: { type: String, enum: ["order", "enquiry"], default: "enquiry" },
    totalPrice: { type: String, default: "0" },
    currencyCode: { type: String, default: "INR" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shippingAddress: { type: String },
    city: { type: String },
    pincode: { type: String },
    items: [{
      productId: String,
      title: String,
      price: Number,
      quantity: Number,
      size: String,
      image: String
    }],
    notes: { type: String },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

