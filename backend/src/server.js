import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import cors from "cors"
import rateLimit from "express-rate-limit"
import mongoose from "mongoose"

import { errorHandler, notFound } from "./utils/errors.js"
import productsRouter from "./routes/products.js"
import authRouter from "./routes/auth.js"
import ordersRouter from "./routes/orders.js"

dotenv.config()

const app = express()

// --- DB ---
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mini_storefront"
await mongoose.connect(MONGO_URI)

// --- Middlewares ---
app.use(express.json())
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*", credentials: true }))

const limiter = rateLimit({ windowMs: 60 * 1000, limit: 200 })
app.use(limiter)

// --- Routes ---
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }))
app.use("/api/products", productsRouter)
app.use("/api/auth", authRouter)
app.use("/api/orders", ordersRouter)

// Dev-only seed route
import seedRouter from "./seed/devRoute.js"
if (process.env.NODE_ENV !== "production") {
  app.use("/api/dev", seedRouter)
}

// --- Errors ---
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API listening on :${PORT}`))
