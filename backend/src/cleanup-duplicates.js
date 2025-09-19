import pool from './db/connection.js'

async function cleanupDuplicates() {
  try {
    console.log('🧹 Cleaning up duplicate entries...')
    
    // Remove duplicate products
    const productsResult = await pool.query(`
      DELETE FROM products 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM products 
        GROUP BY name, price, category
      )
    `)
    console.log(`✅ Removed ${productsResult.rowCount} duplicate products`)
    
    // Remove duplicate users
    const usersResult = await pool.query(`
      DELETE FROM users 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM users 
        GROUP BY email
      )
    `)
    console.log(`✅ Removed ${usersResult.rowCount} duplicate users`)
    
    // Remove duplicate orders
    const ordersResult = await pool.query(`
      DELETE FROM orders 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM orders 
        GROUP BY user_id, created_at, items
      )
    `)
    console.log(`✅ Removed ${ordersResult.rowCount} duplicate orders`)
    
    // Reset sequence counters
    await pool.query("SELECT setval('products_id_seq', (SELECT MAX(id) FROM products))")
    await pool.query("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))")
    await pool.query("SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders))")
    console.log('✅ Reset sequence counters')
    
    // Show final counts
    const counts = await pool.query(`
      SELECT 'Products' as table_name, COUNT(*) as count FROM products
      UNION ALL
      SELECT 'Users' as table_name, COUNT(*) as count FROM users
      UNION ALL
      SELECT 'Orders' as table_name, COUNT(*) as count FROM orders
    `)
    
    console.log('\n📊 Final table counts:')
    counts.rows.forEach(row => {
      console.log(`   ${row.table_name}: ${row.count}`)
    })
    
    console.log('\n🎉 Cleanup completed successfully!')
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message)
    throw error
  }
}

cleanupDuplicates()
  .then(() => {
    console.log('✅ Cleanup script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Cleanup script failed:', error)
    process.exit(1)
  })
