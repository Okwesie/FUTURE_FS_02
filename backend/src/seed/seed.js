import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "../models/Product.js"

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mini_storefront"

const MOCK_PRODUCTS = [
  {
    name: "Deep Work",
    price: 15.99,
    category: "Books",
    rating: 4.7,
    stock: 24,
    img: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800",
  },
  {
    name: "Clean Code",
    price: 21.99,
    category: "Books",
    rating: 4.8,
    stock: 18,
    img: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=800",
  },
  {
    name: "Wireless Headphones",
    price: 59.0,
    category: "Electronics",
    rating: 4.5,
    stock: 32,
    img: "https://images.unsplash.com/photo-1518441902110-266b0bff0c1a?q=80&w=800",
  },
  {
    name: "Mechanical Keyboard",
    price: 89.99,
    category: "Electronics",
    rating: 4.6,
    stock: 12,
    img: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=800",
  },
  {
    name: "Minimalist Tee",
    price: 12.5,
    category: "Apparel",
    rating: 4.2,
    stock: 40,
    img: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800",
  },
  {
    name: "Comfy Hoodie",
    price: 34.0,
    category: "Apparel",
    rating: 4.4,
    stock: 17,
    img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800",
  },
  {
    name: "Ceramic Mug",
    price: 9.99,
    category: "Home",
    rating: 4.3,
    stock: 50,
    img: "https://images.unsplash.com/photo-1473181488821-2d23949a045a?q=80&w=800",
  },
  {
    name: "Scented Candle",
    price: 14.99,
    category: "Home",
    rating: 4.6,
    stock: 25,
    img: "https://images.unsplash.com/photo-1504197885-609741792ce7?q=80&w=800",
  },
  {
    name: "Vitamin C Serum",
    price: 19.99,
    category: "Beauty",
    rating: 4.4,
    stock: 30,
    img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=800",
  },
  {
    name: "Face Moisturizer",
    price: 16.5,
    category: "Beauty",
    rating: 4.2,
    stock: 28,
    img: "https://images.unsplash.com/photo-1585238342028-4bbc1a0e3b51?q=80&w=800",
  },
]

async function run() {
  await mongoose.connect(MONGO_URI)
  await Product.deleteMany({})
  const inserted = await Product.insertMany(
    MOCK_PRODUCTS.map((p) => ({ ...p, description: `${p.name} – awesome product.` })),
  )
  console.log(`Seeded ${inserted.length} products.`)
  await mongoose.disconnect()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
