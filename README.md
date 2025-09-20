# 🛒 E-Commerce Storefront

A complete, production-ready e-commerce platform built with Next.js frontend and Node.js/Express backend, powered by PostgreSQL.

## ✨ Features

- **🔐 User Authentication**: Secure registration, login, and JWT-based sessions
- **🛍️ Product Catalog**: Browse, search, filter, and sort products with pagination
- **🛒 Shopping Cart**: Add items, manage quantities, persistent storage
- **💳 Checkout Process**: Complete order flow with form validation and stock management
- **📦 Order Management**: View order history and order details
- **📱 Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- **🚀 Production Ready**: Fully configured for deployment to Vercel + Railway/Render

## 🎯 Live Demo

**Ready for deployment!** This application is fully functional and can be deployed to production in minutes.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended for cloud)

### 1. Database Setup (Neon PostgreSQL)

1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string
4. The database will be automatically set up with tables and sample data

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file with your Neon connection string
echo "DATABASE_URL=postgresql://username:password@host/database?sslmode=require" > .env
echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" >> .env
echo "CORS_ORIGIN=http://localhost:3000" >> .env
echo "NODE_ENV=development" >> .env
echo "PORT=4000" >> .env

# Initialize database and seed with sample data
npm run setup-db

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

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

## 🧪 Test the Application

1. **Browse Products**: Visit the homepage to see 12+ sample products
2. **Search & Filter**: Use the sidebar to filter by category, price, rating
3. **Add to Cart**: Click "Add to Cart" on any product
4. **User Registration**: Create a new account
5. **Checkout**: Complete a test order with sample data
6. **View Orders**: Check your order history in the profile section

## 🚀 Production Deployment

This application is **100% ready for deployment**! See the deployment guides:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist

### Quick Deploy:
1. **Backend**: Deploy to [Railway](https://railway.app) or [Render](https://render.com)
2. **Frontend**: Deploy to [Vercel](https://vercel.com)
3. **Database**: Already set up with Neon PostgreSQL

## 🛠️ Technology Stack

**Frontend:**
- Next.js 15 + React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- React Hook Form
- Zod Validation

**Backend:**
- Node.js + Express
- PostgreSQL (Neon)
- JWT Authentication
- bcryptjs Password Hashing
- Zod Validation
- CORS & Rate Limiting

**Database:**
- PostgreSQL with Neon
- JSONB for flexible data storage
- Automatic migrations and seeding

## 📁 Project Structure

```
├── app/                    # Next.js app router pages
│   ├── checkout/          # Checkout flow
│   ├── orders/            # Order history
│   └── profile/           # User profile
├── backend/               # Express.js API
│   ├── src/
│   │   ├── db/           # Database connection & schema
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth middleware
│   │   └── utils/        # Error handling
│   └── package.json
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── cart/             # Shopping cart components
│   ├── checkout/         # Checkout components
│   ├── products/         # Product display components
│   └── ui/               # Reusable UI components
├── contexts/             # React Context providers
└── hooks/                # Custom React hooks
```

## 🔧 Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
PORT=4000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Production Environment Variables:**
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

## 🎯 API Endpoints

### Products
- `GET /api/products` - List products with filtering, sorting, pagination
- `GET /api/products/:id` - Get single product details

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Orders
- `POST /api/orders/checkout` - Create new order (auth required)
- `GET /api/orders` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get specific order (auth required)

### Health
- `GET /api/health` - API health check

## 🗄️ Database Schema

**Products Table:**
- id, name, description, price, category, rating, stock, img, timestamps

**Users Table:**
- id, first_name, last_name, email, password_hash, timestamps

**Orders Table:**
- id, user_id, items (JSONB), totals (JSONB), shipping (JSONB), payment (JSONB), status, timestamps

## 🧪 Testing

The application includes comprehensive testing capabilities:

```bash
# Test backend endpoints
curl http://localhost:4000/api/health

# Test product listing
curl http://localhost:4000/api/products

# Test user registration
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional e-commerce interface
- **Dark/Light Mode**: Theme switching capability
- **Responsive Layout**: Mobile-first design
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation with helpful feedback
- **Toast Notifications**: Success and error notifications

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against abuse (production)
- **Input Validation**: Zod schema validation on all inputs
- **SQL Injection Protection**: Parameterized queries with pg

## 📊 Performance Features

- **Database Indexing**: Optimized queries with proper indexing
- **Connection Pooling**: Efficient database connection management
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for faster loads
- **Caching**: HTTP caching headers for static assets

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection**: Ensure your Neon connection string is correct
2. **CORS Errors**: Check that CORS_ORIGIN matches your frontend URL
3. **Build Errors**: Run `npm run build` to test production build
4. **Port Conflicts**: Change PORT in backend .env if 4000 is busy

### Getting Help:

- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Review the [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for step-by-step guidance
- Run `./deploy.sh` to verify your setup

---

**Built with ❤️ using Next.js, Express, and PostgreSQL**
