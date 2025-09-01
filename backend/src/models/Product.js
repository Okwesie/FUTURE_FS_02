import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    img: { type: String },
    description: { type: String, default: "" },
  },
  { timestamps: true },
)

export default mongoose.model("Product", productSchema)
