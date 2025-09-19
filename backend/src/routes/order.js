import { Router } from "express"
import { z } from "zod"
import pool from "../db/connection.js"
import { authRequired } from "../middleware/auth.js"

const router = Router()

// Validation schema for checkout
const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
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
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    const payload = checkoutSchema.parse(req.body)

    // Load products and verify stock
    const productIds = payload.items.map((i) => i.productId)
    const placeholders = productIds.map((_, index) => `$${index + 1}`).join(',')
    const productsResult = await client.query(
      `SELECT * FROM products WHERE id IN (${placeholders})`,
      productIds
    )

    if (productsResult.rows.length !== payload.items.length) {
      await client.query('ROLLBACK')
      return res.status(400).json({ ok: false, error: { message: "Some products not found" } })
    }

    // Map for quick lookup
    const map = Object.fromEntries(productsResult.rows.map((p) => [p.id, p]))

    // Compute totals & check stock
    let subtotal = 0
    for (const item of payload.items) {
      const p = map[item.productId]
      if (!p || p.stock < item.qty) {
        await client.query('ROLLBACK')
        return res
          .status(400)
          .json({ ok: false, error: { message: `Insufficient stock for ${p?.name || item.productId}` } })
      }
      subtotal += parseFloat(p.price) * item.qty
    }

    const taxRate = 0.07 // 7% demo
    const shippingFlat = subtotal > 100 ? 0 : 6.99
    const tax = Number((subtotal * taxRate).toFixed(2))
    const grandTotal = Number((subtotal + tax + shippingFlat).toFixed(2))

    // Compare with clientTotal (allow 1 cent diff due to rounding)
    if (Math.abs(grandTotal - payload.clientTotal) > 0.01) {
      await client.query('ROLLBACK')
      return res.status(400).json({ ok: false, error: { message: "Total mismatch. Refresh cart and try again." } })
    }

    // Decrement stock
    for (const item of payload.items) {
      const p = map[item.productId]
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.qty, item.productId]
      )
    }

    const orderItems = payload.items.map((i) => ({
      productId: map[i.productId].id,
      name: map[i.productId].name,
      price: parseFloat(map[i.productId].price),
      qty: i.qty,
    }))

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status, items, totals, shipping, payment) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [
        req.user.id,
        'paid',
        JSON.stringify(orderItems),
        JSON.stringify({ subtotal, tax, shipping: shippingFlat, grandTotal, currency: "USD" }),
        JSON.stringify(payload.shipping),
        JSON.stringify({ method: payload.payment.method, status: "paid", reference: `SIM-${Date.now()}` })
      ]
    )

    await client.query('COMMIT')
    
    const order = orderResult.rows[0]
    // JSON fields are already parsed by PostgreSQL

    res.status(201).json({ ok: true, data: order })
  } catch (err) {
    await client.query('ROLLBACK')
    if (err instanceof z.ZodError) {
      res.status(400)
      return next(new Error(err.errors.map((e) => e.message).join(", ")))
    }
    next(err)
  } finally {
    client.release()
  }
})

// GET /api/orders (auth) -> list current user's orders
router.get("/", authRequired, async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    )
    
    // JSON fields are already parsed by PostgreSQL
    const orders = result.rows
    
    res.json({ ok: true, data: orders })
  } catch (err) {
    next(err)
  }
})

// GET /api/orders/:id (auth)
router.get("/:id", authRequired, async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: { message: "Order not found" } })
    }
    
    const order = result.rows[0]
    // JSON fields are already parsed by PostgreSQL
    
    res.json({ ok: true, data: order })
  } catch (err) {
    next(err)
  }
})

export default router