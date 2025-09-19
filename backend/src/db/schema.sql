-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
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
);

-- Create orders table
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
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Insert sample products
INSERT INTO products (name, price, category, rating, stock, img, description) VALUES
('Deep Work', 15.99, 'Books', 4.7, 24, 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800', 'A comprehensive guide to focused work in an age of distraction. Learn how to develop deep work habits and achieve peak productivity.'),
('Wireless Headphones', 89.99, 'Electronics', 4.5, 15, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800', 'High-quality wireless headphones with noise cancellation and premium sound quality.'),
('Coffee Maker', 45.99, 'Home & Kitchen', 4.3, 8, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800', 'Automatic drip coffee maker with programmable timer and thermal carafe.'),
('Running Shoes', 120.00, 'Sports', 4.6, 12, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800', 'Comfortable running shoes with advanced cushioning and breathable mesh upper.'),
('Laptop Stand', 35.99, 'Electronics', 4.2, 20, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800', 'Adjustable aluminum laptop stand for better ergonomics and cooling.'),
('Yoga Mat', 25.99, 'Sports', 4.4, 18, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800', 'Non-slip yoga mat with carrying strap, perfect for all types of yoga practice.'),
('Bluetooth Speaker', 65.99, 'Electronics', 4.1, 10, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800', 'Portable Bluetooth speaker with 360-degree sound and waterproof design.'),
('Desk Lamp', 42.99, 'Home & Kitchen', 4.0, 14, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800', 'LED desk lamp with adjustable brightness and color temperature.'),
('Water Bottle', 18.99, 'Sports', 4.5, 25, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800', 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours.'),
('Phone Case', 24.99, 'Electronics', 4.3, 30, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800', 'Protective phone case with shock absorption and wireless charging compatibility.')
ON CONFLICT DO NOTHING;
