import jwt from "jsonwebtoken"

export function authRequired(req, res, next) {
  const auth = req.headers.authorization || ""
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null
  if (!token) return res.status(401).json({ ok: false, error: { message: "Missing token" } })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // { id, email, name }
    next()
  } catch (e) {
    return res.status(401).json({ ok: false, error: { message: "Invalid token" } })
  }
}
