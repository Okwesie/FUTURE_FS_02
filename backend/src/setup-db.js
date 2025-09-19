import pool from './db/connection.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

async function setupDatabase() {
  try {
    console.log('🔄 Setting up PostgreSQL database...')
    
    // Test connection first
    const testResult = await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful:', testResult.rows[0].now)
    
    // Create tables
    console.log('📋 Creating database tables...')
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        rating DECIMAL(3,2) DEFAULT 0,
        stock INTEGER DEFAULT 0,
        img TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        items JSONB NOT NULL,
        totals JSONB NOT NULL,
        shipping JSONB NOT NULL,
        payment JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)')
    
    console.log('✅ Database tables created successfully')
    
    // Clear existing products and insert sample data
    console.log('📦 Populating with sample products...')
    await pool.query('DELETE FROM products')
    
    for (const product of sampleProducts) {
      await pool.query(
        `INSERT INTO products (name, price, category, rating, stock, img, description) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [product.name, product.price, product.category, product.rating, product.stock, product.img, product.description]
      )
    }
    
    console.log(`✅ Inserted ${sampleProducts.length} products`)
    
    // Verify setup
    const productCount = await pool.query('SELECT COUNT(*) FROM products')
    const categoriesResult = await pool.query('SELECT DISTINCT category FROM products ORDER BY category')
    const categories = categoriesResult.rows.map(row => row.category)
    
    console.log(`📊 Total products: ${productCount.rows[0].count}`)
    console.log(`📂 Categories: ${categories.join(', ')}`)
    
    console.log('🎉 Database setup completed successfully!')
    console.log('🚀 Your Neon PostgreSQL database is ready to use!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    throw error
  }
}

setupDatabase()
  .then(() => {
    console.log('✅ Setup script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Setup script failed:', error)
    process.exit(1)
  })
