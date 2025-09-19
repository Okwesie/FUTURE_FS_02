import { Router } from "express"
import { z } from "zod"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "../db/connection.js"

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)
    
    // Split name into first and last name
    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    // Check if user already exists
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email])
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        ok: false, 
        error: { message: "Email already registered" } 
      })
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    
    // Create user
    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email, created_at",
      [firstName, lastName, email, passwordHash]
    )
    
    const user = result.rows[0]
    const token = jwt.sign(
      { id: user.id, email, name: `${firstName} ${lastName}`.trim() }, 
      process.env.JWT_SECRET || "fallback-secret", 
      { expiresIn: "7d" }
    )
    
    res.status(201).json({ 
      ok: true, 
      data: { 
        token, 
        user: { 
          id: user.id, 
          name: `${user.first_name} ${user.last_name}`.trim(), 
          email: user.email 
        } 
      } 
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400)
      return next(new Error(err.errors.map((e) => e.message).join(", ")))
    }
    next(err)
  }
})

const loginSchema = z.object({ 
  email: z.string().email(), 
  password: z.string().min(6) 
})

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    
    // Find user
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, password_hash FROM users WHERE email = $1",
      [email]
    )
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        ok: false, 
        error: { message: "Invalid credentials" } 
      })
    }
    
    const user = result.rows[0]
    
    // Check password
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ 
        ok: false, 
        error: { message: "Invalid credentials" } 
      })
    }
    
    const token = jwt.sign(
      { id: user.id, email, name: `${user.first_name} ${user.last_name}`.trim() }, 
      process.env.JWT_SECRET || "fallback-secret", 
      { expiresIn: "7d" }
    )
    
    res.json({ 
      ok: true, 
      data: { 
        token, 
        user: { 
          id: user.id, 
          name: `${user.first_name} ${user.last_name}`.trim(), 
          email: user.email 
        } 
      } 
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400)
      return next(new Error(err.errors.map((e) => e.message).join(", ")))
    }
    next(err)
  }
})

export default router