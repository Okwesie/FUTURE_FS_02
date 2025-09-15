# 🛒 E-Commerce Storefront

A complete e-commerce platform built with Next.js frontend and Node.js/Express backend.

## ✨ Features

- **Product Catalog**: Browse, search, and filter products
- **Shopping Cart**: Add items, manage quantities, persistent storage
- **Checkout Process**: Complete order flow with form validation
- **User Authentication**: Register, login, and order history
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Quick Start

### 1. Set up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Get your connection string
6. Whitelist your IP (or use `0.0.0.0/0` for development)

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
echo "MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/mini_storefront?retryWrites=true&w=majority" > .env
echo "JWT_SECRET=your-secret-key-here" >> .env
echo "PORT=4000" >> .env

# Seed the database
npm run seed

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
# In project root
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local

# Start the frontend
npm run dev
```

## 🌐 Access

- **Frontend**: http://localhost:3000 (or 3001 if 3000 is busy)
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

## 📱 Test the Application

1. **Browse Products**: Visit the homepage
2. **Search & Filter**: Use the sidebar filters
3. **Add to Cart**: Click "Add to Cart" on products
4. **Checkout**: Create account and place an order
5. **View Orders**: Check your order history

## 🛠️ Technology Stack

**Frontend:**
- Next.js 15 + React 19
- TypeScript
- Tailwind CSS
- Radix UI Components

**Backend:**
- Node.js + Express
- MongoDB Atlas
- JWT Authentication
- Zod Validation

## 📁 Project Structure

```
├── app/                 # Next.js pages
├── backend/            # Express.js API
├── components/         # React components
├── contexts/           # State management
└── hooks/              # Custom hooks
```

## 🔧 Environment Variables

**Backend (.env):**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/mini_storefront
JWT_SECRET=your-secret-key
PORT=4000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🎯 API Endpoints

- `GET /api/products` - List products with filtering
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/orders/checkout` - Create order
- `GET /api/orders` - Get user orders

## 📚 Detailed Setup

For complete setup instructions, see [SETUP.md](./SETUP.md)

---

**Ready to go!** 🎉 The application is fully functional with all e-commerce features implemented.
