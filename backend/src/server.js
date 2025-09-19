import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import cors from "cors"
import rateLimit from "express-rate-limit"

import { errorHandler, notFound } from "./utils/errors.js"
import productsRouter from "./routes/products.js"
import authRouter from "./routes/auth.js"
import ordersRouter from "./routes/order.js"
import initializeDatabase from "./db/init.js"

dotenv.config()

const app = express()

// --- Middlewares ---
app.use(express.json())
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*", credentials: true }))

// Rate limiting - disabled for development
if (process.env.NODE_ENV === "production") {
  const limiter = rateLimit({ windowMs: 60 * 1000, limit: 1000 })
  app.use(limiter)
}

// --- Routes ---
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }))
app.use("/api/products", productsRouter)
app.use("/api/auth", authRouter)
app.use("/api/orders", ordersRouter)

// Dev-only routes can be added here if needed

// --- Errors ---
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000

// Start server
async function startServer() {
  try {
    await initializeDatabase()
    
    app.listen(PORT, () => {
      console.log(`🚀 API listening on :${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()
