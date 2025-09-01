import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totals: {
      subtotal: Number,
      tax: Number,
      shipping: Number,
      grandTotal: Number,
      currency: { type: String, default: "USD" },
    },
    shipping: {
      fullName: String,
      address: String,
      city: String,
      country: String,
      phone: String,
    },
    payment: {
      method: { type: String, enum: ["card", "cash"], default: "card" },
      status: { type: String, enum: ["paid", "failed", "pending"], default: "paid" },
      reference: String,
    },
    status: { type: String, enum: ["created", "paid", "cancelled"], default: "paid" },
  },
  { timestamps: true },
)

export default mongoose.model("Order", orderSchema)
