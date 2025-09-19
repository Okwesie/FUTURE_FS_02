import pool from './connection.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing PostgreSQL database...')
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    await pool.query(schema)
    console.log('✅ Database schema created successfully')
    
    // Test connection
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Database connection test successful:', result.rows[0].now)
    
    // Check if products exist
    const productCount = await pool.query('SELECT COUNT(*) FROM products')
    console.log(`📦 Found ${productCount.rows[0].count} products in database`)
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message)
    throw error
  }
}

export default initializeDatabase
