import { Router } from "express"
import Product from "../models/Product.js"

const router = Router()

router.post("/seed", async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production")
      return res.status(403).json({ ok: false, error: { message: "Forbidden" } })

    const MOCK_PRODUCTS = [
      { 
        name: "Deep Work", 
        price: 15.99, 
        category: "Books", 
        rating: 4.7, 
        stock: 24,
        img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800",
        description: "A comprehensive guide to focused work in an age of distraction. Learn how to develop deep work habits and achieve peak productivity."
      },
      { 
        name: "Clean Code", 
        price: 21.99, 
        category: "Books", 
        rating: 4.8, 
        stock: 18,
        img: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=800",
        description: "A handbook of agile software craftsmanship. Learn to write clean, maintainable code that other developers will love to work with."
      },
      { 
        name: "Wireless Headphones", 
        price: 59.0, 
        category: "Electronics", 
        rating: 4.5, 
        stock: 32,
        img: "https://images.unsplash.com/photo-1518441902110-266b0bff0c1a?q=80&w=800",
        description: "Premium wireless headphones with noise cancellation, 30-hour battery life, and crystal-clear sound quality."
      },
      { 
        name: "Mechanical Keyboard", 
        price: 89.99, 
        category: "Electronics", 
        rating: 4.6, 
        stock: 12,
        img: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=800",
        description: "Professional mechanical keyboard with RGB backlighting, tactile switches, and programmable keys for the ultimate typing experience."
      },
      { 
        name: "Minimalist Tee", 
        price: 12.5, 
        category: "Apparel", 
        rating: 4.2, 
        stock: 40,
        img: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800",
        description: "Soft, comfortable cotton t-shirt with a minimalist design. Perfect for everyday wear and layering."
      },
      { 
        name: "Comfy Hoodie", 
        price: 34.0, 
        category: "Apparel", 
        rating: 4.4, 
        stock: 17,
        img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800",
        description: "Cozy fleece hoodie with a relaxed fit. Features a kangaroo pocket and adjustable drawstring hood for ultimate comfort."
      },
      { 
        name: "Ceramic Mug", 
        price: 9.99, 
        category: "Home", 
        rating: 4.3, 
        stock: 50,
        img: "https://images.unsplash.com/photo-1473181488821-2d23949a045a?q=80&w=800",
        description: "Handcrafted ceramic mug with a beautiful glaze finish. Perfect for your morning coffee or evening tea."
      },
      { 
        name: "Scented Candle", 
        price: 14.99, 
        category: "Home", 
        rating: 4.6, 
        stock: 25,
        img: "https://images.unsplash.com/photo-1504197885-609741792ce7?q=80&w=800",
        description: "Luxury scented candle with a warm vanilla fragrance. Made with natural soy wax and cotton wick for clean burning."
      },
      { 
        name: "Vitamin C Serum", 
        price: 19.99, 
        category: "Beauty", 
        rating: 4.4, 
        stock: 30,
        img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=800",
        description: "Brightening vitamin C serum that helps reduce dark spots and improve skin texture. Suitable for all skin types."
      },
      { 
        name: "Face Moisturizer", 
        price: 16.5, 
        category: "Beauty", 
        rating: 4.2, 
        stock: 28,
        img: "https://images.unsplash.com/photo-1585238342028-4bbc1a0e3b51?q=80&w=800",
        description: "Hydrating face moisturizer with hyaluronic acid. Provides 24-hour moisture and helps maintain skin's natural barrier."
      },
    ]

    await Product.deleteMany({})
    const inserted = await Product.insertMany(MOCK_PRODUCTS)
    res.json({ ok: true, data: { inserted: inserted.length } })
  } catch (err) {
    next(err)
  }
})

export default router
