import { Router } from "express"
import Product from "../models/Product.js"

const router = Router()

router.post("/seed", async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production")
      return res.status(403).json({ ok: false, error: { message: "Forbidden" } })

    const MOCK_PRODUCTS = [
      { name: "Deep Work", price: 15.99, category: "Books", rating: 4.7, stock: 24 },
      { name: "Clean Code", price: 21.99, category: "Books", rating: 4.8, stock: 18 },
      { name: "Wireless Headphones", price: 59.0, category: "Electronics", rating: 4.5, stock: 32 },
      { name: "Mechanical Keyboard", price: 89.99, category: "Electronics", rating: 4.6, stock: 12 },
      { name: "Minimalist Tee", price: 12.5, category: "Apparel", rating: 4.2, stock: 40 },
      { name: "Comfy Hoodie", price: 34.0, category: "Apparel", rating: 4.4, stock: 17 },
      { name: "Ceramic Mug", price: 9.99, category: "Home", rating: 4.3, stock: 50 },
      { name: "Scented Candle", price: 14.99, category: "Home", rating: 4.6, stock: 25 },
      { name: "Vitamin C Serum", price: 19.99, category: "Beauty", rating: 4.4, stock: 30 },
      { name: "Face Moisturizer", price: 16.5, category: "Beauty", rating: 4.2, stock: 28 },
    ]

    await Product.deleteMany({})
    const inserted = await Product.insertMany(MOCK_PRODUCTS)
    res.json({ ok: true, data: { inserted: inserted.length } })
  } catch (err) {
    next(err)
  }
})

export default router
