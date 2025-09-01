import { Router } from "express"
import { z } from "zod"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ ok: false, error: { message: "Email already registered" } })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    const token = jwt.sign({ id: user._id, email, name }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.status(201).json({ ok: true, data: { token, user: { id: user._id, name, email } } })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400)
      return next(new Error(err.errors.map((e) => e.message).join(", ")))
    }
    next(err)
  }
})

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) })
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ ok: false, error: { message: "Invalid credentials" } })
    const match = await user.comparePassword(password)
    if (!match) return res.status(401).json({ ok: false, error: { message: "Invalid credentials" } })
    const token = jwt.sign({ id: user._id, email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.json({ ok: true, data: { token, user: { id: user._id, name: user.name, email } } })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400)
      return next(new Error(err.errors.map((e) => e.message).join(", ")))
    }
    next(err)
  }
})

export default router
