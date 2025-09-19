import { Router } from "express"
import { z } from "zod"
import pool from "../db/connection.js"

const router = Router()

// Validation schema for product queries
const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(["name", "price", "rating", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
})

// GET /api/products - List products with filtering, searching, and pagination
router.get("/", async (req, res, next) => {
  try {
    const query = productQuerySchema.parse(req.query)
    
    // Build WHERE clause
    let whereClause = "WHERE 1=1"
    const params = []
    let paramCount = 0

    // Search filter
    if (query.search) {
      paramCount++
      whereClause += ` AND name ILIKE $${paramCount}`
      params.push(`%${query.search}%`)
    }

    // Category filter
    if (query.category && query.category !== "All") {
      paramCount++
      whereClause += ` AND category = $${paramCount}`
      params.push(query.category)
    }

    // Price range filter
    if (query.minPrice !== undefined) {
      paramCount++
      whereClause += ` AND price >= $${paramCount}`
      params.push(query.minPrice)
    }
    if (query.maxPrice !== undefined) {
      paramCount++
      whereClause += ` AND price <= $${paramCount}`
      params.push(query.maxPrice)
    }

    // Sorting
    const sortDirection = query.order === "asc" ? "ASC" : "DESC"
    const sortColumn = query.sort === "createdAt" ? "created_at" : query.sort

    // Pagination
    const offset = (query.page - 1) * query.limit

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`
    const countResult = await pool.query(countQuery, params)
    const total = parseInt(countResult.rows[0].count)

    // Get products
    const productsQuery = `
      SELECT * FROM products 
      ${whereClause} 
      ORDER BY ${sortColumn} ${sortDirection} 
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `
    const productsParams = [...params, query.limit, offset]
    const productsResult = await pool.query(productsQuery, productsParams)

    // Calculate pagination info
    const pages = Math.ceil(total / query.limit)
    
    res.json({
      ok: true,
      data: {
        items: productsResult.rows,
        total,
        page: query.page,
        pages,
        limit: query.limit,
        hasNext: query.page < pages,
        hasPrev: query.page > 1,
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

// GET /api/products/categories - Get all available categories
router.get("/categories", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT DISTINCT category FROM products ORDER BY category")
    const categories = result.rows.map(row => row.category)
    
    res.json({
      ok: true,
      data: categories
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/products/:id - Get single product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: { message: "Product not found" }
      })
    }
    
    res.json({
      ok: true,
      data: result.rows[0]
    })
  } catch (err) {
    next(err)
  }
})

export default router