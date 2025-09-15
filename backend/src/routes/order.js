import { Router } from "express"
import { z } from "zod"
import Product from "../models/Product.js"
import Order from "../models/Order.js"
import { authRequired } from "../middleware/auth.js"

const router = Router()

// Validation schema for checkout
const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      qty: z.number().int().positive(),
    }),
  ),
  shipping: z.object({
    fullName: z.string().min(2),
    address: z.string().min(3),
    city: z.string().min(2),
    country: z.string().min(2),
    phone: z.string().min(6),
  }),
  payment: z.object({ method: z.enum(["card", "cash"]).default("card") }),
  clientTotal: z.number().positive(),
})

// POST /api/orders/checkout  (auth required)
router.post("/checkout", authRequired, async (req, res, next) => {
  try {
    const payload = checkoutSchema.parse(req.body)

    // Load products and verify stock
    const productIds = payload.items.map((i) => i.productId)
    const products = await Product.find({ _id: { $in: productIds } })

    if (products.length !== payload.items.length) {
      return res.status(400).json({ ok: false, error: { message: "Some products not found" } })
    }

    // Map for quick lookup
    const map = Object.fromEntries(products.map((p) => [String(p._id), p]))

    // Compute totals & check stock
    let subtotal = 0
    for (const item of payload.items) {
      const p = map[item.productId]
      if (!p || p.stock < item.qty) {
        return res
          .status(400)
          .json({ ok: false, error: { message: `Insufficient stock for ${p?.name || item.productId}` } })
      }
      subtotal += p.price * item.qty
    }

    const taxRate = 0.07 // 7% demo
    const shippingFlat = subtotal > 100 ? 0 : 6.99
    const tax = Number((subtotal * taxRate).toFixed(2))
    const grandTotal = Number((subtotal + tax + shippingFlat).toFixed(2))

    // Compare with clientTotal (allow 1 cent diff due to rounding)
    if (Math.abs(grandTotal - payload.clientTotal) > 0.01) {
      return res.status(400).json({ ok: false, error: { message: "Total mismatch. Refresh cart and try again." } })
    }

    // Decrement stock atomically within a session
    const session = await Product.startSession()
    session.startTransaction()
    try {
      for (const item of payload.items) {
        const p = map[item.productId]
        p.stock -= item.qty
        await p.save({ session })
      }

      const orderItems = payload.items.map((i) => ({
        productId: map[i.productId]._id,
        name: map[i.productId].name,
        price: map[i.productId].price,
        qty: i.qty,
      }))

      const order = await Order.create(
        [
          {
            userId: req.user.id,
            items: orderItems,
            totals: { subtotal, tax, shipping: shippingFlat, grandTotal, currency: "USD" },
            shipping: payload.shipping,
            payment: { method: payload.payment.method, status: "paid", reference: `SIM-${Date.now()}` },
            status: "paid",
          },
        ],
        { session },
      )

      await session.commitTransaction()
      session.endSession()

      res.status(201).json({ ok: true, data: order[0] })
    } catch (e) {
      await session.abortTransaction()
      session.endSession()
      throw e
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400)
      return next(new Error(err.errors.map((e) => e.message).join(", ")))
    }
    next(err)
  }
})

// GET /api/orders (auth) -> list current user's orders
router.get("/", authRequired, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json({ ok: true, data: orders })
  } catch (err) {
    next(err)
  }
})

// GET /api/orders/:id (auth)
router.get("/:id", authRequired, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id })
    if (!order) return res.status(404).json({ ok: false, error: { message: "Order not found" } })
    res.json({ ok: true, data: order })
  } catch (err) {
    next(err)
  }
})

export default router