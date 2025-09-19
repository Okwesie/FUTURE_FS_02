-- SQL script to remove duplicate entries from your Neon PostgreSQL database
-- Run this in your Neon SQL editor or via psql

-- 1. Remove duplicate products (keep the one with the lowest ID)
DELETE FROM products 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM products 
    GROUP BY name, price, category
);

-- 2. Remove duplicate users (keep the one with the lowest ID)
DELETE FROM users 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM users 
    GROUP BY email
);

-- 3. Remove duplicate orders (keep the one with the lowest ID)
DELETE FROM orders 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM orders 
    GROUP BY user_id, created_at, items
);

-- 4. Reset the sequence counters to avoid ID conflicts
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));

-- 5. Show final counts
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Orders' as table_name, COUNT(*) as count FROM orders;
