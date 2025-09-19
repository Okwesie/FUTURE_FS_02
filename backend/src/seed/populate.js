import pool from '../db/connection.js'

const sampleProducts = [
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
    name: "Wireless Headphones",
    price: 89.99,
    category: "Electronics",
    rating: 4.5,
    stock: 15,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality."
  },
  {
    name: "Coffee Maker",
    price: 45.99,
    category: "Home & Kitchen",
    rating: 4.3,
    stock: 8,
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800",
    description: "Automatic drip coffee maker with programmable timer and thermal carafe."
  },
  {
    name: "Running Shoes",
    price: 120.00,
    category: "Sports",
    rating: 4.6,
    stock: 12,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800",
    description: "Comfortable running shoes with advanced cushioning and breathable mesh upper."
  },
  {
    name: "Laptop Stand",
    price: 35.99,
    category: "Electronics",
    rating: 4.2,
    stock: 20,
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800",
    description: "Adjustable aluminum laptop stand for better ergonomics and cooling."
  },
  {
    name: "Yoga Mat",
    price: 25.99,
    category: "Sports",
    rating: 4.4,
    stock: 18,
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
    description: "Non-slip yoga mat with carrying strap, perfect for all types of yoga practice."
  },
  {
    name: "Bluetooth Speaker",
    price: 65.99,
    category: "Electronics",
    rating: 4.1,
    stock: 10,
    img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800",
    description: "Portable Bluetooth speaker with 360-degree sound and waterproof design."
  },
  {
    name: "Desk Lamp",
    price: 42.99,
    category: "Home & Kitchen",
    rating: 4.0,
    stock: 14,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
    description: "LED desk lamp with adjustable brightness and color temperature."
  },
  {
    name: "Water Bottle",
    price: 18.99,
    category: "Sports",
    rating: 4.5,
    stock: 25,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours."
  },
  {
    name: "Phone Case",
    price: 24.99,
    category: "Electronics",
    rating: 4.3,
    stock: 30,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800",
    description: "Protective phone case with shock absorption and wireless charging compatibility."
  },
  {
    name: "Gaming Mouse",
    price: 79.99,
    category: "Electronics",
    rating: 4.8,
    stock: 16,
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800",
    description: "High-precision gaming mouse with customizable RGB lighting and programmable buttons."
  },
  {
    name: "Mechanical Keyboard",
    price: 129.99,
    category: "Electronics",
    rating: 4.6,
    stock: 12,
    img: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=800",
    description: "Premium mechanical keyboard with Cherry MX switches and RGB backlighting."
  }
]

async function populateDatabase() {
  try {
    console.log('🔄 Populating PostgreSQL database with sample data...')
    
    // Clear existing products
    await pool.query('DELETE FROM products')
    console.log('✅ Cleared existing products')
    
    // Insert sample products
    for (const product of sampleProducts) {
      await pool.query(
        `INSERT INTO products (name, price, category, rating, stock, img, description) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [product.name, product.price, product.category, product.rating, product.stock, product.img, product.description]
      )
    }
    
    console.log(`✅ Inserted ${sampleProducts.length} products`)
    
    // Verify insertion
    const result = await pool.query('SELECT COUNT(*) FROM products')
    console.log(`📦 Total products in database: ${result.rows[0].count}`)
    
    // Show categories
    const categoriesResult = await pool.query('SELECT DISTINCT category FROM products ORDER BY category')
    const categories = categoriesResult.rows.map(row => row.category)
    console.log(`📂 Available categories: ${categories.join(', ')}`)
    
    console.log('🎉 Database population completed successfully!')
    
  } catch (error) {
    console.error('❌ Error populating database:', error.message)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateDatabase()
    .then(() => {
      console.log('✅ Population script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Population script failed:', error)
      process.exit(1)
    })
}

export default populateDatabase
