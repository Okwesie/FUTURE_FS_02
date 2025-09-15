import { Router } from "express"
import { z } from "zod"
import Product from "../models/Product.js"

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
    
    // Build filter object
    const filter = {}
    
    // Search filter
    if (query.search) {
      filter.name = { $regex: query.search, $options: "i" }
    }
    
    // Category filter
    if (query.category && query.category !== "All") {
      filter.category = query.category
    }
    
    // Price range filter
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {}
      if (query.minPrice !== undefined) {
        filter.price.$gte = query.minPrice
      }
      if (query.maxPrice !== undefined) {
        filter.price.$lte = query.maxPrice
      }
    }
    
    // Build sort object
    const sort = {}
    sort[query.sort] = query.order === "asc" ? 1 : -1
    
    // Calculate pagination
    const skip = (query.page - 1) * query.limit
    
    // Execute query with pagination
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(query.limit)
        .lean(),
      Product.countDocuments(filter)
    ])
    
    // Calculate pagination info
    const pages = Math.ceil(total / query.limit)
    
    res.json({
      ok: true,
      data: {
        items: products,
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
    const categories = await Product.distinct("category")
    res.json({
      ok: true,
      data: categories.sort()
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/products/:id - Get single product by ID
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean()
    
    if (!product) {
      return res.status(404).json({
        ok: false,
        error: { message: "Product not found" }
      })
    }
    
    res.json({
      ok: true,
      data: product
    })
  } catch (err) {
    next(err)
  }
})

export default router
